#!/usr/bin/python
"""
Helper script to create location and data separation
"""
import json
import csv
import os

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

cm = trilat_map
cm_arr = array_data_tri

# Load main poi overview file
with open(poi_input_file) as json_file:
    # array with combined unique keys "aoi_id-indicator_code"
    poi_data = json.load(json_file)
    # create dict using unique key
    poi_dict = {}
    # for poi in poi_data:
    #     pkey = "%s-%s"%(poi["aoi_id"], poi["indicator_code"])
    #     if pkey in poi_dict:
    #         # Overwrite data?
    #         print("Duplicate key found, overwriting data")
    #         poi_dict[pkey] = poi
    #     else:
    #         poi_dict[pkey] = poi

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
                                "time": line[cm_arr["time"]],
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
                                    "time": line[cm_arr["time"]],
                                    "measurement_value": line[cm_arr["measurement_value"]],
                                    "color_code": line[cm_arr["color_code"]],
                                    "indicator_value": line[cm_arr["indicator_value"]],
                                    "reference_time": line[cm_arr["reference_time"]],
                                    "reference_value": line[cm_arr["reference_value"]],
                                    "data_provider": line[cm_arr["data_provider"]],
                                }],
                                # TODO: just saving first value we encounter here
                                # need to sort by time and use latest value
                                "lastTime": line[cm_arr["time"]],
                                "lastMeasurement": line[cm_arr["measurement_value"]],
                                "lastColorCode": line[cm_arr["color_code"]],
                                "lastIndicatorValue": line[cm_arr["indicator_value"]],
                                "lastReferenceTime": line[cm_arr["reference_time"]],
                                "lastReferenceValue": line[cm_arr["reference_value"]],
                                # "updateFrequency": line[cm["updateFrequency"]],
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

    output_dict = {key: {subkey: poi_dict[key][subkey] for subkey in outKeys} for key in poi_dict}
    with open(poi_output_file, "w") as fp:
        json.dump(output_dict.values(), fp, indent=4)

    # Generate all unique location json files
    outFolder = "./"
    for poi_key in poi_dict:
        with open("%s%s.json"%(outFolder, poi_key), "w") as fp:
            json.dump(poi_dict[poi_key]["poi_data"], fp, indent=4)
