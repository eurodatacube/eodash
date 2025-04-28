# Extreme rainfal events in the South-East of France
###### *This story is based on results from the [3<sup>rd</sup> Earth System Science Challenge]( https://sciencehub.esa.int/2024/05/09/3rd-earth-system-science-challenge/) organised and hosted by ESA's ESRIN Science Hub in February 2024*
The research presented in this story was developed in the frame of the [Earth System Science Challenge](https://sciencehub.esa.int/2024/05/09/3rd-earth-system-science-challenge/) organized by the European Space Agency (ESA) and hosted at ESRIN’s Science Hub in February 2024. The scope of this challenge was to identify extreme rainfall events in the South of France, using 3 precipitation datasets. The method was implemented on the [DeepESDL platform](https://www.earthsystemdatalab.net/) by a team of PhD students from Sorbonne Université. The data and code are made openly available.

## Extreme rainfal events in the South-East of France
In recent years, the southeastern region of France has been hit by increasingly severe rainfall events, creating serious problems for local communities, infrastructure, and the environment. These extreme weather patterns, locally called **"Cevenols events"**, show how atmospheric conditions and geographical features work together to produce intense and often devastating downpours.

Monitoring this kind of extreme event is a massive challenge for weather forecasts models, that is why observations from space are a really great tool to help in that way. In this study, the objective is to use observations products from space to try to **detect massive rainfall events and evaluate the accuracy of the results** in terms of caracteristics of the precipitation event (daily maximum value and location).

#### Cevenols Events and their consequences
Cevenols events are heavy and persistent rainfall episodes typically occuring in late summer and autumn, in southeastern France. More specifically these rainfalls occur in the are of the Cévennes mountain range (which is the reason why they are called this way). These intense rainfalls are caused by a combination of atmospheric conditions: warm and humid air masses, originating from the heated Mediterranean Sea, are pushed inland by southeasterly winds. When this air collides with colder air at higher altitudes, it triggers powerful thunderstorms and torrential rain. The steep terrain of the region further exacerbates the problem by trapping the moist air, leading to prolonged and concentrated precipitation in localized areas.

<center>
<img src="https://www.universalis.fr/typo3temp/assets/_processed_/5/e/csm_ca151093_788244508f.webp" width="600">
<span style="font-size:15px;">Cevenols Events. Source: Encyclopaedia Universalis under CC BY-NC license.</span>
</center>

The consequences of Cevenols events can be very impactful. The large volumes of rainwater can quickly overwhelm rivers contributing to a rapid runoff overleading to destructive flooding in urban and rural regions or landslides. The human and economic toll of such events can be substantial with the destruction of houses, roads and other infrastructures. 

## Method and datasets

### Datasets
The study relies on three key datasets to ensure accuracy and reliability. The [Hydrology Cube](https://agupubs.onlinelibrary.wiley.com/doi/10.1002/2014JD021489), derived from the GPM product, uses satellite-based soil moisture measurements with a high resolution of 0.01°. The [GPCP dataset](https://journals.ametsoc.org/view/journals/hydr/2/1/1525-7541_2001_002_0036_gpaodd_2_0_co_2.xml) combines infrared and microwave radiometer data with in-situ pluviometer readings at a 1° resolution, offering a broader observational perspective. Lastly, [ERA5](https://cds.climate.copernicus.eu/datasets/reanalysis-era5-single-levels?tab=overview), a meteorological reanalysis dataset from ECMWF’s IFS model, serves as a reference with a 0.25° resolution.

<center>
<img src="https://github.com/eurodatacube/eodash-assets/blob/main/stories/ScienceHub-Challenge-February-2024/extreme_rainfall/rainfall_2.png?raw=true" width="800">
<span style="font-size:15px;">Datasets used. Top:  Hydrology Cube : 
GPM product created from soil moisture measured from space. Middle: GPCP dataset, Bottom :ERA5 (as a reference)
	</span>
</center>

### Methodology workflow
Analyzing extreme rainfall requires filtering large meteorological datasets to focus on the most significant events. The process began with a **3D data cube** containing precipitation records over time and a wide geographical area. To narrow the focus, the dataset was filtered to southern France, creating a regional cube while keeping the full time range intact.

Next, to identify significant weather events, the **maximum precipitation value** at each grid point is extracted over the entire time period. This results in a maximum matrix, a two-dimensional dataset that represents the highest recorded rainfall at each location. However, not all heavy rainfalls qualify as extreme events. To set a meaningful threshold, a **threshold matrix** was created by selecting the **99th percentile of these maximum values**—ensuring that only the most intense rainfall occurrences are considered.
<center>
<img src="https://github.com/eurodatacube/eodash-assets/blob/main/stories/ScienceHub-Challenge-February-2024/extreme_rainfall/rainfall_1.png?raw=true" width="800">
<span style="font-size:15px;">Methodology workflow
	</span>
</center>

Finally, a specific data —such as October 2, 2020— was be extracted for closer examination. This streamlined approach allowed  to efficiently analyze an extreme weather pattern, helping to improve the understanding of heavy rainfall events and their impacts.

##  Conclusions  <!--{ as="eox-map" mode="tour" }-->

###  <!--{ layers='[{"type":"Tile","properties":{"id":"Overlay labels"},"source":{"type":"XYZ","urls":["//s2maps-tiles.eu/wmts/1.0.0/overlay_base_bright_3857/default/g/{z}/{y}/{x}.jpg"]}},{"type":"Tile","properties":{"id":"CO_3_daily-2023-11-08"},"source":{"type":"TileWMS","urls":["https://services.sentinel-hub.com/ogc/wms/0635c213-17a1-48ee-aef7-9d1731695a54"],"params":{"layers":"AWS_VIS_CO_3DAILY_DATA","styles":"","format":"image/png","time":"2023-11-08"}}},{"type":"Tile","properties":{"id":"OSM Background"},"source":{"type":"XYZ","urls":["//s2maps-tiles.eu/wmts/1.0.0/osm_3857/default/g/{z}/{y}/{x}.jpg"]}}]' zoom="9.879889469918195" center=[74.28590944565705,31.547289411942756] animationOptions={duration:500}}-->
#### The heavy rainfalls in Octobert 2nd, 2020 
After applying a structured filtering process to three different datasets—Hydrology Cube (GPM), GPCP, and ERA5—the study **successfully extracted extreme precipitation events**. 

<center>
<img src="https://github.com/eurodatacube/eodash-assets/blob/main/stories/ScienceHub-Challenge-February-2024/extreme_rainfall/rainfall_3.png?raw=true" width="400">
<span style="font-size:15px;">
	 Comparison of thee three datasets results</span>
</center>

By focusing on a **specific case, the extreme rainfall event of October 2, 2020** (which has reported on the [news](https://france3-regions.francetvinfo.fr/provence-alpes-cote-d-azur/alpes-maritimes/alpes-maritimes-un-nouvel-episode-mediterraneen-est-il-possible-2849237.html)), the analysis allowed for a detailed comparison of precipitation patterns across the datasets.


### <!--{ layers='[{"type":"Tile","properties":{"id":"Overlay labels"},"source":{"type":"XYZ","urls":["//s2maps-tiles.eu/wmts/1.0.0/overlay_base_bright_3857/default/g/{z}/{y}/{x}.jpg"]}},{"type":"Tile","properties":{"id":"CO_3_daily-2023-11-08"},"source":{"type":"TileWMS","urls":["https://services.sentinel-hub.com/ogc/wms/0635c213-17a1-48ee-aef7-9d1731695a54"],"params":{"layers":"AWS_VIS_CO_3DAILY_DATA","styles":"","format":"image/png","time":"2023-11-08"}}},{"type":"Tile","properties":{"id":"OSM Background"},"source":{"type":"XYZ","urls":["//s2maps-tiles.eu/wmts/1.0.0/osm_3857/default/g/{z}/{y}/{x}.jpg"]}}]' zoom="8.947606701979296" center=[77.13217840767383,28.560811023321136] animationOptions={duration:500}}-->
#### Key findings
One of the main objectives was to examine how the datasets align in terms of the location and intensity of maximum precipitation. The results revealed that while **all three datasets captured the event**, the GPM dataset was the closest to ERA5 in terms of both the location and amount of peak precipitation recorded for that day. This suggests that satellite-derived soil moisture measurements from GPM provide a high-resolution and reliable representation of extreme rainfall events, aligning well with ERA5, which is often used as a reference for meteorological reanalysis.
<center>
<img src="https://github.com/eurodatacube/eodash-assets/blob/main/stories/ScienceHub-Challenge-February-2024/extreme_rainfall/rainfall_4.png?raw=true" width="400">
	
<span style="font-size:15px;">Subtitle</span>
</center>

These findings highlight the effectiveness of combining multiple data sources for extreme weather analysis. By extracting, selecting, and comparing events across different datasets, the study reinforces the importance of high-resolution satellite observations in capturing heavy rainfall events with accuracy.


## Future research steps
To enhance this study, future research will focus on **refining the threshold method** for selecting extreme events, improving accuracy in detection. Expanding the analysis to **multiple events over a longer time series**, particularly using the GPCP dataset (1996–2022), will provide deeper insights into rainfall trends. A **statistical analysis of maximum values, event locations, and seasonal variations**—while accounting for differences in spatial resolution—could further reveal climate patterns. Additionally, comparing results with other observation methods, (such as CloudSat radar), will help validate findings and improve dataset reliability.




## Open Science
#### Datasets
- The [Hydrology Cube/GPM-CPC SM2RAIN-ASCAT precipitation dataset](https://agupubs.onlinelibrary.wiley.com/doi/10.1002/2014JD021489)
- The [GPCP dataset  precipitation dataset](https://journals.ametsoc.org/view/journals/hydr/2/1/1525-7541_2001_002_0036_gpaodd_2_0_co_2.xml)
- The [ERA5 precipitation dataset](https://cds.climate.copernicus.eu/datasets/reanalysis-era5-single-levels?tab=overview)

#### References
- The web news article on the [rainfall event of 02-10-2020](https://france3-regions.francetvinfo.fr/provence-alpes-cote-d-azur/alpes-maritimes/alpes-maritimes-un-nouvel-episode-mediterraneen-est-il-possible-2849237.html) 
- Brocca et al. 2014. Soil as a natural rain gauge: Estimating global rainfall from satellite soil moisture data, https://doi.org/10.1002/2014JD021489.
- Huffman et al. 2001. Global Precipitation at One-Degree Daily Resolution from Multisatellite Observations, https://doi.org/10.1175/1525-7541(2001)002<0036:GPAODD>2.0.CO;2
