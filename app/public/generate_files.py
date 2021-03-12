#!/usr/bin/python
"""
Helper script to create location and data separation

Usage:
docker run --rm -it -v $PWD/../src/config:/config -v $PWD:/working eurodatacube/jupyter-user:0.19.6 /opt/conda/envs/eurodatacube-0.19.6/bin/python3 /working/generate_files.py

If issues with write permission you might have to add a user as parameter
with the same user id as your local account, e.g. "--user 1001"
"""

import os, shutil
import json
import csv
import datetime
import collections
import requests
from dotenv.main import find_dotenv, DotEnv
from xcube_geodb.core.geodb import GeoDBClient

dot_env = DotEnv("/working/.env")
dot_env.set_as_environment_variables()
geodb = GeoDBClient()
envs = dot_env.dict()

# Function to fetch all available dates for BYOD collections
# Make sure all appropiate collection ids are set in your docker environment
COLLECTIONS = [
    "N3_CUSTOM", "N3_CUSTOM_TSMNN", "E12C_NEW_MOTORWAY",
    "E12D_NEW_PRIMARYROADS", "ICEYE-E3", "ICEYE-E11", "ICEYE-E11A", "ICEYE-E12B",
    "ICEYE-E13B","N3_CUSTOM_TRILATERAL", "N3_CUSTOM_TRILATERAL_TSMNN",
    "JAXA_TSM", "JAXA_CHLA"
]

# Some datasets have different dates for different areas so we need to separate
# the request to only retrieve dates from those locations
BBOX = {
    "JAXA_CHLA": [
        ("44.48,12.05,45.82,13.85", "NorthAdriatic_JAXA"),
        ("34.838,139.24,35.6932,140.266", "JP01"),
        ("34.2,136.4,35.2,137.4", "JP04"),
        ("33.85,134.5,34.85,135.5", "JP02"),
    ],
    "JAXA_TSM": [
        ("44.48,12.05,45.82,13.85", "NorthAdriaticTSM_JAXA"),
        ("34.838,139.24,35.6932,140.266", "JP01TSM"),
        ("34.2,136.4,35.2,137.4", "JP04TSM"),
        ("33.85,134.5,34.85,135.5", "JP02TSM"),
    ],
}

# TODO: what to do about SENTINEL-2-L2A-TRUE-COLOR collection, not BYOD

WFSENDPOINT = "https://shservices.mundiwebservices.com/ogc/wfs/"
REQUESTOPTIONS = "?REQUEST=%s&srsName=%s&TIME=%s&outputformat=%s"%(
    "GetFeature", "EPSG:4326",
    "1900-01-01/3000-02-01", "application/json"
)

date_data_file = '/config/data_dates.json'
results_dict = {}

def retrieve_entries(url, offset):
    r = requests.get("%s&FEATURE_OFFSET=%s"%(url, (offset*100)))
    json_resp = r.json()
    features = json_resp["features"]
    res = []
    [res.append(f["properties"]["date"]) for f in features if f["properties"]["date"] not in res]
    if len(features) == 100:
        res.extend(retrieve_entries(url, offset+1))
    return res

print("Fetching information of available dates for BYOD data")
for key in COLLECTIONS:
    # fetch identifier from environment
    if key in envs:
        coll_id = envs[key]
        layer_name = "&TYPENAMES=DSS10-%s"%(coll_id)
        if key in BBOX:
            # There are multiple locations for this dataset so we do
            # requests for each location
            for (val, subr_key) in BBOX[key]:
                bbox = "&BBOX=%s"%val
                request = "%s%s%s%s%s"%(
                    WFSENDPOINT, envs["SH_INSTANCE_ID"], REQUESTOPTIONS,
                    layer_name, bbox
                )
                results = retrieve_entries(request, 0)
                results.sort()
                results_dict[("%s_%s"%(key, subr_key))] = results
        else:
            bbox = "&BBOX=-180,90,180,-90"
            request = "%s%s%s%s%s"%(
                WFSENDPOINT, envs["SH_INSTANCE_ID"], REQUESTOPTIONS,
                layer_name, bbox
            )
            results = retrieve_entries(request, 0)
            results = list(set(results))
            results.sort()
            results_dict[key] = results
    else:
        print("Key for %s not found in environment variables"%key)

print("Writing results to %s"%date_data_file)
with open(date_data_file, "w") as fp:
    json.dump(results_dict, fp, indent=4, sort_keys=True)

###############################################################################

delete_files = True

geoDB_map = {
    "aoi": "aoi",
    "aoiID": "aoi_id",
    "lastColorCode": "color_code",
    "country": "country",
    "geometry": "geometry",
    "indicator": "indicator_code",
    "lastIndicatorValue": "indicator_value",
    "lastTime": "max_time",
    "lastMeasurement": "measurement_value",
    "siteName": "site_name",
    "subAoi": "sub_aoi",
    "city": "city",
    "description": "description",
    "indicatorName": "indicator_name",
    "region": "region",
    "updateFrequency": "update_frequency",
    "yAxis": "y_axis"
}

geoDB_array_map = {
    "eo_sensor": "eo_sensor",
    "input_data": "input_data",
    "time": "time",
    "measurement_value": "measurement_value",
    "reference_time": "reference_time",
    "reference_value": "reference_value",
    "indicator_value": "indicator_value",
    "color_code": "color_code",
    "data_provider": "data_provider",
    "site_name_arr": "site_name"
}

default_map = {
    "aoi": "AOI",
    "aoiID": "AOI_ID",
    "lastColorCode": "Color code",
    "country": "Country",
    # "geometry": "geometry",
    "indicator": "Indicator code",
    "siteName": "Site Name",
    "subAoi": "Sub-AOI",
    "city": "City",
    "description": "Description",
    "indicatorName": "Indicator Name",
    "lastTime": "max_time",
    "lastMeasurement": "Measurement Value",
    "lastIndicatorValue": "Indicator Value",
    "lastReferenceTime": "reference date time [yyyy-mm-ddthh:mm:ss]",
    "lastReferenceValue": "reference value [float]",
    "region": "Region",
    "updateFrequency": "Update Frequency",
    "yAxis": "Y axis",
}

default_array_map = {
    "eo_sensor": "EO Sensor",
    "input_data": "Input Data",
    "time": "Time",
    "measurement_value": "Measurement Value",
    "reference_time": "Reference time",
    "reference_value": "Reference value",
    "indicator_value": "Indicator Value",
    "color_code": "Color code",
    "data_provider": "Data Provider",
    "site_name_arr": "Site Name"
}


def try_parsing_date(text, line):
    for fmt in ('%Y-%m-%dT%H:%M:%S', '%Y-%m-%d'):
        try:
            return datetime.datetime.strptime(text.strip(), fmt)
        except ValueError:
            pass
    raise ValueError(f'time "{text}" not provided in valid format, full line "{line}"')


def generateData(
    mapping, array_mapping, input_folder, output_file, output_folder,
    local_files=[], geoDB_indicators=[], input_json=None):

    poi_dict = {}

    # Clear output folder
    if delete_files:
        for filename in os.listdir(output_folder):
            file_path = os.path.join(output_folder, filename)
            try:
                if os.path.isfile(file_path) or os.path.islink(file_path):
                    os.unlink(file_path)
                elif os.path.isdir(file_path):
                    shutil.rmtree(file_path)
            except Exception as e:
                print('Failed to delete %s. Reason: %s' % (file_path, e))

    # Load geodb data
    cm = geoDB_map
    cm_arr = geoDB_array_map

    for indicator in geoDB_indicators:
        indicator_id = indicator[0]
        indicator_query = indicator[1]
        try:
            indicator_data = geodb.get_collection(indicator_id, database='eodash', query=indicator_query)
            for index, line in indicator_data.iterrows():
                # Aggregate data for unique pois and write unique data to poi_dict
                poi_key = "%s-%s" % (line[cm["aoiID"]], line[cm["indicator"]])
                if poi_key in poi_dict:
                    # If key already saved we add the relevant data
                    object_always_present = {
                        "eo_sensor": line[cm_arr["eo_sensor"]],
                        "input_data": line[cm_arr["input_data"]],
                        "time": try_parsing_date(line[cm_arr["time"]], line),
                        "measurement_value": line[cm_arr["measurement_value"]],
                        "reference_time": line[cm_arr["reference_time"]],
                        "reference_value": line[cm_arr["reference_value"]],
                        "indicator_value": line[cm_arr["indicator_value"]],
                        "color_code": line[cm_arr["color_code"]],
                        "data_provider": line[cm_arr["data_provider"]],
                    }
                    if line[cm["indicator"]] in ["E10a3", "E10a8"]:
                        object_always_present["site_name_arr"] = line[cm_arr["site_name_arr"]]
                    poi_dict[poi_key]["poi_data"].append(object_always_present)
                else:
                    poi_data_always = [{
                        "eo_sensor": line[cm_arr["eo_sensor"]],
                        "input_data": line[cm_arr["input_data"]],
                        "time": try_parsing_date(line[cm_arr["time"]], line),
                        "measurement_value": line[cm_arr["measurement_value"]],
                        "color_code": line[cm_arr["color_code"]],
                        "indicator_value": line[cm_arr["indicator_value"]],
                        "reference_time": line[cm_arr["reference_time"]],
                        "reference_value": line[cm_arr["reference_value"]],
                        "data_provider": line[cm_arr["data_provider"]],
                    }]
                    if line[cm["indicator"]] in ["E10a3", "E10a8"]:
                        poi_data_always[0]["site_name_arr"] = line[cm_arr["site_name_arr"]]
                    poi_dict[poi_key] = {
                        # Unique poi data
                        "aoi": line[cm["aoi"]],
                        "aoiID": line[cm["aoiID"]],
                        "country": line[cm["country"]],
                        "indicator": line[cm["indicator"]],
                        "siteName": line[cm["siteName"]],
                        "city": line[cm["city"]],
                        "region": line[cm["region"]],
                        "description": line[cm["description"]],
                        "indicatorName": line[cm["indicatorName"]],
                        "yAxis": line[cm["yAxis"]],
                        "subAoi": line[cm["subAoi"]],
                        "updateFrequency": line[cm["updateFrequency"]],
                        # Actual data
                        "poi_data": poi_data_always,
                    }
        except Exception as e:
            print(
                "WARNING: Issue reading indicator %s from GeoDB and thus "
                "skipped for generation" % (indicator_id)
            )
            print("Exception: %s" % e)

    # Load all csv listed in local files
    cm = mapping
    cm_arr = array_mapping
    for file_path in local_files:
        try:
            with open(file_path) as csvfile:
                reader = csv.DictReader(csvfile, delimiter=",", quotechar='"')
                for line in reader:
                    # Aggregate data for unique pois and write unique data to poi_dict
                    poi_key = "%s-%s" % (line[cm["aoiID"]], line[cm["indicator"]])
                    if poi_key in poi_dict:
                        # If key already saved we add the relevant data
                        object_always_present = {
                            "eo_sensor": line[cm_arr["eo_sensor"]],
                            "input_data": line[cm_arr["input_data"]],
                            "time": try_parsing_date(line[cm_arr["time"]], line),
                            "measurement_value": line[cm_arr["measurement_value"]],
                            "reference_time": line[cm_arr["reference_time"]],
                            "reference_value": line[cm_arr["reference_value"]],
                            "indicator_value": line[cm_arr["indicator_value"]],
                            "color_code": line[cm_arr["color_code"]],
                            "data_provider": line[cm_arr["data_provider"]],
                        }
                        if line[cm["indicator"]] in ["E10a3", "E10a8"]:
                            object_always_present["site_name_arr"] = line[cm_arr["site_name_arr"]]
                        poi_dict[poi_key]["poi_data"].append(object_always_present)
                    else:
                        poi_data_always = [{
                            "eo_sensor": line[cm_arr["eo_sensor"]],
                            "input_data": line[cm_arr["input_data"]],
                            "time": try_parsing_date(line[cm_arr["time"]], line),
                            "measurement_value": line[cm_arr["measurement_value"]],
                            "color_code": line[cm_arr["color_code"]],
                            "indicator_value": line[cm_arr["indicator_value"]],
                            "reference_time": line[cm_arr["reference_time"]],
                            "reference_value": line[cm_arr["reference_value"]],
                            "data_provider": line[cm_arr["data_provider"]],
                        }]
                        if line[cm["indicator"]] in ["E10a3", "E10a8"]:
                            poi_data_always[0]["site_name_arr"] = line[cm_arr["site_name_arr"]]
                        poi_dict[poi_key] = {
                            # Unique poi data
                            "aoi": line[cm["aoi"]],
                            "aoiID": line[cm["aoiID"]],
                            "country": line[cm["country"]],
                            "indicator": line[cm["indicator"]],
                            "siteName": line[cm["siteName"]],
                            "city": line[cm["city"]],
                            "region": line[cm["region"]],
                            "description": line[cm["description"]],
                            "indicatorName": line[cm["indicatorName"]],
                            "yAxis": line[cm["yAxis"]],
                            "subAoi": line[cm["subAoi"]],
                            "updateFrequency": line[cm["updateFrequency"]],
                            # Actual data
                            "poi_data": poi_data_always,
                        }
        except Exception as e:
            print("WARNING: Issue reading file %s; file will be skipped for generation" % (file_path))
            print("Exception: %s" % e)

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
        poi_dict[poi_key]["lastColorCode"] = ([""] + [i["color_code"] for i in curr_data if i["color_code"] not in ["", 'NaN', '/']])[-1]
        poi_dict[poi_key]["lastIndicatorValue"] = ([""] + [i["indicator_value"] for i in curr_data if i["indicator_value"] not in ["", 'NaN', '/']])[-1]
        poi_dict[poi_key]["lastReferenceTime"] = ([""] + [i["reference_time"] for i in curr_data if i["reference_time"] not in ["", 'NaN', '/']])[-1]
        poi_dict[poi_key]["lastReferenceValue"] = ([""] + [i["reference_value"] for i in curr_data if i["reference_value"] not in ["", 'NaN', '/']])[-1]

    def date_converter(obj):
        if isinstance(obj, datetime.datetime):
            return obj.strftime('%Y-%m-%dT%H:%M:%S')

    output_dict = {key: {subkey: poi_dict[key][subkey] for subkey in outKeys} for key in poi_dict}
    ordered_dict = collections.OrderedDict(sorted(output_dict.items()))
    with open(output_file, "w") as fp:
        json.dump(list(ordered_dict.values()), fp, indent=4, default=date_converter, sort_keys=True)

    # Generate all unique location json files
    for poi_key in poi_dict:
        with open("%s%s.json" % (output_folder, poi_key), "w") as gp:
            json.dump(poi_dict[poi_key]["poi_data"], gp, indent=4, default=date_converter, sort_keys=True)


print("Generating data for trilateral")
# Generate for trilateral
generateData(
    default_map,
    default_array_map,
    "/working/data/trilateral/",
    "/working/data/internal/pois_trilateral.json",
    "/working/data/internal/",
    [
        '/working/data/trilateral/E8.csv',
        '/working/data/trilateral/E9.csv',
        '/working/data/trilateral/E10a1.csv',
        '/working/eodash-data/data/E10a2.csv',
        '/working/eodash-data/data/E10a3.csv',
        '/working/eodash-data/data/E10a6.csv',
        '/working/eodash-data/data/E10a8.csv',
        '/working/data/trilateral/E10c.csv',
        '/working/data/trilateral/E13b.csv',
        '/working/data/trilateral/N2.csv',
        '/working/data/trilateral/N3b.csv',
    ],
    [
        ['E1', 'or=(aoi_id.eq.BE3,aoi_id.eq.FR3)'],
        ['E1a', 'or=(aoi_id.eq.BE3,aoi_id.eq.FR3)'],
        ['N3_tri', ''],
        ['N1_tri', ''],
    ]
)

print("Generating data for eodashboard")
# Generate for eodash
generateData(
    default_map,
    default_array_map,
    "/working/eodash-data/data/",
    "/working/data/internal/pois_eodash.json",
    "/working/eodash-data/internal/",
    [
        '/working/eodash-data/data/E4.csv',
        '/working/eodash-data/data/E8.csv',
        '/working/eodash-data/data/E10a1.csv',
        '/working/eodash-data/data/E10a2.csv',
        '/working/eodash-data/data/E10a3.csv',
        '/working/eodash-data/data/E10a5.csv',
        '/working/eodash-data/data/E10a6.csv',
        '/working/eodash-data/data/E10a8.csv',
        '/working/eodash-data/data/E11.csv',
        '/working/eodash-data/data/E12b.csv',
        '/working/eodash-data/data/E13b2.csv',  # archived
        '/working/eodash-data/data/E13d_detections.csv',
        '/working/eodash-data/data/N1a_PM25_CAMS.csv',
        '/working/eodash-data/data/N1b_NO2_CAMS.csv',
        '/working/eodash-data/data/N1c_PM10_CAMS.csv',
        '/working/eodash-data/data/N1d_O3_CAMS.csv',
        '/working/eodash-data/data/N4a.csv',
        '/working/eodash-data/data/N4c.csv',
        '/working/eodash-data/data/E13e_cargo.csv',
        '/working/eodash-data/data/E13f_fishing.csv',
        '/working/eodash-data/data/E13g_tanker.csv',
        '/working/eodash-data/data/E13h_gioiatauro_tug.csv',
        '/working/eodash-data/data/E13i_gioiatauro_SearchRescue.csv',
        '/working/eodash-data/data/E13l_genova_pleasure.csv',
        '/working/eodash-data/data/E13m_genova_passenger.csv',
    ],
    [
        ['E1', ''],
        ['E1a', ''],
        ['E2', ''],
        ['E5', ''],
        ['E1_S2', ''],
        ['E1a_S2', ''],
        ['E2_S2', ''],
        ['E13b', ''],
        ['N3', ''],
        ['N1', ''],
        ['E13d', ''],
    ]
)
