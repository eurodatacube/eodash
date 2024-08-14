## Extreme air pollution episodes in Northern India and Pakistan in 2023

######  [This story is based on results from the [3RD EARTH SYSTEM SCIENCE CHALLENGE ]( https://sciencehub.esa.int/2024/05/09/3rd-earth-system-science-challenge/). The notebook can be acceed on [GitHub](https://raw.githubusercontent.com/eurodatacube/eodash-assets/hunga-tonga/stories/ScienceHub-Challenge-February-2024/3_OpenChallengeNotebook[RMSH]-[Challenge1]Sinnathamby_Kaminski_Zoghbi.ipynb).]

The research presented in this story was developed in the frame of the Earth System Science Challenge organised by the European Space Agency and hosted at ESRIN’s Science Hub in February 2024. The scope of this challenge was to identify the days on which severe air pollution episodes occured in northern India and Pakistan, using the percentile technique. To do this, they studied the evolution of carbon monoxide (CO) concentrations measured by TROPOMI, an atmospheric sounding instrument on board Copernicus Sentinel-5p, widely used to study air quality from space. 

The method was implemented on the [DeepESDL platform](https://earthsystemdatalab.net) by a team of PhD students from University of Edinburgh and University of Leeds. The data and code are made openly available.  

## Air Pollution and Health
Air pollution is a real concern for human health, as poor air quality may lead to breathing difficulties, cardiovascular disease, or cancer. According to the World Health Organization (WHO), "outdoor air pollution is estimated to have caused 4.2 million premature deaths worldwide in 2019". "Some 89% of those premature deaths occurred in low- and middle-income countries, and the greatest number in the WHO South-East Asia and Western Pacific Regions." (WHO 2024)

The region along the Himalayas in Northern India and Pakistan, also know as the Indo-Gangetic Plain (IGP), is a highly populated region of intense agricultural and industrial activities. The region frequently experiences severe air pollution episodes, putting the local population at risk, as documented and reported by the national and international press (Le Monde 2023), (India Today 2022). Understanding the formation of pollution episodes in this region is vital to help the government establish laws limiting pollutant emissions, and thus enable the local population to live in a healthy environment.

The following map shows the population density for 2020, provided by the Center for International Earth Science Information Network - CIESIN - Columbia University. Darker shades indicate higher density, with values ranging from 1-10.000 persons/km<sup>2</sup>.

## Population Density Map <!--{as="eox-map" style="width: 100%; height: 500px;" layers='[{"type":"Tile","properties":{"id":"Overlay labels"},"source":{"type":"XYZ","urls":["//s2maps-tiles.eu/wmts/1.0.0/overlay_base_bright_3857/default/g/{z}/{y}/{x}.jpg"]}},{"type":"Tile","properties":{"id":"population_density"},"source":{"type":"TileWMS","urls":["https://services.sentinel-hub.com/ogc/wms/0635c213-17a1-48ee-aef7-9d1731695a54"],"params":{"layers":"AWS_POPULATION_DENSITY","styles":"","format":"image/png","time":"2020-05-01"}}},{"type":"Tile","properties":{"id":"Terrain light"},"source":{"type":"XYZ","urls":["//s2maps-tiles.eu/wmts/1.0.0/terrain-light_3857/default/g/{z}/{y}/{x}.jpg"]}}]' zoom="5.199752548020474" center=[79.94493602969328,24.295288218801616] }-->
## StacInfo example <!--{as="eox-stacinfo" for="https://eurodatacube.github.io/eodash-catalog/trilateral/population_density/collection.json" featured='["description","providers","assets","links"]'  properties='["satellite","sensor","agency","extent"]' header='["title"]' tags='["tags"]' footer='["sci:citation"]' }-->


## Air Pollution from Space
Agencies such as ESA, NASA and JAXA have Earth-observing satellites whose instruments observe air pollutants around the world. Missions such as NASA's Aura Satellite carrying the [Ozone Monitoring Instrument (OMI)](https://www.earthdata.nasa.gov/learn/find-data/near-real-time/omi) or ESA's Sentinel-5p carrying the [TROPOspheric Monitoring Instrument (TROPOMI)](https://www.tropomi.eu/) provide essential data that is used to study the impact of air pollution on human health and agriculture.

Measurable air pollutants include: 

* **Particulate Matter (PM)**: Unhealthy particulate matter are suspended microscopic liquid or solid particles (such as dust or black carbon) in the atmosphere, with a diameter of less than 10 micrometers (able to pass through the throat and nose to enter the lungs). (ECMWF Air Pollution)
* **Nitrogen Dioxide (NO2)**: NO2 is produced by natural and anthropogenic sources. Globally, the main source of NO2 is fossil fuel combustion. Thus, coal- and gas-fired power plants and automobiles are the main sources.(NASA Air Pollution)
*  **Carbon Monoxide (CO)**: CO is a colorless, odorless gas that can be harmful when inhaled in large amounts. CO is released when something is burned. The greatest sources of CO to outdoor air are vehicles or machinery that burn fossil fuels (EPA 2024)
* **Ozone (O3)**: Breathing ground-level ozone can also result in a number of health effects. O3 also has a negative impact on plants, reducing crop yields. (EPA)
* **Sulfur Dioxide (So2)**: Sulfur dioxide (SO2) is a colorless, reactive air pollutant with a strong odor and is unhealthy to breathe. The main sources of SO2 emissions are from fossil fuel combustion and natural volcanic activity.


In this challenge, the authors aimed at studying the number of extreme air pollution episodes for the year of 2023 for one pollutant in 3 major cities of the IGP region in India. The pollutant studied was carbon monoxide (CO) measured by TROPOMI. The TROPOMI instrument onboard of Copernicus Sentinel-5P. has a global coverage of 1 day, which can help us to study the daily variation of CO anywhere on the globe. (TROPOMI.eu).

<img src="https://raw.githubusercontent.com/eurodatacube/eodash-assets/hunga-tonga/stories/ScienceHub-Challenge-February-2024/tropomi_above-earth.png" width="400">

TROPOMI Instrument. Source: ESA

## Data and Method
The study focuses on 3 densely populated cities in the region of interest: Lahore in Pakistan, New Delhi and Lucknow in India. The analysis was done for 2023, but the same study can be carried out for earlier years.

Carbon Monoxide (CO) is a trace gas, naturally present in the atmosphere and mainly emitted by incomplete combustion processes (anthropogenic activities such as heating, cooking, industrial activities or vegetation fires). This gas is often studied in the field of air quality, as it is a good tracer of pollution due to its long lifespan (from a few weeks to a few months, depending on the season and latitude), which enables it to be transported over long distances. 

After identifying the days on which there is a pollution episode, the study team choose one event to explain its formation and evolution over time, using:

1. **Data that identify sources of CO: Active Fires from VIIRS-SNPP**. 
The animation below shows the location of fires detected by Visible Infrared Imaging Radiometer Suite, or VIIRS during the month of October and November 2023 in the IGP. The VIIRS instrument flies on the Joint Polar Satellite System’s Suomi-NPP and NOAA-20 polar-orbiting satellites (NASA VIIRS). This imager has a spatial resolution of 375m and a swath width of 3000, which helps to monitor small fires around the world. This study used day and night time data, which allowed to show the location of fires detected by VIIRS during the month of October and November 2023 in the IGP. The number of fires increased  over this period, which could explain the rise of CO concentrations. 

We see that the number of fires increases over this period, explaining the observed rise of CO. The VIIRS Active Fires data has some limitations: it give only a hint on the fire location and not their lifetime and their size (i.e., a small temporary fire is counted in the same way as a large fire lasting over time), and is based on optical data which is affected by clouds.

<video width="400" autoplay>
  <source src="https://raw.githubusercontent.com/eurodatacube/eodash-assets/hunga-tonga/stories/ScienceHub-Challenge-February-2024/fires-animation.mp4" type="video/mp4">
</video>

Explore [MODIS active fire data on EO Dashboard over the IGP]( https://www.eodashboard.org/explore?indicator=Modis_SNPP_2023&x=8415682.56522&y=3510441.28382&z=4.93607).

2. **Meteorological data horizontal winds at 100m from the ERA5 reanalysis**  

This map shows the horizontal wind from ERA5 hourly data provided by the Copernicus Climate Change Service (C3S) Climate Data Store (CDS). (Hersbach 2023). Values range from [-4, 4] m/s. Blue shades indicate lower values. 

## New Delhi U Wind <!--{as="eox-map" style="width: 100%; height: 500px;" layers='[{"type":"Tile","properties":{"id":"Overlay labels"},"source":{"type":"XYZ","urls":["//s2maps-tiles.eu/wmts/1.0.0/overlay_base_bright_3857/default/g/{z}/{y}/{x}.jpg"]}},{"type":"Tile","properties":{"id":"wind_100m_u_newDeli-2023-11-10"},"opacity":0.77,"source":{"type":"TileWMS","urls":["https://services.sentinel-hub.com/ogc/wms/0635c213-17a1-48ee-aef7-9d1731695a54"],"params":{"layers":"VIS_ERA5_SINGLELEVEL_WIND_U_100M","styles":"","format":"image/png","time":"2023-11-10"}}},{"type":"Tile","properties":{"id":"OSM Background"},"source":{"type":"XYZ","urls":["//s2maps-tiles.eu/wmts/1.0.0/osm_3857/default/g/{z}/{y}/{x}.jpg"]}}]' zoom="6.509882184402946" center=[76.9845663060298,28.234047216613092] }-->
## StacInfo example <!--{as="eox-stacinfo" for="https://eurodatacube.github.io/eodash-catalog/trilateral/wind_100m_u_newDeli/collection.json" featured='["description","providers","assets","links"]'  properties='["satellite","sensor","agency","extent"]' header='["title"]' tags='["tags"]' footer='["sci:citation"]' }-->

##
For each city a rectangle of -0.4 to 0.4° of longitude and -0.4 to 0.4° latitude was generated (from the given coordinates of the chosen city in latitude and longitude) which corresponds to -39.8 to 39.8km in longitude and to -44.5 to 44.5km in latitude. Then the computed time series of each day is the average value of all CO concentration values measured by TROPOMI within that rectangle (with a resolution of 0.025°). The percentile method is a strategy utilized to recognize outliers or extreme values based upon a defined percent limit. It involves calculating the threshold values based on percentiles and the steps are to first determine the percentage threshold (in this case 90%, 95%, and 99%), then calculate the threshold values, and then identify outliers and extreme values above this threshold.

### Daily CO variation in 2023

The following figures display the time series of daily concentration of CO in Lahore, New Delhi and Lucknow. In each of the figures, the yellow line indicates the 90% percentile extreme, the blue one, the 95% percentile extreme, and the green one, the 99% percentile extreme. The points above these lines are the extreme events resulted form the percentile technique.  What can be noticed here is that the extreme events seem to happen at the same time for the 3 cities especially for 99% percentile extremes (at the end of October-November). 

Furthermore, when these extreme episodes were quantified, the number of days which are considered extremes were almost the same for the 3 cities so there might be a correlation between the extreme pollution events in the 3 cities. We must note that the total number of days in 2023 is not 365 since for some days we do not have measurements because of clouds or other factors.

| City       | Total Number of Days in 2023 | Number of Days ≥ 90% | Number of Days ≥ 95% | Number of Days ≥ 99% |
|------------|-----------------------------|----------------------|----------------------|----------------------|
| Lahore     | 341                         | 34                   | 17                   | 4                    |
| New Delhi  | 341                         | 34                   | 17                   | 4                    |
| Lucknow    | 346                         | 35                   | 18                   | 4                    |


## CO Map Tour <!--{ as="eox-map" mode="tour" }-->

### <!--{ layers='[{"type":"Tile","properties":{"id":"Overlay labels"},"source":{"type":"XYZ","urls":["//s2maps-tiles.eu/wmts/1.0.0/overlay_base_bright_3857/default/g/{z}/{y}/{x}.jpg"]}},{"type":"Tile","properties":{"id":"CO_3_daily-2023-11-08"},"source":{"type":"TileWMS","urls":["https://services.sentinel-hub.com/ogc/wms/0635c213-17a1-48ee-aef7-9d1731695a54"],"params":{"layers":"AWS_VIS_CO_3DAILY_DATA","styles":"","format":"image/png","time":"2023-11-08"}}},{"type":"Tile","properties":{"id":"OSM Background"},"source":{"type":"XYZ","urls":["//s2maps-tiles.eu/wmts/1.0.0/osm_3857/default/g/{z}/{y}/{x}.jpg"]}}]' zoom="9.879889469918195" center=[74.28590944565705,31.547289411942756] animationOptions={duration:500}}-->
#### Lahore 
* **Map**: CO concentration measured on 2023-11-09
* **Chart**: CO daily variation for 2023

<img src="https://raw.githubusercontent.com/eurodatacube/eodash-assets/hunga-tonga/stories/ScienceHub-Challenge-February-2024/Lahore.png">


A first sharp increase in carbon monoxide concentration can be observed at the end of October.  The emissions seem to be spontaneous, suggesting they can be linked to unusual antropogenic activities or vegetation fires.

A second peak in CO was detected in Lahore on 11/07. This can be explained by the fact that wind speed was very low in the city and the region of the fires: CO then accumulated again, further increasing the CO concentration, which was already high due to the accumulation around 10/30; ​


### <!--{ layers='[{"type":"Tile","properties":{"id":"Overlay labels"},"source":{"type":"XYZ","urls":["//s2maps-tiles.eu/wmts/1.0.0/overlay_base_bright_3857/default/g/{z}/{y}/{x}.jpg"]}},{"type":"Tile","properties":{"id":"CO_3_daily-2023-11-08"},"source":{"type":"TileWMS","urls":["https://services.sentinel-hub.com/ogc/wms/0635c213-17a1-48ee-aef7-9d1731695a54"],"params":{"layers":"AWS_VIS_CO_3DAILY_DATA","styles":"","format":"image/png","time":"2023-11-08"}}},{"type":"Tile","properties":{"id":"OSM Background"},"source":{"type":"XYZ","urls":["//s2maps-tiles.eu/wmts/1.0.0/osm_3857/default/g/{z}/{y}/{x}.jpg"]}}]' zoom="8.947606701979296" center=[77.13217840767383,28.560811023321136] animationOptions={duration:500}}-->
#### New Delhi
* **Map**: CO concentration measured on 2023-11-08
* **Chart**: CO daily variation for 2023

Similar to Lahore, the peak observed in New Delhi on 11/04 indicates spontaneous emissions, potentially from fires. Once CO had accumulated, the wind generally blew towards the southeast from where the fires were detected. Being the closest city to the fires (in the southeast direction), New Delhi experiences the first peak in CO concentration.

<img src="https://raw.githubusercontent.com/eurodatacube/eodash-assets/hunga-tonga/stories/ScienceHub-Challenge-February-2024/NewDelhi.png">

### <!--{ layers='[{"type":"Tile","properties":{"id":"Overlay labels"},"source":{"type":"XYZ","urls":["//s2maps-tiles.eu/wmts/1.0.0/overlay_base_bright_3857/default/g/{z}/{y}/{x}.jpg"]}},{"type":"Tile","properties":{"id":"CO_3_daily-2023-11-10"},"source":{"type":"TileWMS","urls":["https://services.sentinel-hub.com/ogc/wms/0635c213-17a1-48ee-aef7-9d1731695a54"],"params":{"layers":"AWS_VIS_CO_3DAILY_DATA","styles":"","format":"image/png","time":"2023-11-10"}}},{"type":"Tile","properties":{"id":"OSM Background"},"source":{"type":"XYZ","urls":["//s2maps-tiles.eu/wmts/1.0.0/osm_3857/default/g/{z}/{y}/{x}.jpg"]}}]' zoom="9.410109959839149" center=[80.84415782159175,26.927303711507136] animationOptions={duration:500}}-->
#### Lucknow
* **Map**: CO concentration measured on 2023-11-10
* **Chart**: CO daily variation for 2023

The last peak in CO was detected in Lucknow. This city is far from the region where agricultural waste was burned, yet it is impacted by these episodes of extreme pollution. So, the presence of fires may not be the only contributor to this pollution event, another parameter must be taken into account, especially local meteorology. 

<img src="https://raw.githubusercontent.com/eurodatacube/eodash-assets/hunga-tonga/stories/ScienceHub-Challenge-February-2024/Lucknow.png">

###
#### Why Lucknow, which is quite a distance from the fires detected by VIIRS, is experiencing high concentrations of CO, like those detected in New Delhi or Lahore?

Hypothesising that the high concentrations could be explained by the transport by the winds, the team looked at meteorological data. To this end they used use ERA5 reanalyses. By averaging the horizontal winds at 100m for each day, at UTC+05, it was possible to analize the evolution of wind direction and speed from October 25th to November 14th. 

<video width="400" autoplay>
  <source src="https://raw.githubusercontent.com/eurodatacube/eodash-assets/hunga-tonga/stories/ScienceHub-Challenge-February-2024/winds.mp4" type="video/mp4">
</video>

Video: ERA5 reanalyses, averaged horizontal winds at 100m for each day, at UTC+05. The animation shows the evolution of wind direction and speed from October 25th to November 14th. 

In general, wind speed was low during this period. However, it was also noticed a change in wind direction around October 30th: the wind, which was blowing towards the southeast, shifted towards the west around this date. As a result, CO, being trapped against the Pakistani terrain and the Himalayas, accumulated, thus explaining the high levels of CO shown in the time series.



## Conclusions
* Severe air pollution episodes can be monitored with satellite observations.
* Using multiple variables (fires and winds) can help us to describe the formation and the evolution of a severe air pollution episode.
* IGP experienced extreme CO pollution episodes in October/November 2023 due to the burning of agricultural waste by farmers but also due to stable meteorological conditions (low wind speed), favoring its accumulation along the Himalayas.

### Open Science 

The analysis was carried out on the [ESA DeepESDL (Deep Earth System Data Lab)](https://earthsystemdatalab.net ). For research purposes, ESA is offering this resources under a sponsorship scheme through the Network of Resources.
* [DeepESDL website](https://earthsystemdatalab.net)  
* [Network of Resources website](https://nor-discover.org/en/portfolio/)
* [Apply for sponsorsed access to DeepESDL](https://portfolio.nor-discover.org/?textSearch=DeepESDL)
* [ERA5 Dataset]()
* [Jupyter Notebook](https://github.com/eurodatacube/eodash-assets/blob/hunga-tonga/stories/ScienceHub-Challenge-February-2024/hunga-tonga/5_OpenChallengeNotebook-Hunga-Ch3_Duchamp_Barton_Baldazo.ipynb)


### References 
1. World Health Organization. (n.d.). Ambient (outdoor) air quality and health. [WHO 2024](https://www.who.int/news-room/fact-sheets/detail/ambient-(outdoor)-air-quality-and-health). Accessed February 29, 2024.
2. Le Monde, Carole Dieterich, 2023, November 18 [New Delhi's air pollution crisis is poisoning millions of children every winter](https://www.lemonde.fr/en/environment/article/2023/11/18/new-delhi-s-air-pollution-crisis-is-poisoning-millions-of-children-every-winter_6265386_114.html)
3. India Today, Kumar Kunal.  2022, June 3, [Delhi's new normal: Air pollution not just in winter. India Today]( https://www.indiatoday.in/diu/story/delhi-new-normal-air-pollution-not-just-in-winter-1958072-2022-06-03)
4. [NASA Air Pollution](https://airquality.gsfc.nasa.gov/) 
5. [EPA O3 2024](https://www.epa.gov/ozone-pollution-and-your-patients-health/health-effects-ozone-general-population)
6. [EPA CO 2024](https://www.epa.gov/co-pollution/basic-information-about-carbon-monoxide-co-outdoor-air-pollution)
7. [ECMWF Air Pollution](https://stories.ecmwf.int/tracking-air-pollution/index.html)
8. [Copernicus Sentinel-5p]( https://sentinel.esa.int/web/sentinel/copernicus/sentinel-5p)
9. [TROPOMI.eu](https://www.tropomi.eu/data-products/carbon-monoxide)
10. [NASA VIIRS](https://www.earthdata.nasa.gov/sensors/viirs)
11. Hersbach, H., Bell, B., Berrisford, P., Biavati, G., Horányi, A., Muñoz Sabater, J., Nicolas, J., Peubey, C., Radu, R., Rozum, I., Schepers, D., Simmons, A., Soci, C., Dee, D., Thépaut, J-N. (2023): ERA5 hourly data on single levels from 1940 to present. Copernicus Climate Change Service (C3S) Climate Data Store (CDS) (Accessed on 02-M07-2024)




