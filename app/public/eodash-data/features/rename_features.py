import os
from glob import glob
import json
EE1 = glob('*.geojson')
# E1_ES7_20200615T0633.geojson
for featurefilename in EE1:
    # open relevant file
    tt = featurefilename.split('_')
    datafilename = tt[1] + '-' + tt[0] + '.json'
    featurefiletime = tt[2].split('.')[0]
    with open('/home/lubomir/projects/eodash/app/public/eodash-data/internal/%s' % datafilename) as ff:
        data = json.load(ff)
        # find entry with the time 2020-01-26T10:56:48 == 20200615T063345
        matches = [x['time'] for x in data if x['time'].replace('-', '').replace(':', '')[:-2] == featurefiletime]
        print(featurefiletime, matches)
        if len(matches)>0:
            os.rename(featurefilename, "%s.geojson" % (tt[0] + '_' + tt[1] + '_' + matches[0].replace('-', '').replace(':', '')))
    