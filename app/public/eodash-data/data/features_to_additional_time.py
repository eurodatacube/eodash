import json
with open ('to_be_added.txt') as f:
    a = f.readlines()
d = {}
eoSensor = 'Sentinel-2' # replace
inputData = 'Sentinel 2 L2A' # replace
colorCode = 'BLUE' # replace

for line in a:
    fix = line.strip()
    it = fix.split('_')
    k = f'{it[1]}-{it[0]}'
    t = it[2]
    time = f'{t[0:4]}-{t[4:6]}-{t[6:8]}T{t[9:11]}:{t[11:13]}:{t[13:15]}'
    if k in d:
        d[k]['time'].append(time)
        d[k]['eoSensor'].append(eoSensor)
        d[k]['inputData'].append(inputData)
        d[k]['colorCode'].append(colorCode)
    else:
        d[k] = {
        'time': [time],
        'eoSensor': [eoSensor],
        'inputData': [inputData],
        'colorCode': [colorCode],
        }
print(",\n".join("'{}': {}".format(k, v) for k, v in d.items()))
