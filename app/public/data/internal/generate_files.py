#!/usr/bin/python
"""
Helper script to create location and data separation
"""
import json
import csv
import os
import datetime

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
    "indicatorName": "Indicator Name",
    "lastReferenceTime": "reference date time [yyyy-mm-ddthh:mm:ss]",
    "lastReferenceValue": "reference value [float]",
    "region": "region (optional)",
    "updateFrequency": "update frequency",
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


def try_parsing_date(text):
    for fmt in ('%Y-%m-%dT%H:%M:%S', '%Y-%m-%d'):
        try:
            return datetime.datetime.strptime(text, fmt)
        except ValueError:
            pass
    raise ValueError('time not provided in valid format')


def generateData(mapping, array_mapping, input_folder, output_file, output_folder, additional_files=[], input_json=None):
    cm = mapping
    cm_arr = array_mapping
    poi_dict = {}

    # Load main poi overview file
    if input_json is not None:
        with open(input_json) as json_file:
            # array with combined unique keys "aoi_id-indicator_code"
            # create dict using unique key
            poi_data = json.load(json_file)
            for poi in poi_data:
                pkey = "%s-%s" % (poi["aoi_id"], poi["indicator_code"])
                if pkey in poi_dict:
                    # Overwrite data?
                    print("Duplicate key found, overwriting data")
                    poi_dict[pkey] = poi
                else:
                    poi_dict[pkey] = poi
    file_paths = [os.path.join(input_folder, file) for file in os.listdir(input_folder)]
    file_paths.extend(additional_files)
    # Load all csv from a path
    for file_path in file_paths:
        if (file_path.endswith(".csv")
            and not file_path.endswith("Regional_Global_Indicator_Countries.csv")
                and not file_path.endswith("dummylocations.csv")):
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
                                "time": try_parsing_date(line[cm_arr["time"]]),
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
                                "time": try_parsing_date(line[cm_arr["time"]]),
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
        poi_dict[poi_key]["lastTime"] = ([""] + [i["time"] for i in curr_data if i["time"] != ""])[-1]
        poi_dict[poi_key]["lastMeasurement"] = ([""] + [i["measurement_value"] for i in curr_data if i["measurement_value"] != ""])[-1]
        poi_dict[poi_key]["lastColorCode"] = ([""] + [i["color_code"] for i in curr_data if i["color_code"] != ""])[-1]
        poi_dict[poi_key]["lastIndicatorValue"] = ([""] + [i["indicator_value"] for i in curr_data if i["indicator_value"] != ""])[-1]
        poi_dict[poi_key]["lastReferenceTime"] = ([""] + [i["reference_time"] for i in curr_data if i["reference_time"] != ""])[-1]
        poi_dict[poi_key]["lastReferenceValue"] = ([""] + [i["reference_value"] for i in curr_data if i["reference_value"] != ""])[-1]

    def date_converter(obj):
        if isinstance(obj, datetime.datetime):
            return obj.strftime('%Y-%m-%dT%H:%M:%S')

    output_dict = {key: {subkey: poi_dict[key][subkey] for subkey in outKeys} for key in poi_dict}
    with open(output_file, "w") as fp:
        json.dump(list(output_dict.values()), fp, indent=4, default=date_converter, sort_keys=True)

    # Generate all unique location json files
    for poi_key in poi_dict:
        with open("%s%s.json" % (output_folder, poi_key), "w") as gp:
            json.dump(poi_dict[poi_key]["poi_data"], gp, indent=4, default=date_converter, sort_keys=True)


print("Generating data for trilateral")
# Generate for trilateral
generateData(
    default_map,
    default_array_map,
    "../trilateral/",
    "pois_trilateral.json",
    "./",
    ["../../eodash-data/data/E10a2.csv",
        "../../eodash-data/data/E10a3.csv",
        "../../eodash-data/data/E10a6.csv",
        "../../eodash-data/data/E10a7.csv",
        "../../eodash-data/data/E10a8.csv"]
)

print("Generating data for eodashboard")
# Generate for eodash
generateData(
    default_map,
    default_array_map,
    "../../eodash-data/data/",
    "pois_eodash.json",
    "../../eodash-data/internal/"
)
