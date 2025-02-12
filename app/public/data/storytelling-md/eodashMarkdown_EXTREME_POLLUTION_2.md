# Extreme air pollution episodes in Northern India and Pakistan in 2023

###### *This story is based on results from the [3<sup>rd</sup> Earth System Science Challenge]( https://sciencehub.esa.int/2024/05/09/3rd-earth-system-science-challenge/) organised and hosted by ESA's ESRIN Science Hub in February 2024*

The research presented in this story was developed in the frame of the [Earth System Science Challenge](https://sciencehub.esa.int/2024/05/09/3rd-earth-system-science-challenge/) organized by the European Space Agency (ESA) and hosted at ESRIN’s Science Hub in February 2024. The scope of this challenge was to identify the days on which severe air pollution episodes occurred in northern India and Pakistan, using the percentile technique applied on time series of carbon monoxide (CO) concentrations measured by Copernicus Sentinel-5P TROPOMI. The method was implemented on the [DeepESDL platform](https://earthsystemdatalab.net) by a team of PhD students from Sorbonne Université. The data and code are made openly available.

## Air Pollution and Health
Air pollution is a real concern for human health, as poor air quality may lead to breathing difficulties, cardiovascular disease, or cancer. According to the World Health Organization (WHO), "outdoor air pollution is estimated to have caused 4.2 million premature deaths worldwide in 2019". "Some 89% of those premature deaths occurred in low- and middle-income countries, and the greatest number in the WHO South-East Asia and Western Pacific Regions." [WHO, 2024]

The region along the Himalayas, encompassing Pakistan, Northern India and Bangladesh, also known as the Indo-Gangetic Plain (IGP), is a highly populated region of intense agricultural and industrial activities. The IGP frequently experiences severe air pollution episodes, putting the local population at risk, as documented and reported by the national and international press [India Today, 2022; Le Monde, 2023]. Understanding the formation of air pollution episodes in this region is vital to help the government establish laws mitigating pollutant emissions, and thus enable the local population to live in a healthy environment.

The following map shows the population density for 2020, provided by the Center for International Earth Science Information Network - CIESIN - Columbia University. Darker shades indicate higher density, with values ranging from 1-10.000 persons
/km<sup>2</sup>.

## <!--{as="eox-map" style="width: 100%; height: 500px;" layers='[{"type":"Tile","properties":{"id":"Overlay labels"},"source":{"type":"XYZ","urls":["//s2maps-tiles.eu/wmts/1.0.0/overlay_base_bright_3857/default/g/{z}/{y}/{x}.jpg"]}},{"type":"Tile","properties":{"id":"population_density"},"source":{"type":"TileWMS","urls":["https://services.sentinel-hub.com/ogc/wms/0635c213-17a1-48ee-aef7-9d1731695a54"],"params":{"layers":"AWS_POPULATION_DENSITY","styles":"","format":"image/png","time":"2020-05-01"}}},{"type":"Tile","properties":{"id":"Terrain light"},"source":{"type":"XYZ","urls":["//s2maps-tiles.eu/wmts/1.0.0/terrain-light_3857/default/g/{z}/{y}/{x}.jpg"]}}]' zoom="5.199752548020474" center=[79.94493602969328,24.295288218801616] }-->
## <!--{as="eox-stacinfo" for="https://eurodatacube.github.io/eodash-catalog/trilateral/population_density/collection.json" featured='["description","providers","assets","links"]'  properties='["satellite","sensor","agency","extent"]' header='["title"]' tags='["tags"]' footer='["sci:citation"]' }-->


## Earth Observations for air quality monitoring 
Agencies such as ESA, NASA and JAXA have Earth observation satellites with instruments dedicated for monitoring atmospheric chemistry. Satellite missions such as NASA's Aura, carrying the [Ozone Monitoring Instrument (OMI)](https://www.earthdata.nasa.gov/learn/find-data/near-real-time/omi), or ESA's Sentinel-5P, equipped of the [TROPOspheric Monitoring Instrument (TROPOMI)](https://www.tropomi.eu/) provide essential data used to study the impact of air pollution on human health and agriculture.

Space instruments can numerous measure gaseous pollutants, such as : 

* **Nitrogen Dioxide (NO2 )** : NO2 is emitted during combustion processes. While it can be produced naturally in lesser quantities, by lightning for instance, its main sources are mainly anthropogenic, such as gas-fired power plants and automobiles [NASA Air Pollution].
* **Carbon Monoxide (CO)** : CO is a colorless and odorless gas that can be harmful when inhaled in large quantities. It is released during incomplete combustion processes, with the largest sources in outdoor air being any anthropogenic activities that burn fossil fuel (thermal vehicles, industries, coal mines …) as well as biomass burning [UCAR Air Quality, CO]. 
* **Ozone (O3)** : At Earth’ surface, O3 is a short-time pollutant that has a negative impact on human health and vegetation. It does not have direct emission sources :  it is formed by the interaction of sunlight with volatile organic compounds (VOCs), including methane, and nitrogen oxides (NOx), such as NO₂ [UCAR Air Quality, O3].
* **Sulfur Dioxide (SO₂)** : SO₂ is a reactive pollutant with a strong odor that affects the respiratory system, impairs lung function, and causes eye irritation. It is primarily emitted from fossil fuel combustion at the surface level [UCAR Air Quality, sulfur oxides]. 

Some of these gaseous pollutants (NO₂, SO₂) are precursors of Particulate Matter (PM). PM are aerosols, which are defined as suspended microscopic liquid or solid particles (such as dust or black carbon) in the atmosphere with a diameter of less than 10 micrometers. The smaller the size of particulate matter, the more hazardous it is to human health, as it can more easily become lodged in the lungs, for instance [US EPA]. Instruments like MODIS, onboard NASA’s Terra and Aqua satellites and TROPOMI can measure the optical properties of aerosols, from which we can derive information about their size and general composition (Aerosols Optical Depth and Aerosol Index).


## Method and datasets
In this challenge, the authors aimed at determining the number of extreme CO pollution episodes for 2023 in 3 major cities in the IGP region (Lahore in Pakistan, New Delhi and Lucknow in India). 
CO is a trace gas that is often studied in the field of air quality, as it is a good tracer of pollution due to its long lifespan (from a few weeks to a few months, depending on the season and latitude), which enables it to be transported over long distances. CO is mainly emitted during incomplete combustion processes (anthropogenic activities such as heating, cooking, industrial activities and vegetation fires). 
CO concentrations are retrieved from TROPOMI (Sentinel-5P) measurements. With its swath width of ~2600 km and a global coverage of 1 day, TROPOMI is a valuable instrument for daily monitoring of CO worldwide [TROPOMI.eu].


<center>
<img src="https://raw.githubusercontent.com/eurodatacube/eodash-assets/main/stories/ScienceHub-Challenge-February-2024/AirPollutionIndia/tropomi_above-earth.png" width="400">

<span style="font-size:15px;">TROPOMI Instrument. Source: ESA</span>
</center>

To determine the number of extreme pollution episodes experienced by the IGP during 2023, the team used the percentile method, which was applied to the daily time series of CO concentrations, which were calculated within a rectangular area of 0.8° in both longitude and latitude (~80 km x 90 km) around each of the three cities of interest.
The percentile method is a technique used to identify outliers or extreme values by setting a specific percentile threshold. The process involves several steps: first, defining the percentile thresholds (such as 90%, 95%, and 99%); then calculating the corresponding threshold values; and finally, identifying any values that exceed these thresholds as outliers or extreme values.

After identifying the days of extreme CO pollution, the study team selected a pollution event that occurred at the very end of October 2023 and evolved during November.  

<center>
<video width="50%" autoplay>
  <source src="https://raw.githubusercontent.com/eurodatacube/eodash-assets/main/stories/ScienceHub-Challenge-February-2024/AirPollutionIndia/vid%C3%A9os%20ESA%20CO%20bis.mp4" type="video/mp4">
</video>

stories/ScienceHub-Challenge-February-2024/AirPollutionIndia/vidéos ESA CO bis.mp4

<span style="font-size:15px;">CO data on EO Dashboard</span>
</center>


They tried to understand the formation of this extreme air pollution episode and to analyze its evolution over time. Several datasets were used for this study, such as :
* **Active Fires from Visible Infrared Imaging Radiometer Suite (VIIRS)**, embarked on NASA’s Suomi-NPP satellite. One of VIIRS's main missions is to monitor fires from space. Indeed, With its spatial resolution of 375m and swath width of ~3000 km, VIIRS can detect small fires worldwide. Suomi-NPP passes twice a day at 01:30 a.m. (nighttime) and 01:30 p.m. (daytime). Daytime and nighttime VIIRS data were used here to locate the fires near in the IGP region, from October to November 2023.  

From the animation below, VIIRS detected numerous fire spots in an area located close to Lahore and New Delhi. We note that the number of fires detected increased at the very end of October 2023, explaining the observed rise of CO concentrations in the IGP region. 


<center>
<video width="50%" autoplay>
  <source src="https://raw.githubusercontent.com/eurodatacube/eodash-assets/main/stories/ScienceHub-Challenge-February-2024/AirPollutionIndia/fires-animation.mp4" type="video/mp4">
</video>

<span style="font-size:15px;">Location of fires detected by Visible Infrared Imaging Radiometer Suite, or VIIRS during the month of October and November 2023 in the IGP</span>
</center>


Indeed, local farmers have been known to burn agricultural waste at this time of year, as an economical and quicker way of getting rid of waste and thus preparing for the next crop [Sembhi et al. 2020]. 
However, the VIIRS Active Fires data has some limitations: it only gives us a hint on the fire location and not their lifetime and their size (i.e., a small temporary fire is counted in the same way as a large fire lasting over time). Moreover, because of VIIRS’ optical properties, fires can be missed in the presence of clouds or smoke. 


* **Horizontal wind speed and direction at 100m from ERA5 reanalysis, provided by the Copernicus Climate Change Service (C3S)**. Analyzing surface winds is essential for understanding CO transport during the pollution episode. For this study, daily averages of the horizontal winds were calculated in the Pakistan timezone (UTC+05).

  <center>
<video width="50%" autoplay>
  <source src="https://raw.githubusercontent.com/eurodatacube/eodash-assets/main/stories/ScienceHub-Challenge-February-2024/AirPollutionIndia/winds.mp4" type="video/mp4">
</video>

<span style="font-size:15px;">Evolution of horizontal winds at 100m from mid-October to mid-November 2023 </span>
</center>



In this animation, we can see that winds are weak during this period. We note a change in wind direction which occurred around October 30: winds shifted from south-easterly to westerly. Later, the winds shifted back to south-easterly (around November 4th). 
##
For each city a rectangle of -0.4 to 0.4° of longitude and -0.4 to 0.4° latitude was generated (from the given coordinates of the chosen city in latitude and longitude) which corresponds to -39.8 to 39.8km in longitude and to -44.5 to 44.5km in latitude. Then the computed time series of each day is the average value of all CO concentration values measured by TROPOMI within that rectangle (with a resolution of 0.025°). The percentile method is a strategy utilized to recognize outliers or extreme values based upon a defined percent limit. It involves calculating the threshold values based on percentiles and the steps are to first determine the percentage threshold (in this case 90%, 95%, and 99%), then calculate the threshold values, and then identify outliers and extreme values above this threshold.

### Evolution of daily CO concentrations in 2023 in the IGP region 

The following figures show the daily time series of CO concentrations in Lahore, New Delhi, and Lucknow. In each figure, the yellow line represents the 90th percentile threshold, the blue line indicates the 95th percentile threshold, and the green, the 99th percentile threshold. Any data points above these lines are considered extreme events, as identified by the percentile method. Notably, these extreme events appear to occur simultaneously across all three cities, particularly for the 99th percentile threshold, during the period from late October to November.
We can also observe that the number of days with extreme CO pollution was nearly the same for all three cities, indicating a potential common source of CO in these areas. It is important to note that the total number of days in 2023 for which we have a CO concentration value is not 365, as some measurements from TROPOMI were unavailable due to the presence of clouds.


| City       | Number of measurement days | Number of Days ≥ 90% | Number of Days ≥ 95% | Number of Days ≥ 99% |
|------------|-----------------------------|----------------------|----------------------|----------------------|
| Lahore     | 341                         | 34                   | 17                   | 4                    |
| New Delhi  | 341                         | 34                   | 17                   | 4                    |
| Lucknow    | 346                         | 35                   | 18                   | 4                    |

<span style="font-size:15px;">The table indicates the number of days which can be considered as extremes (for 90%, 95%, and 99%). We notice that these number of days are almost the same for the 3 cities, indicating a potential correlation between the extreme pollution events in the 3 cities. Note that the total number of days in 2023 is not 365 since for some days we do not have measurements because of clouds or other factors.</span>

##  Daily CO concentrations  <!--{ as="eox-map" mode="tour" }-->

###  <!--{ layers='[{"type":"Tile","properties":{"id":"Overlay labels"},"source":{"type":"XYZ","urls":["//s2maps-tiles.eu/wmts/1.0.0/overlay_base_bright_3857/default/g/{z}/{y}/{x}.jpg"]}},{"type":"Tile","properties":{"id":"CO_3_daily-2023-11-08"},"source":{"type":"TileWMS","urls":["https://services.sentinel-hub.com/ogc/wms/0635c213-17a1-48ee-aef7-9d1731695a54"],"params":{"layers":"AWS_VIS_CO_3DAILY_DATA","styles":"","format":"image/png","time":"2023-11-08"}}},{"type":"Tile","properties":{"id":"OSM Background"},"source":{"type":"XYZ","urls":["//s2maps-tiles.eu/wmts/1.0.0/osm_3857/default/g/{z}/{y}/{x}.jpg"]}}]' zoom="9.879889469918195" center=[74.28590944565705,31.547289411942756] animationOptions={duration:500}}-->
#### Evolution of daily CO concentrations in Lahore, 2023 
* **Map**: Daily timeseries of CO concentration in Lahore in 2023  [[view full time series](https://www.eodashboard.org/explore?indicator=N1_CO&x=0&y=-1224599.44035&z=2.35425)]
* **Chart**: Daily timeseries of CO concentration in Lahore in 2023 

<center>
<img src="https://raw.githubusercontent.com/eurodatacube/eodash-assets/main/stories/ScienceHub-Challenge-February-2024/AirPollutionIndia/Lahore.png" width="400">
	
<span style="font-size:15px;">CO daily variation in 2023 for Lahore</span>
</center>

A sharp increase in CO concentrations was first observed at the end of October 2023 in Lahore. The sudden rise in CO concentrations around October 30th is explained by agricultural waste burning practiced in the region which is very close to Lahore, as we can see on the animation of Active Fires data from VIIRS. Furthermore, weak winds at the very end of October (see animation of wind speed and direction from ERA5 reanalysis) and the high mountainous terrain surrounding the IGP (the Hindu Kush, to the west and the Himalayas, to the North) helped to contain CO in the region, thus explaining the high CO concentrations detected by TROPOMI. 
A second peak in CO concentrations was detected in Lahore on November 7th. This is attributed to the low wind speeds in the city and the surrounding fire-affected regions, causing CO to accumulate further. This accumulation led to a rise in CO levels, which were already elevated due to the earlier buildup around October 30th; ​


### <!--{ layers='[{"type":"Tile","properties":{"id":"Overlay labels"},"source":{"type":"XYZ","urls":["//s2maps-tiles.eu/wmts/1.0.0/overlay_base_bright_3857/default/g/{z}/{y}/{x}.jpg"]}},{"type":"Tile","properties":{"id":"CO_3_daily-2023-11-08"},"source":{"type":"TileWMS","urls":["https://services.sentinel-hub.com/ogc/wms/0635c213-17a1-48ee-aef7-9d1731695a54"],"params":{"layers":"AWS_VIS_CO_3DAILY_DATA","styles":"","format":"image/png","time":"2023-11-08"}}},{"type":"Tile","properties":{"id":"OSM Background"},"source":{"type":"XYZ","urls":["//s2maps-tiles.eu/wmts/1.0.0/osm_3857/default/g/{z}/{y}/{x}.jpg"]}}]' zoom="8.947606701979296" center=[77.13217840767383,28.560811023321136] animationOptions={duration:500}}-->
#### Evolution of daily CO concentrations in New Delhi, 2023
* **Map**: Daily timeseries of CO concentration in New Delhi in 2023  [[view full time series](https://www.eodashboard.org/explore?indicator=N1_CO&x=0&y=-1224599.44035&z=2.35425)]
* **Chart**: Daily timeseries of CO concentration in New Delhi in 2023

The CO peak observed in New Delhi on November 4th is explained by the sudden CO emissions from fires set to burn crop residues, but also by the winds. Indeed, once the CO accumulated around October 30th due to weak winds in IGP, high levels of CO were then transported along the Himalayas as winds generally blew southeastward from the area where the fires were detected by VIIRS, around November 3rd. As the closest city to the fires in this direction, New Delhi is the first city in India (among the cities of interest) to experience the extreme CO pollution in 2023. 
<center>
<img src="https://raw.githubusercontent.com/eurodatacube/eodash-assets/main/stories/ScienceHub-Challenge-February-2024/AirPollutionIndia/NewDelhi.png" width="400">
	
<span style="font-size:15px;">CO daily variation in 2023 for New Delhi</span>
</center>

### <!--{ layers='[{"type":"Tile","properties":{"id":"Overlay labels"},"source":{"type":"XYZ","urls":["//s2maps-tiles.eu/wmts/1.0.0/overlay_base_bright_3857/default/g/{z}/{y}/{x}.jpg"]}},{"type":"Tile","properties":{"id":"CO_3_daily-2023-11-10"},"source":{"type":"TileWMS","urls":["https://services.sentinel-hub.com/ogc/wms/0635c213-17a1-48ee-aef7-9d1731695a54"],"params":{"layers":"AWS_VIS_CO_3DAILY_DATA","styles":"","format":"image/png","time":"2023-11-10"}}},{"type":"Tile","properties":{"id":"OSM Background"},"source":{"type":"XYZ","urls":["//s2maps-tiles.eu/wmts/1.0.0/osm_3857/default/g/{z}/{y}/{x}.jpg"]}}]' zoom="9.410109959839149" center=[80.84415782159175,26.927303711507136] animationOptions={duration:500}}-->
#### Evolution of daily CO concentrations in Lucknow, 2023
* **Map**: Daily timeseries of CO concentration in Lucknow in 2023  [[view full time series](https://www.eodashboard.org/explore?indicator=N1_CO&x=0&y=-1224599.44035&z=2.35425)]
* **Chart**: : Daily timeseries of CO concentration in Lucknow in 2023 

Even though Lucknow is the farthest city from the region where agricultural waste is burned, it also experienced high levels of CO at the beginning of November 2023. This is mainly explained by the wind direction and speed. From the end of October to the beginning of November, wind speed was low, which favored the buildup of CO in the region. When the winds blew again towards the southeast, the accumulated CO was transported to the east of the IGP, which explains the high CO concentrations detected in Lucknow around November 10th.

<center>
<img src="https://raw.githubusercontent.com/eurodatacube/eodash-assets/main/stories/ScienceHub-Challenge-February-2024/AirPollutionIndia/Lucknow.png" width="400">
	
<span style="font-size:15px;">CO daily variation in 2023 for Lucknow</span>
</center>

###
#### Why Lucknow, which is quite a distance from the fires detected by VIIRS, is experiencing high concentrations of CO, like those detected in New Delhi or Lahore?

Hypothesising that the high concentrations could be explained by the transport by the winds, the team looked at meteorological data. To this end they used use ERA5 reanalyses. By averaging the horizontal winds at 100m for each day, at UTC+05, it was possible to analize the evolution of wind direction and speed from October 25th to November 14th. 
<center>
<video width="400" autoplay>
  <source src="https://raw.githubusercontent.com/eurodatacube/eodash-assets/main/stories/ScienceHub-Challenge-February-2024/AirPollutionIndia/winds.mp4" type="video/mp4">
</video>

<span style="font-size:15px;">Video: ERA5 reanalyses, averaged horizontal winds at 100m for each day, at UTC+05. The animation shows the evolution of wind direction and speed from October 25th to November 14th.</span>
</center>

In general, wind speed was low during this period. However, it was also noticed a change in wind direction around October 30th: the wind, which was blowing towards the southeast, shifted towards the west around this date. As a result, CO, being trapped against the Pakistani terrain and the Himalayas, accumulated, thus explaining the high levels of CO shown in the time series.



## Conclusion
* This study demonstrates the potential of using data from satellite instruments and reanalysis combined to understand the formation and progression of severe air pollution episodes in the Indo-Gangetic Plain. Indeed, using multiple datasets, such as CO concentration, fire location and wind speed and direction can help us to describe the formation and the evolution of a severe air pollution episode.
* IGP experienced extreme CO pollution episodes in October/November 2023 due to the burning of agricultural waste by farmers but also due to stable meteorological conditions (low wind speed), favoring its accumulation along the Himalayas.
* Limits and perspectives of the study:
	* Explaining pollution episodes can be complex as they depend on multiple factors (atmospheric chemistry, local meteorology, and local emissions). Therefore, it is necessary to work with various instruments, including those from space. However, space instruments may struggle to detect gases due to clouds or smoke emitted by fires, for example. As a result, there were many days in the time series where there were no CO concentrations. For this reason, pollution episodes for certain days may have been missed. To address this issue, it is important to work with local measurements from air quality stations.
	* The IGP is a highly polluted region characterized by mixtures of gaseous pollutants and aerosols (such as fine particles, known as PM2.5). CO is one among many pollutants emitted during vegetation fires. In the case of the November 2023 air pollution episode, it was interesting to study this molecule, as the cause of this smog was agricultural waste burning. However, for other pollution episodes (such as those occurring in summer), it might be more interesting to study tropospheric ozone, as it is predominantly produced under strong sunlight conditions. 



## Open Science 

The analysis was carried out on the [ESA DeepESDL (Deep Earth System Data Lab)](https://earthsystemdatalab.net ). For research purposes, ESA is offering this resources under a sponsorship scheme through the Network of Resources.
* [DeepESDL website](https://earthsystemdatalab.net)  
* [Network of Resources website](https://nor-discover.org/en/portfolio/)
* [Apply for sponsorsed access to DeepESDL](https://portfolio.nor-discover.org/?textSearch=DeepESDL)
* [ERA5 Dataset](https://cds.climate.copernicus.eu/cdsapp#!/dataset/reanalysis-era5-land?tab=form 
)
* [Sentinel-5p TROPOMI CO Dataset](https://radiantearth.github.io/stac-browser/#/external/eurodatacube.github.io/eodash-catalog/trilateral/CO_3_daily/CO_3_daily/collection.json)
* [VIIRS Active Fire Dataset](https://firms.modaps.eosdis.nasa.gov/download/)
* [Jupyter Notebook](https://github.com/eurodatacube/eodash-assets/blob/main/stories/ScienceHub-Challenge-February-2024/AirPollutionIndia/3_OpenChallengeNotebook%5BRMSH%5D-%5BChallenge1%5DSinnathamby_Kaminski_Zoghbi.ipynb#:~:text=AirPollutionIndia-,3_OpenChallengeNotebook,-%5BRMSH%5D%2D%5BChallenge1%5DSinnathamby_Kaminski_Zoghbi)


### References 
1.  World Health Organization. (n.d.). Ambient (outdoor) air quality and health. [WHO 2024](https://www.who.int/news-room/fact-sheets/detail/ambient-(outdoor)-air-quality-and-health). Accessed February 29, 2024.
2.  India Today, Kumar Kunal.  2022, June 3, [Delhi's new normal: Air pollution not just in winter. India Today]( https://www.indiatoday.in/diu/story/delhi-new-normal-air-pollution-not-just-in-winter-1958072-2022-06-03)
3.  Le Monde, Carole Dieterich, 2023, November 18 [New Delhi's air pollution crisis is poisoning millions of children every winter](https://www.lemonde.fr/en/environment/article/2023/11/18/new-delhi-s-air-pollution-crisis-is-poisoning-millions-of-children-every-winter_6265386_114.html)
4.  [NASA Air Pollution](https://airquality.gsfc.nasa.gov/)
5.  [UCAR Air Quality (CO)](https://scied.ucar.edu/learning-zone/air-quality/carbon-monoxide)
6.  [UCAR Air Quality (O3)](https://scied.ucar.edu/learning-zone/air-quality/ozone)
7.  [UCAR Air Quality (sulfur oxides)](https://scied.ucar.edu/learning-zone/air-quality/sulfur-oxides)
8.  [US EPA Particulate Matter](https://www.epa.gov/pm-pollution/particulate-matter-pm-basics)
9.  [Copernicus Sentinel-5p](https://sentinel.esa.int/web/sentinel/copernicus/sentinel-5p)
10. [TROPOMI CO Total Column](https://www.tropomi.eu/data-products/carbon-monoxide)
11. [NASA VIIRS](https://www.earthdata.nasa.gov/data/instruments/viirs)
12. MODIS Fire Detections
13. Hersbach, H., Bell, B., Berrisford, P., Biavati, G., Horányi, A., Muñoz Sabater, J., Nicolas, J., Peubey, C., Radu, R., Rozum, I., Schepers, D., Simmons, A., Soci, C., Dee, D., Thépaut, J-N. (2023): ERA5 hourly data on single levels from 1940 to present. Copernicus Climate Change Service (C3S) Climate Data Store (CDS) (Accessed on 02-M07-2024)
14. Story Cover image: NASA image courtesy Jeff Schmaltz, MODIS Rapid Response Team. Caption: NASA/Goddard, Lynn, Jenner, source: https://www.eurekalert.org/multimedia/575396
Sources used for the analysis of the pollution episode 
15. Sembhi et al. 2020 Environ. Res. Lett. 15 104067, DOI 10.1088/1748-9326/aba714. [Source](https://iopscience.iop.org/article/10.1088/1748-9326/aba714)
16. V.P. Kanawade, A.K. Srivastava, K. Ram, E. Asmi, V. Vakkari, V.K. Soni, V. Varaprasad, C. Sarangi, What caused severe air pollution episode of November 2016 in New Delhi?Atmospheric Environment, Volume 222, 2020, 117125, ISSN 1352-2310, https://doi.org/10.1016/j.atmosenv.2019.117125. [Source](https://www.sciencedirect.com/science/article/pii/S1352231019307642)
17. Li, Ainong et al. “A geo-spatial database about the eco-environment and its key issues in South Asia.” Big Earth Data 2 (2018): 298 - 319, https://doi.org/10.1080/20964471.2018.1548053. [Source](https://doi.org/10.1080/20964471.2018.1548053) 




