#!/usr/bin/python
"""
Helper script to create REP4 files

Usage:
docker run --rm -it -v $PWD/../config:/config -v $PWD:/working -v $PWD/../../public:/public eurodatacube/jupyter-user:0.19.6 /opt/conda/envs/eurodatacube-0.19.6/bin/python3 /working/retrieve_gtif_rep4.py

If issues with write permission you might have to add a user as parameter
with the same user id as your local account, e.g. "--user 1001"
"""

import os, shutil
import json
import csv
from datetime import datetime, timedelta
from dateutil import parser
from decimal import Decimal
from typing import Iterator
from duration import Duration
import collections
import requests
from datetime import timedelta
from decimal import Decimal
import re
from functools import reduce
from shapely import wkb

from six import string_types
import xml.etree.ElementTree as ET
import pandas as pd
import pyproj
from shapely.ops import transform

wgs84 = pyproj.CRS('EPSG:4326')
webmerc = pyproj.CRS('EPSG:3857')

project = pyproj.Transformer.from_proj(
    pyproj.Proj(init='epsg:3857'), # source coordinate system
    pyproj.Proj(init='epsg:4326')) # destination coordinate system

def date_converter(obj):
    if isinstance(obj, datetime):
        return obj.strftime('%Y-%m-%dT%H:%M:%S')

def try_parsing_date(text, line):
    for fmt in ('%Y-%m-%dT%H:%M:%S', '%Y-%m-%d'):
        try:
            return datetime.strptime(text.strip(), fmt)
        except ValueError:
            pass
    raise ValueError(f'time "{text}" not provided in valid format, full line "{line}"')


dams_data = requests.get('https://xcube-geodb.brockmann-consult.de/gtif/f0ad1e25-98fa-4b82-9228-815ab24f5dd1/GTIF_reservoirs_all').json()
dams = {}
for dam in dams_data:
    id = dam['object_id'].strip()
    geom_orig = wkb.loads(dam['geometry'],hex=True)
    geom_wgs84 = transform(project.transform, geom_orig)  # apply projection 
    aoi = f"{geom_wgs84.centroid.coords[0][1]},{geom_wgs84.centroid.coords[0][0]}"
    aoi = re.sub(r'([0-9]+\.[0-9]{6})([0-9]+)', r'\1', aoi)
    dams[id] = {}
    dams[id]["aoi"] = aoi
    dams[id]["subAoi"] = re.sub(r'([0-9]+\.[0-9]{6})([0-9]+)', r'\1', geom_wgs84.wkt)


hydro_swe_daily_means_data:dict = requests.get('https://xcube-geodb.brockmann-consult.de/gtif/f0ad1e25-98fa-4b82-9228-815ab24f5dd1/GTIF_hydro_swe_daily_means').json()
poi_dict = {}
for item in hydro_swe_daily_means_data:
    poi_key:str = "%s-%s" % (item["object_id"], 'REP4_1')
    id:str = str(item["object_id"])
    time:datetime = try_parsing_date(item["date"], item)
    sensor:str = item["sensor"].strip()
    if sensor.find('s2-') != -1:
        input_data:str = 'S2L2A'
    elif sensor.find('s1-') != -1:
        input_data:str = 'S1GRD'
    else:
        input_data:str = sensor
    object_always_present = {
        "eo_sensor": sensor,
        "input_data": input_data,
        "time": time,
        "measurement_value": format(item["area_nrt"], '.5f'),
    }
    if poi_key in poi_dict:
        # If key already saved we add the relevant data
        if time not in [i["time"] for i in poi_dict[poi_key]["poi_data"]]:
            poi_dict[poi_key]["poi_data"].append(object_always_present)
    else:
        poi_dict[poi_key] = {
            # Unique poi data
            "aoi": dams[id]["aoi"],
            "aoiID": id,
            "country": None,
            "indicator": 'REP4_1',
            "siteName": None,
            "city": '',
            "description": 'Surface water extent - storage level',
            "yAxis": 'km²',
            "subAoi": dams[id]["subAoi"],
            # Actual data
            "poi_data": [object_always_present],
        }
outKeys = [
    "aoi", "aoiID", "country", "indicator", "siteName", "city",
    "description", "yAxis", "subAoi",
]
for poi_key in poi_dict:
    poi_dict[poi_key]["poi_data"] = sorted(
        poi_dict[poi_key]["poi_data"], key=lambda k: k["time"]
    )
#print(poi_dict)

output_file = "/public/data/gtif/pois_gtif.json"
output_folder = "/public/data/gtif/internal/"

output_dict = {key: {subkey: poi_dict[key][subkey] for subkey in outKeys} for key in poi_dict}
ordered_dict = collections.OrderedDict(sorted(output_dict.items()))
print(f"creating file {output_file}")
with open(output_file, "w") as fp:
    json.dump(list(ordered_dict.values()), fp, indent=4, default=date_converter, sort_keys=True)

# Generate all unique location json files
for poi_key in poi_dict:
    print(f"creating file for {poi_key}")
    with open("%s%s.json" % (output_folder, poi_key), "w") as gp:
        json.dump(poi_dict[poi_key]["poi_data"], gp, indent=4, default=date_converter, sort_keys=True)
