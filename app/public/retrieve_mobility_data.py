#!/usr/bin/python
"""
Helper script to create location and data separation from mobility data

Usage:
docker run --rm -it -v $PWD:/working eurodatacube/jupyter-user:0.19.6 /opt/conda/envs/eurodatacube-0.19.6/bin/python3 /working/retrieve_mobility_data.py

If issues with write permission you might have to add a user as parameter
with the same user id as your local account, e.g. "--user 1001"
"""


import os
import os.path
import csv
import datetime
import json
import requests


output_folder = '/working/eodash-data/internal/'
indicator_code = 'GG'

DATAFILE = '/working/Global_Mobility_Report_Download_{}.csv'.format(
    datetime.datetime.utcnow().strftime("%Y-%m-%d")
)
url = 'https://www.gstatic.com/covid19/mobility/Global_Mobility_Report.csv'

if not os.path.isfile(DATAFILE):
    print("Downloading the latest google mobility data")
    myfile = requests.get(url, allow_redirects=True)
    open(DATAFILE, 'wb').write(myfile.content)

with open(DATAFILE) as csvfile:
    reader = csv.DictReader(csvfile, delimiter=",", quotechar='"')

    mobility_data = {}

    retrVals = [
        ["retail_and_recreation_percent_change_from_baseline", "retail_recreation"],
        ["grocery_and_pharmacy_percent_change_from_baseline", "grocery"],
        ["parks_percent_change_from_baseline", "parks"],
        ["transit_stations_percent_change_from_baseline", "transit_stations"],
        ["workplaces_percent_change_from_baseline", "workplaces"],
        ["residential_percent_change_from_baseline", "residential"],
    ]

    for row in reader:

        # For now we skip subregional data
        if row["sub_region_1"] == '' and row["sub_region_2"] == '' and row["metro_area"] == '' :
            location_key = row["country_region_code"]

            if not location_key in mobility_data:
                mobility_data[location_key] = {
                    "CountryName": row["country_region"],
                    "CountryCode": location_key,
                    "Values": [],
                }

            current_date = datetime.datetime.strptime(row['date'], "%Y-%m-%d")
            values_object = {
                "date": current_date
            }
            for desc, key in retrVals:
                if row[desc] != '':
                    current_value = int(row[desc])
                    values_object[key] = current_value
                else:
                    values_object[key] = None

            mobility_data[location_key]["Values"].append(values_object)

        else:
            # TODO: Handle subcountry/regional data
            pass

    def date_converter(obj):
        if isinstance(obj, datetime.datetime):
            return obj.strftime('%Y-%m-%dT%H:%M:%S')

    # Generate all unique location json files
    for country_code in mobility_data:
        with open("%s%s-%s.json" % (output_folder, country_code, indicator_code), "w") as gp:
            json.dump(mobility_data[country_code], gp, indent=4, default=date_converter, sort_keys=True)

