# Vessel Density based on Copernicus Sentinel-1

---
prepared by Alessandro Cimbelli within the upscaling part of the [RACE Challenges 2021](https://eo4society.esa.int/2021/08/01/rapid-action-on-coronavirus-and-eo-race-dashboard-challenge-3/).

This indicator is based on the detection of ships in the major EU ports. The detection uses data from the Copernicus Sentinel-1 satellites.

----

This vessel density indicator is computed based on Copernicus Sentinel-1 observations and complements the [EMODNET Vessel Density (all) [h/sqkm]](https://race.esa.int/?x=1040481.31544&y=5968190.74701&z=4.29471&poi=World-E13o&search=World%3A+Vessel+density+%28all%29+%5Bh%2Fsqkm%5D) indicator. 

The EMODnet Human Activities is based on [Automatic Identification System (AIS)](https://www.imo.org/en/OurWork/Safety/Pages/AIS.aspx) data, collected by coastal stations and satellites. The map download remains free for all users and includes the classification into 14 different ship categories. As of 2019, it results in EMODnet Human Activities' most downloaded product and its importance generally derives from the impossibility of freely obtain corrected and grouped AIS data. 

However, there are some limitations. The processing and dissemination of new density maps occurs after many months and refers only to European waters. In addition, no vector files are made available. 

Due to its systematic observation scenario, the constellation of Synthetic Aperture Radar (SAR) [Copernicus Sentinel-1](https://sentinels.copernicus.eu/web/sentinel/missions/sentinel-1) satellites provides the opportunity for more frequent observations. 

Furthermore, vessel detection is one of the primary applications of SAR systems. By measuring the roughness of the sea surface, resulting SAR images display features which stand out against the background - i.e. vessels appear as bright spots. For the indicator presented here, the extraction of every “big” object over the water surface has been implemented on the Euro Data Cube ([EDC](https://eurodatacube.com)) with the use of some python tools. 

In the Sentinel-1 images, it’s not possible to distinguish ships from other fixed structures, or even detect the type of vessel. Therefore, it is necessary to mask the images with polygons related to the coastline, including small islets and reefs, and areas related to fixed offshore infrastructures, such as wind farms or oil platforms.

The approach followed in the script to produce a vessel density map was to derive, for each 1 km2 pixel of the masked image of the selected area, an indicator given by the ratio:

density_vessels= 1000 * number_vessels / number_observations

where the number of observations corresponds to the intersection of all the satellite footprints of the selected month.

![](./eodash-data/stories/E1b-img1.png)
*Sentinel-1 based indicator*

![](./eodash-data/stories/E1b-img2.png)
*EMODnet indicator*

The main limitation depends on the number of satellite acquisitions (every 1-3 days) versus the frequency of AIS data update (every few minutes when moving). The comparison with the corresponding map provided by EMODnet was measured using the Structural Similarity Index (SSIM) of the python scikit-image library. The average value of the metric calculated from the monthly maps of 32 European ports and for the years 2020-2021 was 0.83.

## Reproduce this indicator

The computation of the indicator can be explored in this Jupyter Notebook available in the EDC Marketplace: 

- https://edc-jupyter.hub.eox.at/user/fd72d739-596f-4e72-a660-0d06045e4e26/lab/tree/Vessel_count_upscale.ipynb 

## Cite as

Alessandro Cimbelli, Vessel Density based on Copernicus Sentinel-1, developed for RACE Challenges March 2021, [https://race.esa.int/?indicator=E1b](https://race.esa.int/?indicator=E1b)
