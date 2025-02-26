# Extreme rainfal events in the South-East of France
In recent years, the southeastern region of France has experienced increasingly severe rainfall events, posing significant challenges to local communities, infrastructure, and the environment. These extreme weather phenomena, known as [**"Cevenols events"**](https://aquagir.fr/gestion-eaux-pluviales/connaissances/les-episodes-cevenols-quand-la-mediterranee-dechaine-ses-pluies/)  are a striking example of how atmospheric and geographic factors combine to create intense and often devastating precipitation.

Monitoring this kind of extreme event is a massive challenge for weather forecasts models, that is why observations from space are a really great tool to help in that way. In this study, the objective is to use observations products from space to try to **detect massive rainfall events and evaluate the accuracy of the results** in terms of caracteristics of the precipitation event (daily maximum value and location).

#### Cevenols Events and their consequences
Cevenols events are heavy and persistent rainfall episodes that typically occur in late summer and autumn. They are most common in southeastern France, particularly in the Cévennes mountain range, which gives the phenomenon its name. These episodes are caused by a combination of atmospheric conditions: warm and humid air masses, originating from the heated Mediterranean Sea, are pushed inland by southeasterly winds. When this air collides with colder air at higher altitudes, it triggers powerful thunderstorms and torrential rain. The steep terrain of the region further exacerbates the problem by trapping the moist air, leading to prolonged and concentrated precipitation in localized areas.

<center>
<img src="https://www.universalis.fr/typo3temp/assets/_processed_/5/e/csm_ca151093_788244508f.webp" width="600">
<span style="font-size:15px;">Cevenols Events. Source: Encyclopaedia Universalis under CC BY-NC license.</span>
</center>

The consequences of Cevenols events can be severe and far-reaching. Flash floods are a major hazard, as the large volumes of rainwater quickly overwhelm rivers and drainage systems. Rapid runoff over saturated or rocky terrain leads to destructive flooding in urban and rural areas alike. Landslides are another common consequence, with soil and rock masses becoming unstable due to the excessive water infiltration.

The human and economic toll of these events can be substantial. Homes, roads, and infrastructure are frequently damaged or destroyed, and emergency response teams often face significant challenges in evacuating and assisting affected populations. Furthermore, climate change may be intensifying the frequency and severity of these events, making scientific research and adaptive measures more critical than ever.

## Methodology

### Datasets
The study relies on three key datasets to ensure accuracy and reliability. The [Hydrology Cube](https://zenodo.org/records/6459152), derived from the GPM product, uses satellite-based soil moisture measurements with a high resolution of 0.01°. The [GPCP dataset](https://climatedataguide.ucar.edu/climate-data/gpcp-daily-global-precipitation-climatology-project) combines infrared and microwave radiometer data with in-situ pluviometer readings at a 1° resolution, offering a broader observational perspective. Lastly, [ERA5](https://www.ecmwf.int/en/forecasts/dataset/ecmwf-reanalysis-v5), a meteorological reanalysis dataset from ECMWF’s IFS model, serves as a reference with a 0.25° resolution.

<center>
<img src="https://github.com/eurodatacube/eodash-assets/blob/main/stories/ScienceHub-Challenge-February-2024/extreme_rainfall/rainfall_2.png?raw=true" width="800">
<span style="font-size:15px;">Datasets used. Top:  Hydrology Cube : 
GPM product created from soil moisture measured from space. Middle: GPCP dataset, Bottom :ERA5 (as a reference)
	</span>
</center>

### Worflow
Analyzing extreme rainfall requires filtering large meteorological datasets to focus on the most significant events. The process began with a **3D data cube** containing precipitation records over time and a wide geographical area. To narrow the focus, the dataset was filtered to southern France, creating a regional cube while keeping the full time range intact.

Next, to identify significant weather events, the **maximum precipitation value** at each grid point is extracted over the entire time period. This results in a maximum matrix, a two-dimensional dataset that represents the highest recorded rainfall at each location. However, not all heavy rainfalls qualify as extreme events. To set a meaningful threshold, a **threshold matrix** was created by selecting the **99th percentile of these maximum values**—ensuring that only the most intense rainfall occurrences are considered.
<center>
<img src="https://github.com/eurodatacube/eodash-assets/blob/main/stories/ScienceHub-Challenge-February-2024/extreme_rainfall/rainfall_1.png?raw=true" width="800">
<span style="font-size:15px;">Methodology workflow
	</span>
</center>

Finally, a specific data —such as October 2, 2020— was be extracted for closer examination. This streamlined approach allowed  to efficiently analyze an extreme weather pattern, helping to improve the understanding of heavy rainfall events and their impacts.

## Key findings

After applying a structured filtering process to three different datasets—Hydrology Cube (GPM), GPCP, and ERA5—the study **successfully extracted extreme precipitation events**. By focusing on a **specific case, the extreme rainfall event of October 2, 2020**, the analysis allowed for a detailed comparison of precipitation patterns across the datasets.

One of the main objectives was to examine how the datasets align in terms of the location and intensity of maximum precipitation. The results revealed that while **all three datasets captured the event**, the GPM dataset was the closest to ERA5 in terms of both the location and amount of peak precipitation recorded for that day. This suggests that satellite-derived soil moisture measurements from GPM provide a high-resolution and reliable representation of extreme rainfall events, aligning well with ERA5, which is often used as a reference for meteorological reanalysis.

These findings highlight the effectiveness of combining multiple data sources for extreme weather analysis. By extracting, selecting, and comparing events across different datasets, the study reinforces the importance of high-resolution satellite observations in capturing heavy rainfall events with accuracy.

## Future research steps
To enhance this study, future research will focus on **refining the threshold method** for selecting extreme events, improving accuracy in detection. Expanding the analysis to **multiple events over a longer time series**, particularly using the GPCP dataset (1996–2022), will provide deeper insights into rainfall trends. A **statistical analysis of maximum values, event locations, and seasonal variations**—while accounting for differences in spatial resolution—could further reveal climate patterns. Additionally, comparing results with other observation methods, (such as CloudSat radar), will help validate findings and improve dataset reliability.




## References
#### Datasets
- Brocca et al., 2014: Soil as a natural rain gauge: Estimating global rainfall from satellite soil moisture data
- Huffman et al., 2001: Global Precipitation at One-Degree Daily Resolution from Multisatellite Observations

#### Information on the event (02/10/2020)
https://france3-regions.francetvinfo.fr/provence-alpes-cote-d-azur/alpes-maritimes/alpes-maritimes-un-nouvel-episode-mediterraneen-est-il-possible-2849237.html










