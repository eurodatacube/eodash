#!/usr/bin/python
"""
Helper script to split monthly input geojson files with all detections for example from E13d into separate entries per grouped by AOI and timestamp
Also creates a csv for additional indicator with `suffix` to allow grouped view of these data

Usage:
# update `list_of_dates_to_process` with dates in YYYYMM format and do:
docker run --rm -it -v $PWD:/working -v $PWD/../../public:/public eurodatacube/jupyter-user:0.19.6 /opt/conda/envs/eurodatacube-0.19.6/bin/python3 /working/convert_monthly.py

"""
import json
import os
import csv
import datetime
from glob import glob
import time

import geopandas as gpd
import shapely
import pandas as pd
import numpy as np
from math import sin, cos, sqrt, atan2, radians

indicator = 'E13d'  # indicator to fetch jsons of
column_names_csv = ['AOI', 'Time', 'AOI_ID']
list_of_dates_to_process = ['201807', '201808', '201809', '201810', '201811', '201812', '201901', '201902', '201903', '201904', '201905', '201906', '201907', '201908', '201909', '201910', '201911', '201912', '202001', '202002', '202003', '202004', '202005', '202006', '202007', '202008', '202009', '202010', '202011', '202012', '202101', '202102']  # to be updated

def split_aoi(aoi):
    # splits aoi column into lat, lon variables
    lat, lon = aoi.split(',')
    return float(lat), float(lon)


def feature_collection(ftrs):
    # creates a feature collection from list of features
    return {"features": ftrs, "type": "FeatureCollection"}


def try_parsing_date(text, formats=('%Y-%m-%dT%H:%M:%S',)):
    # tries to create datetime from text with given formats tuple
    for fmt in formats:
        try:
            return datetime.datetime.strptime(text, fmt)
        except ValueError:
            pass
    raise ValueError('time not provided in valid format')


featuresPath = f'/public/eodash-data/features/{indicator}/'
output_csv_path = f'/public/eodash-data/data/{indicator}_detections.csv'
if not os.path.exists(output_csv_path):
    with open(output_csv_path, 'w') as csvv:
        w = csv.writer(csvv)
        # writes header
        w.writerow(column_names_csv)


def get_closest_point_haversine(point, list_of_points):
    """Returns closest point from a list of points to a given point using haversine formula.

    Args:
        point (shapely.geometry): Point to get closest point to
        list_of_points (list[shapely.geometry]): List of shapely geometries to get closest one from point 

    Returns:
        shapely.geometry: closest geometry from list_of_points
    """
    distance_min = 1e5
    closest_point = None
    r = 6373.0
    lon1 = radians(point.x)
    lat1 = radians(point.y)
    for individual_point in list_of_points:
        lat2 = radians(individual_point.y)
        lon2 = radians(individual_point.x)
        dlon = lon2 - lon1
        dlat = lat2 - lat1
        a = sin(dlat / 2)**2 + cos(lat1) * cos(lat2) * sin(dlon / 2)**2
        c = 2 * atan2(sqrt(a), sqrt(1 - a))
        distance = r * c

        if distance < distance_min:
            closest_point = individual_point
            distance_min = distance
    return closest_point


def convert(path2, indicator, result_list=[]):
    # initialize output
    new_features = {}  # key=aoiId_time -fname, ftrs
    path = f'/public/eodash-data/features/{indicator}/{indicator}_{path2}.geojson'
    # load monthly geojson with date & geometry of detection as 1 feature
    gdf = gpd.read_file(path)

    # go over each individual entry of the geojson, extract geometry and date
    for _, row in gdf.iterrows():
        data = {}
        # find nearest point (aoi_id)
        nearest_geom = get_closest_point_haversine(row.geometry, individual_points_from_multipoint)
        # get relevant aoi_id
        found = gdf_internal.loc[(gdf_internal['lon'] == nearest_geom.x) & (gdf_internal['lat'] == nearest_geom.y)]
        updated_time = try_parsing_date(row['TIMESTAMP UTC']).strftime('%Y-%m-%dT%H:%M:00')  # remove seconds
        aoiId = f"{found['aoiID'].iloc[0]}"
        data['AOI_ID'] = aoiId
        # add time
        data['Time'] = updated_time
        # add other values for some columns from internal data
        data['AOI'] = f"{found['aoi'].iloc[0]}"
        result_list.append(data)

        updated_time_without_s = try_parsing_date(row['TIMESTAMP UTC']).strftime('%Y%m%dT%H%M')  # format for filenames
        key_for_ftrs_dict = f'{aoiId}_{updated_time_without_s}'
        properties = row.to_dict()
        # remove geometry column
        del properties['geometry']
        # store individual geojson features to a collection for later write
        feature = {"type": "Feature", "geometry": shapely.geometry.mapping(row['geometry']), "properties": properties}
        if (key_for_ftrs_dict in new_features):
            new_features[key_for_ftrs_dict].append(feature)
        else:
            new_features[key_for_ftrs_dict] = [feature]
    # write individual geojsons
    for key in new_features:
        with open(f'{featuresPath}{indicator}_{key}.geojson', 'w') as output_geojson:
            json.dump(feature_collection(new_features[key]), output_geojson)
    return result_list


# track time
start = time.time()
internal_data_path = '/public/data/internal/pois_eodash.json'
with open(internal_data_path) as inte:
    internalJson = json.load(inte)
# filter only pois from selected indicator
inter = [item for item in internalJson if item['indicator'] == indicator]
# create geopandas dataframe to enable easy coordinate match
df = pd.DataFrame.from_dict(inter)
# extract coords to create geometry column
df['lat'], df['lon'] = zip(*df['aoi'].map(split_aoi))

gdf_internal = gpd.GeoDataFrame(df, geometry=gpd.points_from_xy(df.lon, df.lat))
# create multipoint to be able to find nearest neighbour from list
multipoint = gdf_internal.geometry.unary_union
individual_points_from_multipoint = [pt for pt in multipoint]
csv_detections_df = pd.read_csv(output_csv_path, header=0)
# substitute with desired months or just single month (will append to existing csv if exists)

for path in list_of_dates_to_process:
    resulting_list = convert(path, indicator)
    print(f'step {path} has taken {time.time() - start} seconds')
    start = time.time()
    data_as_df = pd.DataFrame(resulting_list)
    save = pd.concat([csv_detections_df, data_as_df[csv_detections_df.columns.intersection(data_as_df.columns)]]).replace(np.nan, '', regex=True).drop_duplicates()
    # save csv
    save.to_csv(output_csv_path, mode='w', index=False)
