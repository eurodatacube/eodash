#!/usr/bin/python
"""
Helper script to create location and data separation from mobility data

Usage:
docker run --rm -it -v $PWD/../src/assets:/assets $PWD:/working eurodatacube/jupyter-user:0.19.6 /opt/conda/envs/eurodatacube-0.19.6/bin/python3 /working/retrieve_mobility_data.py

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
indicator_code = 'CV'

# read countries file
with open('/assets/countries.json', 'r') as countries_file:
    countries_data = countries_file.read()

countries_obj = json.loads(countries_data)

DATAFILE = '/working/covid19_confirmed_global_{}.csv'.format(
    datetime.datetime.utcnow().strftime("%Y-%m-%d")
)
url = 'https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_confirmed_global.csv'

if not os.path.isfile(DATAFILE):
    print("Downloading the latest covid confirmed cases data")
    myfile = requests.get(url, allow_redirects=True)
    open(DATAFILE, 'wb').write(myfile.content)

with open(DATAFILE) as csvfile:
    reader = csv.DictReader(csvfile, delimiter=",", quotechar='"')

    covid_data = {}

    for row in reader:

        country_name = row["Country/Region"]
        # Find corresponding alpha2 code
        matches = [x for x in countries_obj["features"] if x["properties"]["name"] == country_name]

        if len(matches) == 1:
            location_key = matches[0]["properties"]["alpha2"]
            dates = reader.fieldnames[4:]

            for date in dates:
                if not location_key in covid_data:
                    covid_data[location_key] = {
                        "CountryName": row["Country/Region"],
                        "CountryCode": location_key,
                        "Values": [],
                    }

                current_date = datetime.datetime.strptime(date, "%m/%d/%y")
                values_object = {
                    "date": current_date,
                    "confirmed": row[date]
                }
                covid_data[location_key]["Values"].append(values_object)


    def date_converter(obj):
        if isinstance(obj, datetime.datetime):
            return obj.strftime('%Y-%m-%dT%H:%M:%S')

    # Generate all unique location json files
    for country_code in covid_data:
        with open("%s%s-%s.json" % (output_folder, country_code, indicator_code), "w") as gp:
            json.dump(covid_data[country_code], gp, indent=4, default=date_converter, sort_keys=True)
