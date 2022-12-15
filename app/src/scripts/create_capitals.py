#!/usr/bin/python
"""
Helper script to create location and data separation from mobility data

Usage:
docker run --rm -it -v $PWD:/working -v $PWD/../assets:/assets -v $PWD/../../public:/public eurodatacube/jupyter-user:0.19.6 /opt/conda/envs/eurodatacube-0.19.6/bin/python3 /working/create_capitals.py

If issues with write permission you might have to add a user as parameter
with the same user id as your local account, e.g. "--user 1001"
"""


import re
import os
import os.path
import datetime
import collections
import json
import geojson
from shapely.geometry import shape

output_folder = "/public/eodash-data/internal/"
indicators = [
    ("GG", "Mobility Data"),
    ("CV", "Covid-19 cases"),
    ("OW", "Covid-19 vaccinations")
]

EU_COUNTRIES = [
    "AT","BE","BG","HR","CY","CZ","DK","EE","FI","FR","DE","GR","HU","IE",
    "IT","LV","LT","LU","MT","NL","PL","PT","RO","SK","SI","ES","SE","GB",
]

DATAFILE = "/assets/capitals.geojson"
COUNTRIESFILE = "/assets/countries.json"

with open(DATAFILE) as f, open(COUNTRIESFILE) as cf:
    content = json.load(f)
    c_content = json.load(cf)
    country_isos = c_content["features"]
    features = (content["features"])
    for indicator_code, description in indicators:
        poi_dict = {}
        for f in features:
            curr_poi_data = []
            poi_key = "%s" % (f["properties"]["iso2"])
            coords = f["geometry"]["coordinates"]
            iso_found = next(
                (x for x in country_isos if "alpha2" in x["properties"] and x["properties"]["alpha2"] == f["properties"]["iso2"]),
                None
            )
            data_available = os.path.exists("/public/eodash-data/internal/%s-%s.json" % (poi_key, indicator_code))
            if "city" in f["properties"] and data_available and iso_found:
                sub_aoi = "%s"%(shape(geojson.loads(json.dumps(iso_found["geometry"])))).wkt
                sub_aoi = re.sub(r'([0-9]+\.[0-9]{5})([0-9]+)', r'\1', sub_aoi)
                poi_dict[poi_key] = {
                    # Unique poi data
                    "aoi": "%s,%s"%(coords[1], coords[0]),
                    "aoiID": "%s"%poi_key,
                    "country": f["properties"]["iso2"],
                    "indicator": indicator_code,
                    "siteName": "",
                    "city": f["properties"]["country"],
                    "region": "",
                    "description": description,
                    "indicatorName": "",
                    "yAxis": "[%]",
                    "subAoi": sub_aoi,
                    "updateFrequency": "weekly",
                }

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
            # Save latest valid values for unique poi list
            poi_dict[poi_key]["lastTime"] = ""
            poi_dict[poi_key]["lastMeasurement"] = ""
            poi_dict[poi_key]["lastColorCode"] = ""
            poi_dict[poi_key]["lastIndicatorValue"] = "/"
            poi_dict[poi_key]["lastReferenceTime"] = ""
            poi_dict[poi_key]["lastReferenceValue"] = ""

        # Append locations to pois files
        pois_files = [
            "/public/data/internal/pois_trilateral.json",
            "/public/data/internal/pois_eodash.json",
        ]


        def date_converter(obj):
            if isinstance(obj, datetime.datetime):
                return obj.strftime('%Y-%m-%dT%H:%M:%S')

        for output_file in pois_files:
            # We might need this separation in the future
            if output_file.endswith("pois_eodash.json"):
                output_dict = {key: {subkey: poi_dict[key][subkey] for subkey in outKeys} for key in poi_dict if poi_dict[key]["country"] in EU_COUNTRIES}
            else:
                output_dict = {key: {subkey: poi_dict[key][subkey] for subkey in outKeys} for key in poi_dict}
            with open(output_file) as f:
                json_data = json.load(f)
                # retrieve previous data without current indicator
                json_data = [entry for entry in json_data if entry["indicator"] != indicator_code]
                ordered_dict = collections.OrderedDict(sorted(output_dict.items()))
                json_data.extend(ordered_dict.values())
            with open(output_file, "w") as fp:
                json.dump(json_data, fp, indent=4, default=date_converter, sort_keys=True)
