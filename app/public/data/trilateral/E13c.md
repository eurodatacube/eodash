## Shipping Activity at Major Ports

Supply chains around the world dependent on cargo shipping have been interrupted by travel restrictions and quarantines designed to stop the spread of the novel coronavirus. Many ports are closed, shipments have been canceled, and, in some locations, altered shipping routes have prevented the efficient movement of cargo. 

NASA and ESA researchers are using cutting-edge artificial intelligence technology and high-resolution satellite imagery from Planet Labs and [Sentinel-2](https://sentinel.esa.int/web/sentinel/missions/sentinel-2) to track shipping activity at major ports in the U.S. and in Europe during the coronavirus pandemic. This data will help quantify the level of shipping-related economic activity over time and could eventually contribute to our understanding of the environmental implications of global decreases in shipping on key air pollutants like nitrogen dioxide (NO2) and sulphur dioxide (SO2).

### Detection of ships on PlanetScope images

NASA’s Interagency Implementation and Advanced Concepts Team (IMPACT), based at NASA’s Marshall Space Flight Center in Huntsville, Alabama, trained an algorithm using supervised machine learning technique to detect ships on PlanetScope images. The algorithm detects a ship on the image and geolocates it. The NASA team has also built an Application Programming Interface (API) that allows ship detections to be aggregated across a port area for a given day. Efforts are also underway to conduct a study of ship detections in U.S. ports during the period of pandemic travel restrictions, as compared to the same period of time in previous years. 

NASA researchers have access to the high-resolution imagery from Planet Labs, through the Commercial SmallSat Data Acquisition Program (CSDAP), which acquires data from commercial sources that support NASA's Earth science research goals. The PlanetScope image resolution is 3 meters per pixel, which allows researchers to get a detailed look at changes occurring on the ground. Commercial small satellites also provide high temporal resolution, making images available almost every day (depending on cloud cover) for key areas of interest. 

Ship detections will be provided daily, except when prevented by significant cloud cover. After the machine learning model detects the ships, a secondary human validation is also performed before the detections are made available for the dashboard. 

### Detection of ships on Sentinel-2 images

ESA engineers based at ESA's [Centre for Earth Observation (ESRIN)](https://www.esa.int/About_Us/ESRIN) trained a Machine Learning algorithm to recognise ships on  Copernicus Sentinel-2 satellite images. Sentinel-2 provides high-resolution (10 meters) multi-spectral imagery for land services. It provides for example, imagery of vegetation, soil and water cover, inland waterways and coastal areas. Sentinel-2 also delivers information for emergency services. The Copernicus Sentinel-2 mission comprises a constellation of two polar-orbiting satellites and has a high revisit time (10 days at the equator with one satellite, and 5 days with 2 satellites under cloud-free conditions which results in 2-3 days at mid-latitudes). 

To reduce the number of false alarms and mis-detections, a cloud-masking operation is performed on the images before the Machine Learning algorithm is applied. The outputs of the Machine Learning algorithm are bounding boxes of the detected ships within pre-defined areas of interest at major European harbours, such as Genova in Italy or Hamburg in Germany. 
