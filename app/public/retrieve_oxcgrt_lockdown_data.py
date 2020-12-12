#!/usr/bin/python
"""
Helper script to create location and data separation

Usage:
docker run --rm -it -v $PWD/../src/assets:/assets -v $PWD:/working eurodatacube/jupyter-user:0.19.6 /opt/conda/envs/eurodatacube-0.19.6/bin/python3 /working/retrieve_oxcgrt_lockdown_data.py

If issues with write permission you might have to add a user as parameter
with the same user id as your local account, e.g. "--user 1001"
"""


import os
import csv
import requests
import datetime
import json
import os.path

# 0 - No measures
# 1 - recommend movement restriction 2 - restrict movement
# 0 - Targeted 1- General


output_file = '/assets/lockdown_data.json'

DATAFILE = '/working/OxCGRT_Download_{}_Full.csv'.format(
    datetime.datetime.utcnow().strftime("%Y-%m-%d")
)
url = 'https://raw.githubusercontent.com/OxCGRT/covid-policy-tracker/master/data/OxCGRT_latest.csv'

if not os.path.isfile(DATAFILE):
    print("Downloading the latest OxCGRT lockdown data")
    myfile = requests.get(url, allow_redirects=True)
    open(DATAFILE, 'wb').write(myfile.content)

with open(DATAFILE) as csvfile:
    reader = csv.DictReader(csvfile, delimiter=",", quotechar='"')

    lockdown_data = {}
    prev_data = {}
    current_location = None
    prev_date = None
    prev_flag = None
    prev_location = None

    for row in reader:

        if row["RegionCode"] != '':
            location_key = "%s_%s"%(row["CountryCode"], row["RegionCode"])
        else:
            location_key = row["CountryCode"]

        if not location_key in lockdown_data:
            lockdown_data[location_key] = {
                "CountryName": row["CountryName"],
                "RegionName": row["RegionName"],
                "C7_Restrictions on internal movement": [],
            }
            prev_data[location_key] = {}

        for key in ["C7_Restrictions on internal movement"]:

            if not key in prev_data[location_key]:
                prev_data[location_key][key] = {
                    "prev_val": None,
                    "prev_time": None,
                }

            if len(row[key]) > 0: # Emtpy values
                flag_value = int(float(row[key])) # sometimes written as float in csv
                currDate = datetime.datetime.strptime(row['Date'], "%Y%m%d")
                p_data = prev_data[location_key][key]

                if current_location not in [None, location_key]:
                    # We are closing an interval here as the location changed
                    # but not necessarily the data value
                    p_data = prev_data[prev_location][key]
                    lockdown_data[prev_location][key].append({
                        "start": p_data["prev_time"],
                        "end": prev_date,
                        "value": p_data["prev_val"],
                        "flag": prev_flag,
                    })
                elif p_data["prev_val"] != flag_value:

                    if p_data["prev_time"] is not None:
                        # We are closing an interval here
                        lockdown_data[location_key][key].append({
                            "start": p_data["prev_time"],
                            "end": prev_date,
                            "value": p_data["prev_val"],
                            "flag": prev_flag,
                        })
                        p_data["prev_time"] = currDate
                        p_data["prev_val"] = flag_value
                    else:
                        p_data["prev_time"] = currDate
                        p_data["prev_val"] = flag_value


                current_location = location_key
                prev_date = currDate
                prev_flag = row["C7_Flag"]
                prev_location = location_key

    # When we reach the end of the rows we also make sure to "close" the last interval here
    for key in ["C7_Restrictions on internal movement"]:
        p_data = prev_data[prev_location][key]
        lockdown_data[prev_location][key].append({
            "start": p_data["prev_time"],
            "end": prev_date,
            "value": p_data["prev_val"],
            "flag": prev_flag,
        })


    def date_converter(obj):
        if isinstance(obj, datetime.datetime):
            return obj.strftime('%Y-%m-%dT%H:%M:%S')

    with open(output_file, "w") as fp:
        json.dump(lockdown_data, fp, indent=4, default=date_converter, sort_keys=True)