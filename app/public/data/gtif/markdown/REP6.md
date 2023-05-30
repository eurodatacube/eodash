### Sentinel-2 Wind Turbine Detection

**Product name:** Sentinel-2 Wind Turbine Detection

**Spatial resolution:** Bounding Box

**Temporal reference:** Autumn 2022 – Spring 2023

**CRS:** EPSG:4326 - WGS 84

**Value range:** -

**Coverage:** Austria (9.5°, 46.3°, 17.2°, 49.0°)

**Product description:**

Wind turbine detections were made using Sentinel-2 imagery and a state-of-the-art object
detection neural network.

The model was trained using wind turbine locations from Open Street Map as a starting
point. Data was gathered for Austria and the surrounding countries. This data was manually
cleaned by comparing it to high-resolution imagery and imagery from Sentinel-2. The OSM
data was found to be around 85% accurate before it was manually cleaned, and assumed
100% correct after this process.

The model architecture used for bounding box prediction
was Faster R-CNN (https://arxiv.org/abs/1506.01497). Sentinel-2 RGB bands (10m) were
used as image input.

Sentinel-2 imagery from the late Autumn, Winter, and early Spring were
used for model training and inference. This was chosen as wind turbines are most visible
during this period due to the long shadow cast by turbines.

When evaluating early runs of the model, false detections of wind turbines were found in
mountainous regions and specific land cover types. For example, false detections in high
altitude areas and steep terrain where turbines are not typically found. Detecting wind
turbines in forested areas was particularly challenging, as the wind turbine’s shadow was not
visible in imagery. Similarly tall buildings and power lines were leading to false turbine
detections. Several filtering techniques were applied using Copernicus data sets and known
electric tower locations from Open Street Map. Detections with the following characteristics
were not considered valid and filtered out:

1. Detections where the slope is great than 25 degrees (slope from Copernicus 10m DEM)
2. Detections where the elevation is great than 1850m (height from Copernicus 10m DEM)
3. Detections located in the following Corine Land Cover (2018) classes:
a. Discontinuous urban fabric
b. Port areas
c. Green urban areas
d. Sport and leisure facilities
e. Mineral extraction sites
4. Detections located within the Tree Cover class from ESA WorldCover (2021)
5. Detection that were located within 50m of electric towers from Open Street Map

**Source URL:**
**Source DOI:** -

© DHI A/S - / KEGR / 2023-05-26

**Input datasets:**

**Main datasets:** Sentinel-2, Modified Wind Turbine locations from Open Street Map

**Filtering datasets:** Copernicus DEM (10m), Corine Land Cover (2018), ESA WorldCover
(2021), Electric tower locations from Open Street Map

**Reported accuracy:**

The accuracy of this product was assessed in two steps: 1) to estimate the commission
error (Users accuracy) and 2) estimate of the omission error (Producers Accuracy).
To assess the commission error a simple random sample of 100 detected wind turbines
were chosen and visually validated. If the predicted bounding box was within 20m of a
visually confirmed wind turbine the detection was considered correct.
To assess the omission error a validation sample of 100 known locations of wind turbines
was compared to the detected bounding boxes. If the predicted bounding box was within
20m of a known wind turbine location the detection was considered correct.
The accuracy assessment showed the following:
Commission error: 13% - i.e. approx. 87% of the reported detections are TRUE locations of
wind turbines, while 13% are FALSE detections.
Omission error: 33% - i.e. approx. 67% of all wind turbines in Austria are detected by the
model, and 33% of turbines are not detected.
When we apply the same filtering for excluding urban/built-up areas and forested areas (see
Product description) the Omission error is reduced to 30%, meaning 70% of Austria’s wind
turbines in the remaining open land area are detected using Sentinel-2.

**License:** Copyright: © 2023 DHI A/S. The data is published under a Creative Commons 4.0
Attribution International license, CC BY 4.0


![DHI Logo](data/gtif/images/logos/dhi.png "DHI Logo")
