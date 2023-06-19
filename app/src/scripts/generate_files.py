#!/usr/bin/python
"""
Helper script to create location and data separation

Usage:
docker run --rm -it -v $PWD/../config:/config -v $PWD:/working -v $PWD/../../public:/public eurodatacube/jupyter-user:0.19.6 /opt/conda/envs/eurodatacube-0.19.6/bin/python3 /working/generate_files.py

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


from six import string_types
import xml.etree.ElementTree as ET
import pandas as pd

from dotenv.main import find_dotenv, DotEnv
from xcube_geodb.core.geodb import GeoDBClient

from owslib.wms import WebMapService


dot_env = DotEnv("/public/.env")
dot_env.set_as_environment_variables()
geodb = GeoDBClient()
envs = dot_env.dict()


ISO8601_PERIOD_REGEX = re.compile(
    r"^(?P<sign>[+-])?"
    r"P(?!\b)"
    r"(?P<years>[0-9]+([,.][0-9]+)?Y)?"
    r"(?P<months>[0-9]+([,.][0-9]+)?M)?"
    r"(?P<weeks>[0-9]+([,.][0-9]+)?W)?"
    r"(?P<days>[0-9]+([,.][0-9]+)?D)?"
    r"((?P<separator>T)(?P<hours>[0-9]+([,.][0-9]+)?H)?"
    r"(?P<minutes>[0-9]+([,.][0-9]+)?M)?"
    r"(?P<seconds>[0-9]+([,.][0-9]+)?S)?)?$")
# regular expression to parse ISO duartion strings.

def parse_duration(datestring):
    """
    Parses an ISO 8601 durations into datetime.timedelta
    """
    if not isinstance(datestring, string_types):
        raise TypeError("Expecting a string %r" % datestring)
    match = ISO8601_PERIOD_REGEX.match(datestring)
    if not match:
        # try alternative format:
        if datestring.startswith("P"):
            durdt = parse_datetime(datestring[1:])
            if durdt.year != 0 or durdt.month != 0:
                # create Duration
                ret = Duration(days=durdt.day, seconds=durdt.second,
                               microseconds=durdt.microsecond,
                               minutes=durdt.minute, hours=durdt.hour,
                               months=durdt.month, years=durdt.year)
            else:  # FIXME: currently not possible in alternative format
                # create timedelta
                ret = timedelta(days=durdt.day, seconds=durdt.second,
                                microseconds=durdt.microsecond,
                                minutes=durdt.minute, hours=durdt.hour)
            return ret
        raise ISO8601Error("Unable to parse duration string %r" % datestring)
    groups = match.groupdict()
    for key, val in groups.items():
        if key not in ('separator', 'sign'):
            if val is None:
                groups[key] = "0n"
            # print groups[key]
            if key in ('years', 'months'):
                groups[key] = Decimal(groups[key][:-1].replace(',', '.'))
            else:
                # these values are passed into a timedelta object,
                # which works with floats.
                groups[key] = float(groups[key][:-1].replace(',', '.'))
    if groups["years"] == 0 and groups["months"] == 0:
        ret = timedelta(days=groups["days"], hours=groups["hours"],
                        minutes=groups["minutes"], seconds=groups["seconds"],
                        weeks=groups["weeks"])
        if groups["sign"] == '-':
            ret = timedelta(0) - ret
    else:
        ret = Duration(years=groups["years"], months=groups["months"],
                       days=groups["days"], hours=groups["hours"],
                       minutes=groups["minutes"], seconds=groups["seconds"],
                       weeks=groups["weeks"])
        if groups["sign"] == '-':
            ret = Duration(0) - ret
    return ret

def try_parsing_date(text, line):
    for fmt in ('%Y-%m-%dT%H:%M:%S', '%Y-%m-%d'):
        try:
            return datetime.strptime(text.strip(), fmt)
        except ValueError:
            pass
    raise ValueError(f'time "{text}" not provided in valid format, full line "{line}"')


# Function to fetch all available dates for BYOD collections.
# Make sure all appropiate collection ids are set in your docker environment
COLLECTIONS = [
]

BYOD_COLLECTIONS = [
    "AWS_N3_CUSTOM",
    "AWS_N3_CUSTOM_TSMNN",
    "AWS_ICEYE-E3",
    "AWS_ICEYE-E11",
    "AWS_ICEYE-E11A",
    "AWS_ICEYE-E12B",
    "AWS_ICEYE-E13B",
    "AWS_JAXA_TSM",
    "AWS_JAXA_CHLA",
    "AWS_VIS_2MTEMPERATURE",
    "AWS_VIS_RELHUMIDITY1000HPA",
    "AWS_POPULATION_DENSITY",
    "AWS_VIS_WIND_U_10M",
    "AWS_VIS_WIND_V_10M",
    "AWS_VIS_SO2_DAILY_DATA",
    "AWS_VIS_CO_3DAILY_DATA",
    "AWS_NO2-VISUALISATION",
    "BICEP_NPP_VIS_PP",
    "ESA-CCI-V2-CRYOSAT",
    "ESA-CCI-V2-ENVISAT",
    "AWS_CH4_WEEKLY",
    "AWS_VIS_SST_MAPS",
    "LAKES_SURFACE_WATER_TEMPERATURE",
    "LAKE_WATER_QUALITY_TURBIDITY_MEAN",
]

ZARRCOLLECTIONS = [
    "BICEP_NPP_VIS_PP",
    "ESA-CCI-V2-CRYOSAT",
    "ESA-CCI-V2-ENVISAT",
    "LAKE_WATER_QUALITY_TURBIDITY_MEAN",
]

WMSCOLLECTIONS = {
    "ONPP-GCOMC-World-Monthly": "https://ogcpreview2.restecmap.com/examind/api/WS/wms/default?",
    "NDVI-GCOMC-World-Monthly": "https://ogcpreview2.restecmap.com/examind/api/WS/wms/default?",
    "SMC-Anomaly-GCOMW-World-Monthly": "https://ogcpreview2.restecmap.com/examind/api/WS/wms/default?",
    "PRC-Anomaly-GSMaP-World-Monthly": "https://ogcpreview2.restecmap.com/examind/api/WS/wms/default?",
    "SMC-GCOMW-World-Monthly": "https://ogcpreview2.restecmap.com/examind/api/WS/wms/default?",
    "PRC-GSMaP-World-Monthly": "https://ogcpreview2.restecmap.com/examind/api/WS/wms/default?",
    "CHL": "https://my.cmems-du.eu/thredds/wms/cmems_obs-oc_med_bgc-plankton_my_l4-multi-1km_P1M"
}

STAC_COLLECTIONS = {
    "no2-monthly": "https://staging-stac.delta-backend.com/collections/",
    "no2-monthly-diff": "https://staging-stac.delta-backend.com/collections/",
    "co2-mean": "https://staging-stac.delta-backend.com/collections/",
    "co2-diff": "https://staging-stac.delta-backend.com/collections/",
    "OMI_trno2-COG": "https://staging-stac.delta-backend.com/collections/",
    "OMSO2PCA-COG": "https://staging-stac.delta-backend.com/collections/",
    "facebook_population_density": "https://staging-stac.delta-backend.com/collections/",
    "nightlights-hd-monthly": "https://staging-stac.delta-backend.com/collections/",
    "IS2SITMOGR4-cog": "https://staging-stac.delta-backend.com/collections/",
    "MO_NPP_npp_vgpm": "https://staging-stac.delta-backend.com/collections/",
    "nceo_africa_2017": "https://staging-stac.delta-backend.com/collections/",
    "nightlights-hd-1band": "https://staging-stac.delta-backend.com/collections/",
    # these collections have a bit over 200 entries requesting them somehow breaks the endpoint
    #"HLSS30.002": "https://staging-stac.delta-backend.com/collections/",
    #"HLSL30.002": "https://staging-stac.delta-backend.com/collections/",
    "grdi-v1-built": "https://staging-stac.delta-backend.com/collections/",
    "grdi-v1-raster": "https://staging-stac.delta-backend.com/collections/",
    "grdi-shdi-raster": "https://staging-stac.delta-backend.com/collections/",
    "grdi-vnl-slope-raster": "https://staging-stac.delta-backend.com/collections/",
    "grdi-vnl-raster": "https://staging-stac.delta-backend.com/collections/",
    "grdi-filled-missing-values-count": "https://staging-stac.delta-backend.com/collections/",
    "grdi-imr-raster": "https://staging-stac.delta-backend.com/collections/",
    "grdi-cdr-raster": "https://staging-stac.delta-backend.com/collections/",
    "blue-tarp-planetscope": "https://staging-stac.delta-backend.com/collections/",
    "blue-tarp-detection": "https://staging-stac.delta-backend.com/collections/",
    "geoglam": "https://staging-stac.delta-backend.com/collections/",
    "landsat-c2l2-sr-antarctic-glaciers-thwaites": "https://dev-stac.delta-backend.com/collections/",
    "landsat-c2l2-sr-antarctic-glaciers-pine-island": "https://dev-stac.delta-backend.com/collections/",
    #"social-vulnerability-index-socioeconomic-nopop": "https://staging-stac.delta-backend.com/collections/",
    #"social-vulnerability-index-socioeconomic": "https://staging-stac.delta-backend.com/collections/",
    #"social-vulnerability-index-household": "https://staging-stac.delta-backend.com/collections/",
    #"social-vulnerability-index-household-nopop": "https://staging-stac.delta-backend.com/collections/",
    #"social-vulnerability-index-minority": "https://staging-stac.delta-backend.com/collections/",
    #"social-vulnerability-index-overall-nopop": "https://staging-stac.delta-backend.com/collections/",
    #"social-vulnerability-index-overall": "https://staging-stac.delta-backend.com/collections/",
    #"social-vulnerability-index-housing": "https://staging-stac.delta-backend.com/collections/",
    #"social-vulnerability-index-housing-nopop": "https://staging-stac.delta-backend.com/collections/",
    #"social-vulnerability-index-minority-nopop": "https://staging-stac.delta-backend.com/collections/",
    
}
# Collections items which have null datetimes and instead start_datetime and end_datetime
SPECIAL_STAC_DATE = [
    "IS2SITMOGR4-cog", "MO_NPP_npp_vgpm",
]

# Some datasets have different dates for different areas so we need to separate
# the request to only retrieve dates from those locations
BBOX = {
    "AWS_JAXA_CHLA": [
        ("44.48,12.05,45.82,13.85", "NorthAdriatic_JAXA"),
        ("34.838,139.24,35.6932,140.266", "JP01"),
        ("34.2,136.4,35.2,137.4", "JP04"),
        ("33.85,134.5,34.85,135.5", "JP02"),
    ],
    "AWS_JAXA_TSM": [
        ("44.48,12.05,45.82,13.85", "NorthAdriaticTSM_JAXA"),
        ("34.838,139.24,35.6932,140.266", "JP01TSM"),
        ("34.2,136.4,35.2,137.4", "JP04TSM"),
        ("33.85,134.5,34.85,135.5", "JP02TSM"),
    ],
    "LAKES_SURFACE_WATER_TEMPERATURE": [
        ("46.55,17.08,47.12,18.24", "Balaton"),
        ("58.2,12.05,59.5,14.4", "Vanern"),
        #("12.03,103.58,13.33,104.88", "Tonlesap"),
        ("34.94,135.81,35.54,136.36", "Biwa"),
    ],
}

MIGRATEDENDPOINT ="https://services.sentinel-hub.com/ogc/wfs/"
REQUESTOPTIONS = "?REQUEST=%s&srsName=%s&TIME=%s&outputformat=%s"%(
    "GetFeature", "EPSG:4326",
    "1900-01-01/3000-02-01", "application/json"
)

date_data_file = '/config/data_dates.json'
results_dict = {}

def retrieve_entries(url, offset, dateproperty="date"):
    r = requests.get("%s&FEATURE_OFFSET=%s"%(url, (offset*100)))
    res = []
    try:
        json_resp = r.json()
        features = json_resp["features"]
        [res.append(f["properties"][dateproperty]) for f in features if f["properties"][dateproperty] not in res]
        if len(features) == 100:
            res.extend(retrieve_entries(url, offset+1))
    except Exception as e:
        print("Issue parsing json for request: %s"%url)
        template = "An exception of type {0} occurred. Arguments:\n{1!r}"
        message = template.format(type(e).__name__, e.args)
        print (message)
    return res

def retrieve_stac_entries(url, offset):
    offset_step = 5000
    r = requests.get("%s&FEATURE_OFFSET=%s"%(url, (offset*offset_step)))
    res = []
    try:
        json_resp = r.json()
        features = json_resp["features"]
        for f in features:
            # try to find the datetime attribute
            date = None
            if "datetime" in f["properties"] and f["properties"]["datetime"] != None:
                date = f["properties"]["datetime"]
            elif "start_datetime" in f["properties"]:
                date = f["properties"]["start_datetime"]
            elif "date" in f["properties"]:
                date = f["properties"]["date"]
            cog_asset_href = f["assets"].get("cog_default", {}).get("href", None)
            product_id = f["id"]
            res.append([
                date,
                cog_asset_href or product_id
            ])
        if len(features) == offset_step:
            raise Exception("It seems there are more then 5000 entries for the requested collection %s"%url)
    except Exception as e:
        print("Issue parsing json for request: %s"%url)
        template = "An exception of type {0} occurred. Arguments:\n{1!r}"
        message = template.format(type(e).__name__, e.args)
        print (message)
    return res

def retrieve_location_stac_entries(url, offset, location, collection):
    offset_step = 5000
    r = requests.get("%s&FEATURE_OFFSET=%s"%(url, (offset*offset_step)))
    res = {}
    json_resp = r.json()
    features = json_resp["features"]
    try:
        for f in features:
            if collection in ["blue-tarp-detection", "blue-tarp-planetscope"]:
                bbox = [round(float(i), 3) for i in f["bbox"]]
            else:
                bbox = f["bbox"]
            if json.dumps(bbox) in location:
                # try to find the datetime attribute
                date = None
                if "datetime" in f["properties"] and f["properties"]["datetime"] != None:
                    date = f["properties"]["datetime"]
                elif "start_datetime" in f["properties"]:
                    date = f["properties"]["start_datetime"]
                elif "date" in f["properties"]:
                    date = f["properties"]["date"]
                location_id = "%s-%s"%(collection, location[json.dumps(bbox)]["id"])
                res.setdefault(location_id, []).append([
                    date,
                    f["assets"]["cog_default"]["href"]
                ])
            else:
                # print("Location not found for %s"%f["bbox"])
                # print(f["assets"]["cog_default"]["href"])
                pass
        if len(features) == offset_step:
            raise Exception("It seems there are more then 5000 entries for the requested collection %s"%url)
    except Exception as e:
        print("Issue parsing json for request: %s"%url)
        template = "An exception of type {0} occurred. Arguments:\n{1!r}"
        message = template.format(type(e).__name__, e.args)
        print (message)
    return res

print("Getting replace map times for E13d")
df = pd.read_csv("/public/eodash-data/data/E13d_detections.csv")
# create a JSON object with each poi-indicator being a key
aoi_ids = df['AOI_ID'].unique().tolist()
results = {}
for key in aoi_ids:
    matching = df.query(f"AOI_ID == '{key}'")
    time_entries = [try_parsing_date(item, "") for item in matching["Time"].tolist()]
    time_entries.sort()
    # fix duplicates 1 minute from each other
    time_entries_unique = [time_entries[0]]
    for i in range(1, len(time_entries)):
        if time_entries[i] - time_entries_unique[-1] >= timedelta(minutes=10):
            time_entries_unique.append(time_entries[i])
    time_entries_unique = [item.strftime('%Y-%m-%dT%H:%M:%S') for item in time_entries_unique]
    results[f"{key}-E13d"] = {
        "time": time_entries_unique,
        "eoSensor": ["Sentinel 2"],
        "inputData": ["Sentinel 2 L2A"],
    }
with open("/config/data_dates_e13d.json", 'w') as wfh:
    json.dump(results, wfh, indent=2)

print("Fetching information for STAC endpoints with time information")
try:
    with open("/config/locations.json") as locations_file:
        locations = json.load(locations_file)
        for collection, stac_url in STAC_COLLECTIONS.items():
            print("\t %s"%collection)
            # Pagination does not seem to work on this api, so we request 5000 items
            if collection in locations:
                results = retrieve_location_stac_entries(
                    "%s/%s/items?limit=5000"%(stac_url, collection),
                    0, locations[collection]["entries"],
                    collection,
                )
                # First we reverse all results
                for item in results.values():
                    item.reverse()
                results_dict = {**results_dict, **results}
            else:
                results = retrieve_stac_entries(
                    "%s/%s/items?limit=5000"%(stac_url, collection), 0,
                )
                results.reverse()
                results_dict[collection] = results

except Exception as e:
    print("Issue STAC data from NASA endpoint")
    template = "An exception of type {0} occurred. Arguments:\n{1!r}"
    message = template.format(type(e).__name__, e.args)
    print (message)

print("Fetching information for WMS endpoints with time information")
def interval(start: datetime, stop: datetime, delta: timedelta) -> Iterator[datetime]:
    while start <= stop:
        yield start
        start += delta
    yield stop

try:
    for layer, capabilties_url in WMSCOLLECTIONS.items():
        wms = WebMapService(capabilties_url, version='1.1.1')
        if layer in list(wms.contents):
            times = []
            for tp in wms[layer].timepositions:
                tp_def = tp.split("/")
                if len(tp_def)>1:
                    dates = interval(
                        parser.parse(tp_def[0]),
                        parser.parse(tp_def[1]),
                        parse_duration(tp_def[2])
                    )
                    times += [x.strftime('%Y-%m-%dT%H:%M:%S.000Z') for x in dates]
                else:
                    times.append(tp)
            times = [time.replace('\n','').strip() for time in times]
            # get unique times
            times_f = reduce(lambda re, x: re+[x] if x not in re else re, times, [])
            results_dict[layer] = times_f
except Exception as e:
    print("Issue extracting information from WMS capabilties")
    template = "An exception of type {0} occurred. Arguments:\n{1!r}"
    message = template.format(type(e).__name__, e.args)
    print (message)

print("Fetching information of available dates for BYOD")
try:
    for key in BYOD_COLLECTIONS:
        print("\t %s"%key)
        # fetch identifier from environment
        if key in envs:
            coll_id = envs[key]
            layer_name = "&TYPENAMES=DSS10-%s"%(coll_id)
            if key in ZARRCOLLECTIONS:
                layer_name = "&TYPENAMES=zarr-%s"%(coll_id)
            if key in BBOX:
                # There are multiple locations for this dataset so we do
                # requests for each location
                for (val, subr_key) in BBOX[key]:
                    bbox = "&BBOX=%s"%val
                    request = "%s%s%s%s%s"%(
                        MIGRATEDENDPOINT, envs["SH_INSTANCE_ID"], REQUESTOPTIONS,
                        layer_name, bbox
                    )
                    results = retrieve_entries(request, 0)
                    results.sort()
                    results_dict[("%s_%s"%(key, subr_key))] = results
            else:
                bbox = "&BBOX=-180,90,180,-90"
                request = "%s%s%s%s%s"%(
                    MIGRATEDENDPOINT, envs["SH_INSTANCE_ID"], REQUESTOPTIONS,
                    layer_name, bbox
                )
                results = retrieve_entries(request, 0)
                results = list(set(results))
                results.sort()
                results_dict[key] = results
        else:
            print("Key for %s not found in environment variables"%key)
except Exception as e:
    print("Issue retrieving BYOD information from new server")
    template = "An exception of type {0} occurred. Arguments:\n{1!r}"
    message = template.format(type(e).__name__, e.args)
    print (message)

print("Writing results to %s"%date_data_file)
with open(date_data_file, "w") as fp:
    json.dump(results_dict, fp, indent=4, sort_keys=True)

###############################################################################

delete_files = False

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
    "indicatorName": "indicator_name",
    "region": "region",
    "updateFrequency": "update_frequency",
    "yAxis": "y_axis"
}

geoDB_array_map = {
    "eo_sensor": "eo_sensor",
    "input_data": "input_data",
    "time": "time",
    "measurement_value": "measurement_value",
    "reference_time": "reference_time",
    "reference_value": "reference_value",
    "indicator_value": "indicator_value",
    "color_code": "color_code",
    "data_provider": "data_provider",
    "site_name_arr": "site_name"
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


def generateData(
    mapping, array_mapping, input_folder, output_file, output_folder,
    local_files=[], geoDB_indicators=[], input_json=None):

    poi_dict = {}

    # Clear output folder
    if delete_files:
        for filename in os.listdir(output_folder):
            file_path = os.path.join(output_folder, filename)
            try:
                if os.path.isfile(file_path) or os.path.islink(file_path):
                    os.unlink(file_path)
                elif os.path.isdir(file_path):
                    shutil.rmtree(file_path)
            except Exception as e:
                print('Failed to delete %s. Reason: %s' % (file_path, e))

    # Load geodb data
    cm = geoDB_map
    cm_arr = geoDB_array_map

    for indicator in geoDB_indicators:
        indicator_id = indicator[0]
        indicator_query = indicator[1]
        try:
            indicator_data = geodb.get_collection(indicator_id, database='eodash', query=indicator_query)
            for index, line in indicator_data.iterrows():
                # Aggregate data for unique pois and write unique data to poi_dict
                poi_key = "%s-%s" % (line[cm["aoiID"]], line[cm["indicator"]])
                if poi_key in poi_dict:
                    # If key already saved we add the relevant data
                    object_always_present = {
                        "eo_sensor": line[cm_arr["eo_sensor"]],
                        "input_data": line[cm_arr["input_data"]],
                        "time": try_parsing_date(line[cm_arr["time"]], line),
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
                        "time": try_parsing_date(line[cm_arr["time"]], line),
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
                        "subAoi": re.sub(r'([0-9]+\.[0-9]{5})([0-9]+)', r'\1', line[cm["subAoi"]]),
                        "updateFrequency": line[cm["updateFrequency"]],
                        # Actual data
                        "poi_data": poi_data_always,
                    }
        except Exception as e:
            print(
                "WARNING: Issue reading indicator %s from GeoDB and thus "
                "skipped for generation" % (indicator_id)
            )
            print("Exception: %s" % e)

    # Load all csv listed in local files
    cm = mapping
    cm_arr = array_mapping
    for file_path in local_files:
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
                            "time": try_parsing_date(line[cm_arr["time"]], line),
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
                            "time": try_parsing_date(line[cm_arr["time"]], line),
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
                            "subAoi": re.sub(r'([0-9]+\.[0-9]{5})([0-9]+)', r'\1', line[cm["subAoi"]]),
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
        poi_dict[poi_key]["lastTime"] = ([""] + [i["time"] for i in curr_data if i["time"] not in ["", 'NaN', '/']])[-1]
        poi_dict[poi_key]["lastMeasurement"] = ([""] + [i["measurement_value"] for i in curr_data if i["measurement_value"] not in ["", 'NaN', '/']])[-1]
        poi_dict[poi_key]["lastColorCode"] = ([""] + [i["color_code"] for i in curr_data if i["color_code"] not in ["", 'NaN', '/']])[-1]
        poi_dict[poi_key]["lastIndicatorValue"] = ([""] + [i["indicator_value"] for i in curr_data if i["indicator_value"] not in ["", 'NaN', '/']])[-1]
        poi_dict[poi_key]["lastReferenceTime"] = ([""] + [i["reference_time"] for i in curr_data if i["reference_time"] not in ["", 'NaN', '/']])[-1]
        poi_dict[poi_key]["lastReferenceValue"] = ([""] + [i["reference_value"] for i in curr_data if i["reference_value"] not in ["", 'NaN', '/']])[-1]

    def date_converter(obj):
        if isinstance(obj, datetime):
            return obj.strftime('%Y-%m-%dT%H:%M:%S')

    output_dict = {key: {subkey: poi_dict[key][subkey] for subkey in outKeys} for key in poi_dict}
    ordered_dict = collections.OrderedDict(sorted(output_dict.items()))
    with open(output_file, "w") as fp:
        json.dump(list(ordered_dict.values()), fp, indent=4, default=date_converter, sort_keys=True)

    # Generate all unique location json files
    for poi_key in poi_dict:
        with open("%s%s.json" % (output_folder, poi_key), "w") as gp:
            json.dump(poi_dict[poi_key]["poi_data"], gp, indent=4, default=date_converter, sort_keys=True)


#################
# Retrieval of official stories
print("Fetching data for official stories")
stories_config = '/config/stories.json'
dashboards_folder = '/public/data/dashboards'
dashboards_endpoint = "https://eodash-dashboard-api.f77a4d8a-acde-4ddd-b1cd-b2b6afe83d7a.hub.eox.at/get?id="
with open(stories_config) as json_file:
    stories_data = json.load(json_file)
    for instance in stories_data:
        # Fetching instance specific stories
        for category in stories_data[instance].values():
            if category:
                for entry in category.values():
                    if 'originalDashboardId' in entry:
                        dash_id = entry['originalDashboardId']
                        resp = requests.get(dashboards_endpoint+dash_id)
                        if resp.status_code == 200:
                            with open("%s/%s.json"%(dashboards_folder, dash_id), "w") as f:
                                f.write(json.dumps(resp.json(), indent = 2))
                        else:
                            print ('Issue retrieving story with dashboard id %s'%dash_id)

#################

print("Generating data for trilateral")
# Generate for trilateral
generateData(
    default_map,
    default_array_map,
    "/public/data/trilateral/",
    "/public/data/internal/pois_trilateral.json",
    "/public/data/internal/",
    [
        '/public/data/trilateral/E10a1.csv',
        '/public/eodash-data/data/E10a2.csv',
        '/public/eodash-data/data/E10a3.csv',
        '/public/data/trilateral/E10a6.csv',
        '/public/data/trilateral/E10a8.csv',
        '/public/data/trilateral/E10c.csv',
        '/public/data/trilateral/N2.csv',
        '/public/data/trilateral/N1_EG.csv',
        '/public/data/trilateral/N2_EG.csv',
        '/public/data/trilateral/SIF_EG.csv',
    ],
    [
        #['E1', 'or=(aoi_id.eq.BE3,aoi_id.eq.FR3)'], archived
        #['E1a', 'or=(aoi_id.eq.BE3,aoi_id.eq.FR3)'], archived
        ['E9_tri', ''],
        # ['N3_tri', ''],
        ['Regional_Water_quality_timeseries', ''], # contains N3b indicator
        ['N1_tri', ''],
        ['E13b_tri', ''],
        ['E13c_tri', ''],
        ['VITS_Vegetation_Index_Timeseries', ''],
        ['SMCTS_Soil_Moisture_Timeseries', ''],
        ['PRCTS_Precipitation_Timeseries', ''],
        ['Lake_water_extent_tri_timeseries', ''],
        ['Lake_water_level_tri_timeseries', ''],
    ]
)


print("Generating data for eodashboard")
# Generate for eodash
generateData(
    default_map,
    default_array_map,
    "/public/eodash-data/data/",
    "/public/data/internal/pois_eodash.json",
    "/public/eodash-data/internal/",
    [
        '/public/eodash-data/data/C1.csv',
        '/public/eodash-data/data/C2.csv',
        '/public/eodash-data/data/C3.csv',
        '/public/eodash-data/data/E8.csv',
        '/public/eodash-data/data/E10a1.csv',
        '/public/eodash-data/data/E10a2.csv',
        '/public/eodash-data/data/E10a3.csv',
        '/public/eodash-data/data/E10a5.csv',
        '/public/data/trilateral/E10a8.csv',
        '/public/eodash-data/data/E10a9.csv',
        '/public/eodash-data/data/E13b2.csv',  # archived
        '/public/eodash-data/data/N1a_PM25_CAMS.csv',
        '/public/eodash-data/data/N1b_NO2_CAMS.csv',
        '/public/eodash-data/data/N1c_PM10_CAMS.csv',
        '/public/eodash-data/data/N1d_O3_CAMS.csv',
        '/public/eodash-data/data/E13e_cargo.csv',
        '/public/eodash-data/data/E13f_fishing.csv',
        '/public/eodash-data/data/E13g_tanker.csv',
        '/public/eodash-data/data/E13h_gioiatauro_tug.csv',
        '/public/eodash-data/data/E13i_gioiatauro_SearchRescue.csv',
        '/public/eodash-data/data/E13l_genova_pleasure.csv',
        '/public/eodash-data/data/E13m_genova_passenger.csv',
        '/public/eodash-data/data/E13n_traffic.csv',
    ],
    [
        #['E1', ''], archived
        ['E1_S2', ''],
        #['E1a', ''], archived
        ['E1a_S2', ''],
        #['E2', ''], archived
        ['E2_S2', ''],
        ['E4', ''],
        ['E5', ''],
        #['E8', ''],
        ['E10a6', ''],
        ['E10a10', ''],
        ['E11', ''],
        ['E12b', ''],
        ['E13b', ''],
        ['E13d', ''],
        ['N3', ''],
        ['N1', ''],
        ['E200', ''],
        ['Sentinel_1_Vessel_Density_Europe_Timeseries', ''],
    ]
)
