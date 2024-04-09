#!/usr/bin/python
"""
Helper script to create location and data separation

Usage:
docker run --rm -it -v $PWD/../config:/config -v $PWD:/working -v $PWD/../../public:/public eurodatacube/jupyter-user:0.19.6 /opt/conda/envs/eurodatacube-0.19.6/bin/python3 /working/generate_stories.py

If issues with write permission you might have to add a user as parameter
with the same user id as your local account, e.g. "--user 1001"
"""

import json
import requests

#################
# Retrieval of official stories
print("Fetching data for official stories")
stories_config = "/config/stories.json"
dashboards_folder = "/public/data/dashboards"
dashboards_endpoint = "https://eodash-dashboard-api.f77a4d8a-acde-4ddd-b1cd-b2b6afe83d7a.hub.eox.at/get?id="
with open(stories_config) as json_file:
    stories_data = json.load(json_file)
    for instance in stories_data:
        # Fetching instance specific stories
        for category in stories_data[instance].values():
            if category:
                for entry in category.values():
                    if "originalDashboardId" in entry:
                        dash_id = entry["originalDashboardId"]
                        resp = requests.get(dashboards_endpoint + dash_id)
                        if resp.status_code == 200:
                            with open(
                                "%s/%s.json" % (dashboards_folder, dash_id), "w"
                            ) as f:
                                f.write(json.dumps(resp.json(), indent=2))
                        else:
                            print(
                                "Issue retrieving story with dashboard id %s" % dash_id
                            )
