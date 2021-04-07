#!/usr/bin/python
"""
Helper script to create location and data separation

Usage:
docker run --rm -it -v $PWD/../src/assets:/assets -v $PWD:/working eurodatacube/jupyter-user:0.19.6 /opt/conda/envs/eurodatacube-0.19.6/bin/python3 /working/convert_gsa_data.py

If issues with write permission you might have to add a user as parameter
with the same user id as your local account, e.g. "--user 1001"
"""


import os
import csv
import requests
import datetime
import json
import os.path
import shapefile
import pyproj


def interpolate_tuple( startcolor, goalcolor, percentage ):
    """
    Take two RGB color sets and mix them at a specific percentage
    """
    # white

    R = startcolor[0]
    G = startcolor[1]
    B = startcolor[2]

    targetR = goalcolor[0]
    targetG = goalcolor[1]
    targetB = goalcolor[2]

    DiffR = targetR - R
    DiffG = targetG - G
    DiffB = targetB - B

    buffer = []
    steps = 100
    iR = R + (DiffR * percentage / steps)
    iG = G + (DiffG * percentage / steps)
    iB = B + (DiffB * percentage / steps)
    print(iR)
    hR = ("%s"%hex(int(iR))).replace("0x", "")
    hG = ("%s"%hex(int(iG))).replace("0x", "")
    hB = ("%s"%hex(int(iB))).replace("0x", "")

    if len(hR) == 1:
        hR = "0" + hR
    if len(hB) == 1:
        hB = "0" + hB
    if len(hG) == 1:
        hG = "0" + hG

    color = "#"+hR+hG+hB

    return color



indicator_code = 'GSA'
overview_file = '/assets/gsa_data.json'
output_folder = '/working/eodash-data/internal/'

DATAFILE = '/working/eodash-data/data/GSA_mobility.csv'


transformer = pyproj.Transformer.from_crs("epsg:3857", "epsg:4326")
ctr = shapefile.Reader('/working/eodash-data/data/borders_GL2017_Roads_EU27_UK_coord_names/borders_GL2017_Roads_EU27_UK_coord_names')
geomet = ctr.shapeRecords()

with open(DATAFILE, encoding='utf-8') as csvfile:
    reader = csv.DictReader(csvfile, delimiter=",", quotechar='"')

    gsa_data_overview = {}
    gsa_data = {}

    for row in reader:

        entry_id = row["id"]
        from_country = row["from_country"]
        to_country = row["to_country"]
        crossing_id = "%s-%s"%(from_country, to_country)
        border_id = "%s-%s-%s"%(row["border"].replace(" ", ""), entry_id, indicator_code)

        # find record in shapefile to get position
        res_rec = next((item for item in geomet if item.record.OBJECTID == int(entry_id)), None)

        if res_rec != None:
            pos = transformer.transform(res_rec.record.Coord_X, res_rec.record.Coord_Y)

             # We ignore entries where data availabiltiy is 0
            if row["data_availability"] != "0" and row["waiting_time_min"] != "":
                if not border_id in gsa_data_overview:
                    gsa_data_overview[border_id] = {
                        "AOI": "%s,%s"%(pos[0], pos[1]),
                        "border": row["border"],
                        "name": row["name"],
                        "borderId": border_id,
                    }
                    gsa_data[border_id] = {
                    }

                if not crossing_id in gsa_data[border_id]:
                    gsa_data[border_id][crossing_id] = {
                        "from_country": from_country,
                        "to_country": to_country,
                        "name": row["name"],
                        "values": []
                    }

                # TODO: Lets calculate the color to be shown (maybe we dont need this
                # as we are showing a timeline?)
                # color = interpolate_tuple((255, 0, 0), (255, 255, 0), 50)
                
                # Adding 00 minutes to timezone offset
                current_date = datetime.datetime.strptime("%s:00"%(row['timestamp']), "%Y-%m-%d %H:%M:%S%z")
                gsa_data[border_id][crossing_id]["values"].append({
                    "timestamp": current_date,
                    "waiting_time": row["waiting_time_min"],
                    # "color": color
                    # "green": row["green status ratio (%)"],
                    # "yellow": row["yellow status ratio (%)"],
                    # "red": row["red status ratio (%)"],
                    # "data_availability": row["Data availability (%)"]
                })
        else:
            # this should in theory not happen
            print("Shapefile object not found for id %s" %entry_id)

    #print(gsa_data)


    def date_converter(obj):
        if isinstance(obj, datetime.datetime):
            return obj.strftime('%Y-%m-%dT%H:%M:%S')

    with open(overview_file, "w", encoding='utf-8') as fp:
        json.dump(
            gsa_data_overview, fp, indent=4, default=date_converter,
            sort_keys=True, ensure_ascii=False)

    for border_code in gsa_data:
        with open("%s%s.json" % (output_folder, border_code), "w", encoding='utf-8') as gp:
            json.dump(
                gsa_data[border_code], gp, indent=4, default=date_converter,
                sort_keys=True, ensure_ascii=False)
