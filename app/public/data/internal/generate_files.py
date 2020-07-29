#!/usr/bin/python
"""
Helper script to create location and data separation
"""
import json
import csv
import os
import datetime

poi_input_file = "pois.json"
poi_output_file = "pois_trilateral.json"

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

trilat_map = {
    "aoi": "AOI",
    "aoiID": "AOI_ID",
    "lastColorCode": "Color code",
    "country": "Country",
    # "geometry": "geometry",
    "indicator": "Indicator code",
    "siteName": "Site Name",
    #"subAoi": "sub_aoi",
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
}

array_data_tri = {
    "eo_sensor": "EO Sensor",
    "input_data": "Input Data",
    "time": "Time",
    "measurement_value": "Measurement Value",
    "reference_time": "Reference time",
    "reference_value": "Reference value",
    "indicator_value": "Indicator Value",
    "color_code": "Color code",
    "data_provider": "Data Provider"
}

def generateData(mapping, array_mapping, output_folder, input_json=None):
    cm = mapping
    cm_arr = array_mapping
    poi_dict = {}
    
    # Load main poi overview file
    if input_json != None:
        with open(input_json) as json_file:
            # array with combined unique keys "aoi_id-indicator_code"
            # create dict using unique key
            poi_data = json.load(json_file)
            for poi in poi_data:
                pkey = "%s-%s"%(poi["aoi_id"], poi["indicator_code"])
                if pkey in poi_dict:
                    # Overwrite data?
                    print("Duplicate key found, overwriting data")
                    poi_dict[pkey] = poi
                else:
                    poi_dict[pkey] = poi

    # Load all csv from a path
    for file in os.listdir("../trilateral/"):
        if (file.endswith(".csv") and
                file != "Regional_Global_Indicator_Countries.csv" and
                file != "dummylocations.csv"):
            file_path = (os.path.join("../trilateral/", file))
            try:
                with open(file_path) as csvfile:
                    reader = csv.DictReader(csvfile, delimiter=",", quotechar='"')
                    for line in reader:
                        # Aggregate data for unique pois and write unique data to poi_dict
                        poi_key = "%s-%s"%(line[cm["aoiID"]], line[cm["indicator"]])
                        if poi_key in poi_dict:
                            # If key already saved we add the relevant data
                            poi_dict[poi_key]["poi_data"].append({
                                "eo_sensor": line[cm_arr["eo_sensor"]],
                                "input_data": line[cm_arr["input_data"]],
                                "time": datetime.datetime.strptime(line[cm_arr["time"]], '%Y-%m-%dT%H:%M:%S'),
                                "measurement_value": line[cm_arr["measurement_value"]],
                                "reference_time": line[cm_arr["reference_time"]],
                                "reference_value": line[cm_arr["reference_value"]],
                                "indicator_value": line[cm_arr["indicator_value"]],
                                "color_code": line[cm_arr["color_code"]],
                                "data_provider": line[cm_arr["data_provider"]],
                            })
                        else:
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

                                # Actual data
                                "poi_data": [{
                                    "eo_sensor": line[cm_arr["eo_sensor"]],
                                    "input_data": line[cm_arr["input_data"]],
                                    "time": datetime.datetime.strptime(line[cm_arr["time"]], '%Y-%m-%dT%H:%M:%S'),
                                    "measurement_value": line[cm_arr["measurement_value"]],
                                    "color_code": line[cm_arr["color_code"]],
                                    "indicator_value": line[cm_arr["indicator_value"]],
                                    "reference_time": line[cm_arr["reference_time"]],
                                    "reference_value": line[cm_arr["reference_value"]],
                                    "data_provider": line[cm_arr["data_provider"]],
                                }],
                            }
            except Exception as e:
                print("WARNING: Issue reading file %s; file will be skipped for generation"%(file_path))
                print("Exception: %s"%e)

    outKeys = [
        "aoi", "aoiID", "country", "indicator", "siteName", "city", "region",
        "description", "indicatorName",
        "lastTime",
        "lastMeasurement",
        "lastColorCode",
        "lastIndicatorValue",
        "lastReferenceTime",
        "lastReferenceValue",
    ]

    # Sort poi_data by time
    for poi_key in poi_dict:
        poi_dict[poi_key]["poi_data"] = sorted(
            poi_dict[poi_key]["poi_data"], key=lambda k: k["time"]
        )
        curr_data = poi_dict[poi_key]["poi_data"]
        # Save latest values for unique poi list
        poi_dict[poi_key]["lastTime"] = curr_data[-1]["time"]
        poi_dict[poi_key]["lastMeasurement"] = curr_data[-1]["measurement_value"]
        poi_dict[poi_key]["lastColorCode"] = curr_data[-1]["color_code"]
        poi_dict[poi_key]["lastIndicatorValue"] = curr_data[-1]["indicator_value"]
        poi_dict[poi_key]["lastReferenceTime"] = curr_data[-1]["reference_time"]
        poi_dict[poi_key]["lastReferenceValue"] = curr_data[-1]["reference_value"]
        # "updateFrequency": line[cm["updateFrequency"]],

    def date_converter(obj):
        if isinstance(obj, datetime.datetime):
            return obj.strftime('%Y-%m-%dT%H:%M:%S')

    output_dict = {key: {subkey: poi_dict[key][subkey] for subkey in outKeys} for key in poi_dict}
    with open(poi_output_file, "w") as fp:
        json.dump(output_dict.values(), fp, indent=4, default=date_converter)

    # Generate all unique location json files
    for poi_key in poi_dict:
        with open("%s%s.json"%(output_folder, poi_key), "w") as fp:
            json.dump(poi_dict[poi_key]["poi_data"], fp, indent=4, default=date_converter)



generateData(trilat_map, array_data_tri, './')