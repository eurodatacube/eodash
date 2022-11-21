#!/bin/bash

defaultuserid=1000

if [ "$1" == "changeuser" ]
then
  defaultuserid=1001
fi

echo "Running generate_files script ..."
docker run --user $defaultuserid --rm -it -v $PWD/../config:/config -v $PWD:/working -v $PWD/../../public:/public eurodatacube/jupyter-user:0.19.6 /opt/conda/envs/eurodatacube-0.19.6/bin/python3 /working/generate_files.py

echo "Running retrieve_covid_data script ..."
docker run --user $defaultuserid --rm -it -v $PWD/../assets:/assets -v $PWD:/working -v $PWD/../../public:/public eurodatacube/jupyter-user:0.19.6 /opt/conda/envs/eurodatacube-0.19.6/bin/python3 /working/retrieve_covid_data.py

echo "Running retrieve_mobility_data script ..."
docker run --user $defaultuserid --rm -it -v $PWD:/working -v $PWD/../../public:/public eurodatacube/jupyter-user:0.19.6 /opt/conda/envs/eurodatacube-0.19.6/bin/python3 /working/retrieve_mobility_data.py

echo "Running retrieve_oxcgrt_lockdown_data script ..."
docker run --user $defaultuserid --rm -it -v $PWD/../assets:/assets -v $PWD:/working -v $PWD/../../public:/public eurodatacube/jupyter-user:0.19.6 /opt/conda/envs/eurodatacube-0.19.6/bin/python3 /working/retrieve_oxcgrt_lockdown_data.py

echo "Running retrieve_oilx_data script ..."
docker run --user $defaultuserid --rm -it -v $PWD:/working -v $PWD/../../public:/public eurodatacube/jupyter-user:0.19.6 /opt/conda/envs/eurodatacube-0.19.6/bin/python3 /working/retrieve_oilx_data.py

echo "Re-generate static legends"
docker run --user $defaultuserid --rm -it -v $PWD:/working -v $PWD/../../public:/public eurodatacube/jupyter-user:0.19.6 /opt/conda/envs/eurodatacube-0.19.6/bin/python3 /working/colormap_generator.py

echo "Re-generating capital selection data"
docker run --user $defaultuserid --rm -it -v $PWD:/working -v $PWD/../assets:/assets -v $PWD/../../public:/public eurodatacube/jupyter-user:0.19.6 /opt/conda/envs/eurodatacube-0.19.6/bin/python3 /working/create_capitals.py
