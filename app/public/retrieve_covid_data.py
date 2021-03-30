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


output_folder = "/working/eodash-data/internal/"
indicator_code = "CV"

# read countries file
with open("/assets/countries.json", "r") as countries_file:
    countries_data = countries_file.read()

countries_obj = json.loads(countries_data)

DATAFILE = "/working/covid19_confirmed_global_{}.csv".format(
    datetime.datetime.utcnow().strftime("%Y-%m-%d")
)
US_DATAFILE = "/working/covid19_confirmed_US_{}.csv".format(
    datetime.datetime.utcnow().strftime("%Y-%m-%d")
)
url = "https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_confirmed_global.csv"
us_url = "https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_confirmed_US.csv"
vacc_url = "https://raw.githubusercontent.com/owid/covid-19-data/master/public/data/vaccinations/vaccinations.csv"

covid_data = {}

# Handle global data
if not os.path.isfile(DATAFILE):
    print("Downloading the latest covid confirmed cases data")
    myfile = requests.get(url, allow_redirects=True)
    open(DATAFILE, "wb").write(myfile.content)

with open(DATAFILE) as csvfile:
    reader = csv.DictReader(csvfile, delimiter=",", quotechar='"')
    for row in reader:
        country_name = row["Country/Region"]
        province = row["Province/State"]
        # Find corresponding alpha2 code
        matches = [x for x in countries_obj["features"] if x["properties"]["name"] == country_name]

        if len(matches) == 1:
            location_key = matches[0]["properties"]["alpha2"]
            dates = reader.fieldnames[4:]

            if location_key not in covid_data:
                covid_data[location_key] = {
                    "CountryName": row["Country/Region"],
                    "CountryCode": location_key,
                    "Values": [],
                }
                for date in dates:
                    current_date = datetime.datetime.strptime(date, "%m/%d/%y")
                    values_object = {
                        "date": current_date,
                        "confirmed": int(row[date])
                    }
                    covid_data[location_key]["Values"].append(values_object)
            else:
                # Countries repeat with different regions, we aggregate
                # the values here
                for i, date in enumerate(dates):
                    covid_data[location_key]["Values"][i]["confirmed"] = (
                        covid_data[location_key]["Values"][i]["confirmed"]
                        + int(row[date])
                    )

#Handle US data
if not os.path.isfile(US_DATAFILE):
    print("Downloading the latest US covid confirmed cases data")
    myfile = requests.get(us_url, allow_redirects=True)
    open(US_DATAFILE, "wb").write(myfile.content)

with open(US_DATAFILE) as csvfile:
    reader = csv.DictReader(csvfile, delimiter=",", quotechar='"')
    for row in reader:
        country_name = "United States of America"
        province = row["Province_State"]
        location_key = row["iso2"]
        dates = reader.fieldnames[11:]

        if location_key not in covid_data:
            covid_data[location_key] = {
                "CountryName": country_name,
                "CountryCode": location_key,
                "Values": [],
            }
            for date in dates:
                current_date = datetime.datetime.strptime(date, "%m/%d/%y")
                values_object = {
                    "date": current_date,
                    "confirmed": int(row[date])
                }
                covid_data[location_key]["Values"].append(values_object)
        else:
            # Countries repeat with different regions, we aggregate
            # the values here
            for i, date in enumerate(dates):
                covid_data[location_key]["Values"][i]["confirmed"] = (
                    covid_data[location_key]["Values"][i]["confirmed"]
                    + int(row[date])
                )

VACC_DATAFILE = "/working/vaccinations_global_{}.csv".format(
    datetime.datetime.utcnow().strftime("%Y-%m-%d")
)
indicator_code_vacc = "OW"
vacc_data = {}
#Handle vaccination data
if not os.path.isfile(VACC_DATAFILE):
    print("Downloading the latest global vaccination data")
    myfile = requests.get(vacc_url, allow_redirects=True)
    open(VACC_DATAFILE, "wb").write(myfile.content)

with open(VACC_DATAFILE) as csvfile:
    reader = csv.DictReader(csvfile, delimiter=",", quotechar='"')
    retrVals = [
        "total_vaccinations","people_vaccinated",
        "people_fully_vaccinated","daily_vaccinations_raw","daily_vaccinations",
        "total_vaccinations_per_hundred","people_vaccinated_per_hundred",
        "people_fully_vaccinated_per_hundred","daily_vaccinations_per_million"
    ]
    for row in reader:
        country_name = row["location"]
        if country_name == "United States":
            country_name = "United States of America"
        date = row["date"]
        current_date = datetime.datetime.strptime(date, "%Y-%m-%d")
        matches = [x for x in countries_obj["features"] if x["properties"]["name"] == country_name]
        if len(matches) == 1 and "alpha2" in matches[0]["properties"]:
            location_key = matches[0]["properties"]["alpha2"]

            if location_key not in vacc_data:
                vacc_data[location_key] = {
                    "CountryName": country_name,
                    "CountryCode": location_key,
                    "Values": [],
                }

            values_object = {
                "date": current_date
            }
            for key in retrVals:
                if row[key] != '':
                    current_value = float(row[key])
                    values_object[key] = current_value
                else:
                    values_object[key] = None

            vacc_data[location_key]["Values"].append(values_object)



def date_converter(obj):
    if isinstance(obj, datetime.datetime):
        return obj.strftime("%Y-%m-%dT%H:%M:%S")

# Generate all unique location json files for covid data
for country_code in covid_data:
    with open("%s%s-%s.json" % (output_folder, country_code, indicator_code), "w") as gp:
        json.dump(covid_data[country_code], gp, indent=4, default=date_converter, sort_keys=True)

# Generate all unique location json files for vaccination data
for country_code in vacc_data:
    with open("%s%s-%s.json" % (output_folder, country_code, indicator_code_vacc), "w") as gp:
        json.dump(vacc_data[country_code], gp, indent=4, default=date_converter, sort_keys=True)
