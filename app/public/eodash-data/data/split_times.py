import geopandas as gd
import pandas as pd
ff = 'E13d_NTNU_USF_UTFPR_202010.geojson'
data = gd.read_file(ff)
data['TIMESTAMP UTC']
data['Timestamp_mo'] = data['TIMESTAMP UTC'].astype(str).str.slice(0, 7)
g = data.groupby(pd.Grouper(key='Timestamp_mo'))
dfs = [group for _, group in g]
for dff in dfs:
    key = dff['Timestamp_mo'].iloc[0].replace('-', '')
    print(key)
    dfff = dff.drop('Timestamp_mo', axis=1)
    dfff.to_file('E13d_%s.geojson' % key, driver='GeoJSON')

"""
{ "type": "FeatureCollection", "features": [
{ "type": "Feature", "properties": { "TIMESTAMP UTC": "2018\/07\/01 11:11:03", "CLASSIFICATION": "Flying plane" }, "geometry": { "type": "Point", "coordinates": [ -4.878435525093354, 36.91766157884098 ] } },
{ "type": "Feature", "properties": { "TIMESTAMP UTC": "2018\/07\/01 11:11:03", "CLASSIFICATION": "Flying plane" }, "geometry": { "type": "Point", "coordinates": [ -4.7894885497386115, 36.828892486298294 ] } },
"""
