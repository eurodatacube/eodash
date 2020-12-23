#!/usr/bin/python
"""
Helper script to split monthly input geojson files with all detections for example from E13d into separate entries per grouped by AOI and timestamp
Also creates a csv for additional indicator with `suffix` to allow grouped view of these data

Usage:
# update `list_of_dates_to_process` with dates in YYYYMM format and do:
docker run --rm -it -v $PWD:/working eurodatacube/jupyter-user:0.19.6 /opt/conda/envs/eurodatacube-0.19.6/bin/python3 /working/convert_monthly.py

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

new_suffix = 'a'  # suffix of new indicator to create
indicator = 'E13d'  # indicator to fetch jsons of
column_names_csv = ['AOI', 'Country', 'Region', 'City', 'Site Name', 'Description', 'Method', 'EO Sensor', 'Input Data', 'Indicator code', 'Time', 'Measurement Value', 'Reference Description', 'Reference time', 'Reference value', 'Rule', 'Indicator Value', 'Sub-AOI', 'Y axis', 'Indicator Name', 'Color code', 'Data Provider', 'AOI_ID', 'Update Frequency']
list_of_dates_to_process = ['201807', '201808', '201809', '201810', '201811', '201812', '201901', '201902', '201903', '201904', '201905', '201906', '201907', '201908', '201909', '201910', '201911', '201912', '202001', '202002', '202003', '202004', '202005', '202006', '202007', '202008', '202009']  # to be updated

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


featuresPath = f'/working/eodash-data/features/{indicator}/'
output_csv_path = f'/working/eodash-data/data/{indicator}_detections.csv'
if not os.path.exists(output_csv_path):
    with open(output_csv_path, 'w') as csvv:
        w = csv.writer(csvv)
        # writes header
        w.writerow(column_names_csv)


def convert(path2, indicator):
    # initialize output
    new_features = {}  # key=aoiId_time -fname, ftrs
    path = f'/working/eodash-data/features/{indicator}/{indicator}_{path2}.geojson'
    yyyy = path.split('_')[1][0:4]
    mm = path.split('_')[1][4:6]
    # load monthly geojson with date & geometry of detection as 1 feature
    gdf = gpd.read_file(path)
    # load individual geojson for first poi from glob (does not matter which is taken), as usually these data match
    poi_json_glob = f'/working/eodash-data/internal/*{indicator}*.json'
    poi_json_path = glob(poi_json_glob)[0]
    with open(poi_json_path) as poi_json:
        poiJson = json.load(poi_json)
        # extract matching entry based on time of monthly file - to later extract for example Input Data value etc.
        single_entry_time = [i for i in poiJson if i['time'] == f'{yyyy}-{mm}-01T00:00:00']

    internal_data_path = '/working/data/internal/pois_eodash.json'
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
    # go over each individual entry of the geojson, extract geometry and date
    for index, row in gdf.iterrows():
        data = {}
        new_csv_content = gpd.GeoDataFrame(columns=column_names_csv)
        # find nearest point (aoi_id)
        _, nearest_geom = shapely.ops.nearest_points(row.geometry, multipoint)
        # get relevant aoi_id
        found = gdf_internal.loc[(gdf_internal['lon'] == nearest_geom.x) & (gdf_internal['lat'] == nearest_geom.y)]
        # update AOI_ID, adding suffix in case poi without suffix was found
        aoiId = f"{found['aoiID'].iloc[0]}"
        if not aoiId.endswith(new_suffix):
            aoiId = f"{aoiId}{new_suffix}"
        data['AOI_ID'] = aoiId
        # update AOI, adding last digit to lon to avoid same digits as source
        data['AOI'] = f"{found['aoi'].iloc[0]}1"
        # add time
        data['Time'] = row['TIMESTAMP UTC']
        # add values for some columns from internal
        data['Region'] = found['region'].iloc[0]
        data['Country'] = 'all'  # needs update to 'all' in case if we want to display map (showMap function)
        data['City'] = found['city'].iloc[0]
        data['Description'] = found['description'].iloc[0]
        data['Indicator code'] = f"{found['indicator'].iloc[0]}"
        data['Site Name'] = found['siteName'].iloc[0]
        data['Indicator Name'] = found['indicatorName'].iloc[0]
        # data['Color code'] = found['lastColorCode']
        data['Sub-AOI'] = found['subAoi'].iloc[0]
        # data['Update Frequency'] = found['updateFrequency']
        
        data['Input Data'] = single_entry_time[0]['input_data']
        data['Input Data'] = single_entry_time[0]['input_data']
        data['EO Sensor'] = single_entry_time[0]['eo_sensor']
        # dirty and superslow way of merging columns of csv with actual limited data (merge all columns dataframe with sparser dataframe containing only some data)
        # todo, redo this for performance reasons
        csv_read = pd.read_csv(output_csv_path, header=0)
        data_as_df = pd.DataFrame(data, index=[0])
        save = pd.concat([csv_read, data_as_df[csv_read.columns.intersection(data_as_df.columns)]]).replace(np.nan, '', regex=True).drop_duplicates()
        # save csv
        save.to_csv(output_csv_path, mode='w', index=False)

        time_for_filename = try_parsing_date(row['TIMESTAMP UTC']).strftime('%Y%m%dT%H%M%S')
        key_for_ftrs_dict = f'{aoiId}_{time_for_filename}'
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


# track time
start = time.time()
# substitute with desired months or just single month (will append to existing csv if exists)
for path in list_of_dates_to_process:
    convert(path, indicator)
    print(f'step {path} has taken {time.time() - start} seconds')
    start = time.time()
