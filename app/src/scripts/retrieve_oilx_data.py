#!/usr/bin/python
"""
Helper script to create location and data separation from mobility data

Usage:
docker run --rm -it -v $PWD:/working -v $PWD/../../public:/public eurodatacube/jupyter-user:0.19.6 /opt/conda/envs/eurodatacube-0.19.6/bin/python3 /working/retrieve_oilx_data.py

If issues with write permission you might have to add a user as parameter
with the same user id as your local account, e.g. "--user 1001"
"""


import os
import os.path
import csv
import datetime
import collections
import json
import requests
from dotenv.main import DotEnv

dot_env = DotEnv("/public/.env")
dot_env.set_as_environment_variables()
envs = dot_env.dict()


output_folder = "/public/eodash-data/internal/"
indicator_code = "OX"


DATAFILE = "/working/tmp/oilx_{}.json".format(
    datetime.datetime.utcnow().strftime("%Y-%m-%d")
)

EUDATAFILE = "/working/tmp/oilx_EU_{}.json".format(
    datetime.datetime.utcnow().strftime("%Y-%m-%d")
)

api_url = "https://esarace.oilx.co/esarace/v1/clusters"
europe_url = "https://esarace.oilx.co/esarace/v1/europe"

# Handle global data
if not os.path.isfile(DATAFILE):
    print("Downloading the latest oilx data")
    myfile = requests.get(
        api_url,
        headers={'Authorization': 'OilXApiKeyV1 %s' % envs['OILX_KEY']},
        allow_redirects=True
    )
    open(DATAFILE, "wb").write(myfile.content)


poi_dict = {}

country_mapping = {
    "Cork" : "IE",
    "Dalmeny" : "GB",
    "Finnart" : "GB",
    "Grangemouth" : "GB",
    "Rotterdam" : "NL",
    "Sarroch" : "IT",
    "Schwechat" : "AT",
    "Antwerp" : "BE",
    "Omisalj" : "HR",
    "Wilhelmshaven" : "DE",
    "Aspropyrgos" : "GR",
    "Corinth" : "GR",
    "Elefsina" : "GR",
    "Pachi" : "GR",
    "Thessaloniki" : "GR",
    "Teesport" : "GB",
    "Trieste" : "IT",
    "Sullom Voe" : "GB",
    "Le Havre": "FR",
    "Godorf Wesseling": "DE",
    "Fos-Lavera": "FR",
    "Algeciras": "ES",
    "Cartagena": "ES",
    "Tarragona": "ES"
}

with open(DATAFILE) as f:
    content = json.load(f)
    clusters = (content["data"])
    for cluster in clusters:
        poi_data = []
        for entry in cluster["series"]:
            poi_data.append({
                "color_code": entry["Band"],
                "data_provider": "OILX",
                "eo_sensor": "",
                "indicator_value": "",
                "input_data": "",
                "measurement_value": "%s"%entry["Rate"],
                "reference_time": "",
                "reference_value": "",
                "time": datetime.datetime.strptime(entry["Date"], '%Y-%m-%d')
            })
        for site in cluster["sites"]:
            # retrieve band information
            curr_poi_data = []
            for index, element in enumerate(site["properties"]["series"]):
                curr_el = dict(poi_data[index])
                curr_el["indicator_value"] = element["Band"]
                curr_poi_data.append(curr_el)
            poi_key = "%s-%s" % (site["properties"]["id"], indicator_code)
            coords = site["geometry"]["coordinates"]
            poi_dict[poi_key] = {
                # Unique poi data
                "aoi": "%s,%s"%(coords[1], coords[0]),
                "aoiID": "%s"%site["properties"]["id"],
                "country": country_mapping[site["properties"]["name"]],
                "indicator": indicator_code,
                "siteName": "",
                "city": site["properties"]["name"],
                "region": "",
                "description": "Crude Oil Storage Index",
                "indicatorName": "%s cluster"%cluster["name"],
                "yAxis": "[%]",
                "subAoi": "",
                "updateFrequency": "weekly",
                "poi_data": curr_poi_data,
            }

def date_converter(obj):
    if isinstance(obj, datetime.datetime):
        return obj.strftime('%Y-%m-%dT%H:%M:%S')


outKeys = [
    "aoi", "aoiID", "country", "indicator", "siteName", "city", "region",
    "description", "indicatorName", "yAxis", "subAoi",
    "lastTime",
    "lastMeasurement",
    "lastColorCode",
    "lastIndicatorValue",
    "lastReferenceTime",
    "lastReferenceValue",
    "updateFrequency"
]

# Sort poi_data by time
for poi_key in poi_dict:
    poi_dict[poi_key]["poi_data"] = sorted(
        poi_dict[poi_key]["poi_data"], key=lambda k: k["time"]
    )
    curr_data = poi_dict[poi_key]["poi_data"]
    # Save latest valid values for unique poi list
    poi_dict[poi_key]["lastTime"] = ([""] + [i["time"] for i in curr_data if i["time"] not in ["", 'NaN', '/']])[-1]
    poi_dict[poi_key]["lastMeasurement"] = ([""] + [i["measurement_value"] for i in curr_data if i["measurement_value"] not in ["", 'NaN', '/']])[-1]
    poi_dict[poi_key]["lastColorCode"] = ([""] + [i["indicator_value"] for i in curr_data if i["indicator_value"] not in ["", 'NaN', '/']])[-1].split(" ")[0]
    poi_dict[poi_key]["lastIndicatorValue"] = ([""] + [i["indicator_value"] for i in curr_data if i["indicator_value"] not in ["", 'NaN', '/']])[-1]
    poi_dict[poi_key]["lastReferenceTime"] = ([""] + [i["reference_time"] for i in curr_data if i["reference_time"] not in ["", 'NaN', '/']])[-1]
    poi_dict[poi_key]["lastReferenceValue"] = ([""] + [i["reference_value"] for i in curr_data if i["reference_value"] not in ["", 'NaN', '/']])[-1]

# Append locations to pois files
pois_files = [
    # "/public/data/internal/pois_trilateral.json",
    "/public/data/internal/pois_eodash.json",
]

output_dict = {key: {subkey: poi_dict[key][subkey] for subkey in outKeys} for key in poi_dict}

for output_file in pois_files:
    with open(output_file) as f:
        json_data = json.load(f)
        # delete previous oilx indicators
        json_data = [entry for entry in json_data if entry["indicator"] != "OX"]
        ordered_dict = collections.OrderedDict(sorted(output_dict.items()))
        json_data.extend(ordered_dict.values())
    with open(output_file, "w") as fp:
        json.dump(json_data, fp, indent=4, default=date_converter, sort_keys=True)


# Generate all unique location json files
for poi_key in poi_dict:
    with open("%s%s.json" % (output_folder, poi_key), "w") as gp:
        json.dump(poi_dict[poi_key]["poi_data"], gp, indent=4, default=date_converter, sort_keys=True)




# Handle EU data
if not os.path.isfile(EUDATAFILE):
    print("Downloading the latest oilx EU data")
    myfile = requests.get(
        europe_url,
        headers={'Authorization': 'OilXApiKeyV1 %s' % os.getenv('OILX_KEY')},
        allow_redirects=True
    )
    open(EUDATAFILE, "wb").write(myfile.content)

with open(EUDATAFILE) as f:
    content = json.load(f)
    poi_data = []
    for entry in content["data"]:
        poi_data.append({
            "color_code": entry["Band"],
            "data_provider": "OILX",
            "eo_sensor": "",
            "indicator_value": entry["Band"],
            "input_data": "",
            "measurement_value": "%s"%entry["Rate"],
            "reference_time": "",
            "reference_value": "",
            "time": datetime.datetime.strptime(entry["Date"], '%Y-%m-%d'),
            "siteName": "global",
        })
    # Sort entries by date
    poi_data = sorted(
        poi_data, key=lambda k: k["time"]
    )

# Generate  json file for EU
with open("%s%s.json" % (output_folder, "EU1-OX"), "w") as gp:
    json.dump(poi_data, gp, indent=4, default=date_converter, sort_keys=True)
