# Tracking aerosol plumes from Hunga eruption in 2022

*This story is based on results from the [3<sup>rd</sup> Earth System Science Challenge]( https://sciencehub.esa.int/2024/05/09/3rd-earth-system-science-challenge/) organised and hosted by ESA's ESRIN Science Hub in February 2024*

The research presented in this story was developed in the frame of the Earth System Science Challenge organised by the European Space Agency and hosted at ESRIN’s Science Hub in February 2024. The scope of the challenge was to use temporal interpolation of satellite data in order to track efficiently the plume of the unprecedented eruption of the Hunga volcano in January 2022. The method presented here was developed by a team of PhD students from [Sorbonne Université](https://www.sorbonne-universite.fr/en) on the [DeepESDL platform](https://www.earthsystemdatalab.net/). The data and code are made openly available.  

## Tonga <!--{ as="eox-map" mode="tour" }-->

### <!--{ layers='[{"type":"Tile","properties":{"id":"Overlay labels"},"source":{"type":"XYZ","urls":["//s2maps-tiles.eu/wmts/1.0.0/overlay_base_bright_3857/default/g/{z}/{y}/{x}.jpg"]}},{"type":"Tile","properties":{"id":"EOxCloudless 2021"},"source":{"type":"XYZ","urls":["//s2maps-tiles.eu/wmts/1.0.0/s2cloudless-2021_3857/default/g/{z}/{y}/{x}.jpg"]}}]' zoom="7.987879004885659" center=[-175.12433157881628,-20.760022398643116] animationOptions={duration:500}}-->
#### Volcanoes and Climate

Extreme events such as megafires or stratospheric volcanic eruptions can have a profound radiative impact on a planetary scale by significantly affecting the global temperatures.  A famous example of this process is the eruption of Pinatubo in 1991 which caused a drop of approximately 0.6°C in the average global temperature in the next 15 months following the eruption eruption (Parker et al., 1996). 

### <!--{ layers='[{"type":"Tile","properties":{"id":"Overlay labels"},"source":{"type":"XYZ","urls":["//s2maps-tiles.eu/wmts/1.0.0/overlay_base_bright_3857/default/g/{z}/{y}/{x}.jpg"]}},{"type":"Tile","properties":{"id":"EOxCloudless 2021"},"source":{"type":"XYZ","urls":["//s2maps-tiles.eu/wmts/1.0.0/s2cloudless-2021_3857/default/g/{z}/{y}/{x}.jpg"]}}]' zoom="13.448484947136274" center=[-175.4210211289757,-20.549140867177655] animationOptions={duration:500}}-->
#### The Hunga Tonga erruption of 2022
This story focuses on the recent catastrophic volcanic eruption of Hunga Tonga - Hunga H'apai Volcano in January 2022. Radiative studies are underway to determine the long-term radiative impact of Hunga, following the study by Sellitto et al. (2022) which found a net warming of the climate system (Sellitto et al., 2022) at the top of atmosphere for 15 days after the eruption due to the water vapor in the plume. Previous research observed that the presence of sulfate aerosols formed in the wake of major eruptions tends to cool the climate, but the Hunga erruption offers the opportunity to study, for the first time in the satellite era, the radiative effect of a consequent disturbance in water vapour. 

<span style="font-size:15px;">Map information: Hunga Tonga - Hunga Ha'apai Volcano, source: EOxCloudless 2021 -<a href="https://s2maps.eu/" style="font-size:15px;">Sentinel-2 cloudless</a> by EOX IT Services GmBH; contains modified Copernicus Sentinel data 2021. Overlay data: &copy; OpenStreetMap contributors, made with Natural Earth, rendering &copy; EOX</span>


## Observing the eruption 

Satellite observations from NASA, ESA and JAXA can provide essential and complementary data about volcanic activity, helping us understand the full cycle, from the processes that move and store magma beneath volcanoes, to how eruptions occur and what are their impacts. 

The 2022 eruption of the Hunga Tonga-Hunga Ha‘apai underwater volcano was the biggest reported erruption globally in 30 years. After the eruption on January 15th at 4:15 UTC, the plume reached a maximum height of 58 km within 30 minutes (Carr et al.,2022). While most of the plume remained between 26 and 34 km, it began moving towards western longitudes, injecting approximately 0.4–0.5 Tg of SO2 into the atmosphere (Carn et al., 2022) and an unprecedented amount of water vapor into the stratosphere, causing an instantaneous 10% increase in stratospheric water content (Millán et al., 2022).

<center>
	<img src="https://upload.wikimedia.org/wikipedia/commons/c/c6/Tonga_Volcano_Eruption_2022-01-15_0320Z_to_0610Z_Himawari-8_visible.gif" width="400">
	
<span style="font-size:15px;">Himawari-8 satellite images of the 15 January 2022 eruption of Hunga Tonga-Hunga Haʻapai. 
Animation produced by the Japan Meteorological Agency (https://www.jma.go.jp/jma/kishou/info/coment.html). Legal notice (http://www.jma.go.jp/jma/en/copyright.html). Creative Commons Attribution 4.0 License (https://creativecommons.org/licenses/by/4.0/).</span>
	</center>


## Satellite Observations <!--{ as="eox-map" mode="tour" }-->

### <!--{ layers='[{"type":"Tile","properties":{"id":"Overlay labels"},"source":{"type":"XYZ","urls":["//s2maps-tiles.eu/wmts/1.0.0/overlay_base_bright_3857/default/g/{z}/{y}/{x}.jpg"]}},{"type":"Tile","properties":{"id":"so2_daily-2022-01-16"},"source":{"type":"TileWMS","urls":["https://services.sentinel-hub.com/ogc/wms/0635c213-17a1-48ee-aef7-9d1731695a54"],"params":{"layers":"AWS_VIS_SO2_DAILY_DATA","styles":"","format":"image/png","time":"2022-01-16"}}},{"type":"Tile","properties":{"id":"EOxCloudless 2021"},"source":{"type":"XYZ","urls":["//s2maps-tiles.eu/wmts/1.0.0/s2cloudless-2021_3857/default/g/{z}/{y}/{x}.jpg"]}}]' zoom="5.063636644024472" center=[178.99585302318826,-22.61607384489777] animationOptions={duration:500}}-->
#### SO2 Plume
Observations from several satellites such as ESA’s TROPOspheric Monitoring Instrument, TROPOMI onboard the Copernicus Sentinel-5p showed enhanced levels of stratospheric sulfur dioxide (SO2). The map illustrates the SO2 concentration observed by Sentinel-5p TROPOMI. Note that in this map the SO2 from potential anthropogenic sources has not been filtered out. The Copernicus Sentinel-5P SO2 measurements are those retrieved assuming SO2 at an altitude of 7km and explicitly filtering for pixels where a volcanic source is most likely (sulfurdioxide_detection_flag > 0) and where the solar zenith angle is within limits (SZA < 70°).

<span style="font-size:15px;">Map information: SO2 plume observed by Copernicus Sentinel-5p TROPOMI on 17 of January 2022</span> 

### <!--{ layers='[{"type":"Tile","properties":{"id":"Daily Sentinel 2 L2A-2021-12-08T00:00:00.000Z"},"source":{"type":"TileWMS","urls":["https://services.sentinel-hub.com/ogc/wms/0635c213-17a1-48ee-aef7-9d1731695a54"],"params":{"layers":"SENTINEL-2-L2A-TRUE-COLOR","format":"image/png","time":"2021-12-08/2021-12-08"}}}]' zoom="13" center=[-175.39,-20.5444] animationOptions={duration:500}}-->
#### Impact on the Hunga Tonga Island
The eruption caused significant damages to Tonga and neighbouring countries in the South Pacific. 

This map shows the Hunga Tonga - Hunga Ha'apai island before the eruption observed by the Copernicus Sentinel-2 on 08 December 2021. 
### <!--{ layers='[{"type":"Tile","properties":{"id":"Daily Sentinel 2 L2A-2022-01-27T00:00:00.000Z"},"source":{"type":"TileWMS","urls":["https://services.sentinel-hub.com/ogc/wms/0635c213-17a1-48ee-aef7-9d1731695a54"],"params":{"layers":"SENTINEL-2-L2A-TRUE-COLOR","format":"image/png","time":"2022-01-27/2022-01-27"}}}]' zoom="14" center=[-175.404,-20.547] animationOptions={duration:500}}-->
####  Dissapearance of the island
This map shows the Hunga Tonga - Hunga Ha'apai island after the eruption observed by the Copernicus Sentinel-2 on 27 January 2022. 

### 
In the context of this disaster, [Advanced Land Observing Satellite-2 “DAICHI-2” (ALOS-2)]( https://global.jaxa.jp/projects/sat/alos2/) PALSAR-2 synthetic aperture radar provided emergency observations due to its capability of imaging under clouds and plumes. The images below made available on the [Sentinel-Asia website](https://sentinel-asia.org/EO/2022/article20220115TO.html) show the main island of Tonga before (2020/03/07) and after (2022/01/22) the eruption observed by JAXA’s ALOS-2 PALSAR-2. 

<img src="https://raw.githubusercontent.com/eurodatacube/eodash-assets/main/stories/ScienceHub-Challenge-February-2024/hunga-tonga/IMG-HH-ALOS2312694050-200307-FBDR2.1GUD_sml.jpg">

<img src="https://raw.githubusercontent.com/eurodatacube/eodash-assets/main/stories/ScienceHub-Challenge-February-2024/hunga-tonga/IMG-HH-ALOS2414124050-220122-FBDR2.1GUD_sml.jpg">


## Data and Methods

This section presents the method to track the plume of the Hunga erruption that was developed by the team of students during the Science Hub Challenge. 

In order to precisely monitor the movement of the sulfur dioxide plume from the Hung a erruption, the students used sulfate aerosol data (Siddans et al., 2022) produced by RAL (Rutherford Appleton Laboratory) with co-located satellite data from by IASI (Infrared Atmospheric Sounding Interferometer), AMSU (Advanced Microwave Sounding Unit) and MHS(Microwave Humidity Sounder) on MetOp-B spacecraft. They were interested in the optical properties of the components of the plume, especially the sulfate aerosols optical depth (SAOD). The injected SO2 was rapidly converted into sulfate aerosols thanks to the abundant presence of water vapor in the stratosphere (Legras et al., 2022). The SAOD measurements allowed them to understand where the plume is located and its displacement. In order to track the plume they tracked the sulfate aerosols within the plume. 

However, because of the satellite geometry, particularly the swath wide, the gaps in their datasets made it hard to follow efficiently the movement of the aerosols. 

<img src="https://raw.githubusercontent.com/eurodatacube/eodash-assets/main/stories/ScienceHub-Challenge-February-2024/hunga-tonga/Plume-before-interpolation.gif">

Visualisation of the plume between 13/01/2022 and 29/01/2022 (no interpolation)

The students’ idea was to use temporal interpolation techniques to be able to fill in those missing data. 
To do so they constructed their research following these four steps:
1. 	Selection of consecutive time series data of days before, during and after the event.
2. 	Introduction of temporal gaps of different periods
3. 	Interpolation using different algorithms: namely linear regression and second-degree polynomial regression* methods to fill in the temporal gaps
4. 	Comparison of interpolation methods

Starting from the selection of time series data, consecutive time series data were selected by choosing a single pixel within the aerosol plume, ensuring it has no temporal gaps, and retrieving data from a random pixel within the plume. Temporal gaps of various durations were then introduced by randomly removing points from the dataset. Subsequently, different interpolation algorithms, such as linear regression and second-degree polynomial regression, were applied to fill these gaps, followed by a comparison of their effectiveness. The chosen interpolation method was then adapted to the dataset, creating linear interpolation functions based on SAOD and date time series. 
The linear interpolation function for one pixel involved looping over the time series, addressing gaps where both adjacent points or a single point are missing, and implementing interpolation based on general cases and boundary conditions.

Finally, new maps were computed by generating interpolated time series and plotting SAOD to visualize the results, aiming to accurately fill temporal gaps in satellite data and produce detailed maps of the aerosol plume's characteristics. By following these steps, the project aimed to effectively fill in temporal gaps in the satellite data and produce accurate interpolated maps of the aerosol plume.
To reproduce this experiment, the data and code are made openly available. 

<video controls autoplay>
<source src="https://raw.githubusercontent.com/eurodatacube/eodash-assets/main/stories/ScienceHub-Challenge-February-2024/hunga-tonga/Plume-after-interpolation.mov" type="video/mp4">
</source>
</video>

Visualisation of the plume between 13/01/2022 and 31/01/2022 (after interpolation)

## Conclusions
In this work, the students concluded that relevant interpolation is possible with linear regression, and that gap filling by interpolation allows to improve the precision of the evolution of the plume. This strenghtens the evaluation of the radiative impact of the sulfates (especially for satellite tracks). The method still has a few weaknesses at this stage. From a technical point of view the team suggests further improvements by implementing a 2nd degree interpolation with more points and develop the function to handle 3 or maybe more consecutive gaps, as well as potentially implementing a shift to take into account the rapid horizontal displacement of the plume with the wind angular rotation speed from ERA5 reanalysis.

In the context of climate change, monitoring and understanding the impacts of such extremes is essential for adaptation and mitigation. In fact, studies of stratospheric volcanic eruptions and their long term radiative impacts can provide important results for geoengineering. With the warming climate, solutions such as injecting highly diffusive particles such as sulfate aerosols directly into the stratosphere are being explored to limit rising temperatures. In this context, stratospheric volcanic eruptions provide important real-world case studies to see the impact of gases or particles injected directly at high altitude. 

#### Precursors to underwater volcanic eruptions

Satellites can provide essential information about volcanic activtiy long before eruptions occur. 

Observations from JAXA’s [Global Change Observation Mission – Climate “SHIKISAI” (GCOM-C)]( https://global.jaxa.jp/projects/sat/gcom_c/) offered information about precursor processes such as the presence of discolored seawater originated by the reaction of hot water caused by volcanic activity with seawater, suggesting enhancement of volcanic activity. Read more about this on the [JAXA website]( https://earth.jaxa.jp/en/earthview/2022/01/20/6701/index.html).

Other precursor information about volcanic activity comes from below the Earth’s crust. Understanding of the natural processes such as the buildup in the mantle supports the development of methods for better characterisation and prediction of  eruptions. Satellite data  from GOCE – ESA’s gravity mission – provided essential information to improve our understanding of the processes beneath the Hunga Tonga-Hunga Ha‘apai. [ESA’s Science for Society 3D Earth project](https://eo4society.esa.int/projects/stse-3d-earth/) developed a model of the lithosphere combining different satellite data, such as gravity data from ESA’s GOCE mission, with in-situ observations, which showed differences in temperature, or thermal structures, indicating that the Tonga volcano was due to erupt at some point. Read more about this on the [ESA website]( https://www.esa.int/Applications/Observing_the_Earth/FutureEO/GOCE/Deep_down_temperature_shifts_give_rise_to_eruptions).

<center>
<img src="https://www.esa.int/var/esa/storage/images/esa_multimedia/images/2022/02/hot_and_cold_beneath_tonga_volcano/23966451-1-eng-GB/Hot_and_cold_beneath_Tonga_volcano_pillars.jpg" width="50%"> 
</center>
<center>
<span style="font-size:15px;">
© Planetary Visions (credit: ESA/Planetary Visions).<a href="https://www.esa.int/Applications/Observing_the_Earth/FutureEO/GOCE/Deep_down_temperature_shifts_give_rise_to_eruptions" style="font-size:15px;">ESA Webstory</a></span>
</center>

## Open Science 

The analysis was carried out on the [ESA DeepESDL (Deep Earth System Data Lab)](https://earthsystemdatalab.net ). For research purposes, ESA is offering this resources under a sponsorship scheme through the Network of Resources.
* [DeepESDL website](https://earthsystemdatalab.net)  
* [Network of Resources website](https://nor-discover.org/en/portfolio/)
* [Apply for sponsorsed access to DeepESDL](https://portfolio.nor-discover.org/?textSearch=DeepESDL)
* [RAL Dataset](https://zenodo.org/records/7102472)
* [Jupyter Notebook](https://github.com/eurodatacube/eodash-assets/blob/main/stories/ScienceHub-Challenge-February-2024/hunga-tonga/5_OpenChallengeNotebook-Hunga-Ch3_Duchamp_Barton_Baldazo.ipynb) (*Note that the polynomial regression is incomplete. However, you are encouraged to expand the notebook to include your own implementation.)*

### References

1.	Carn, S. A., Krotkov, N. A., Fisher, B. L., & Li, C. (2022). Out of the blue: Volcanic SO2 emissions during the 2021–2022 eruptions of Hunga Tonga—Hunga Ha'apai (Tonga). Frontiers in Earth Science, 10, 976962. https://doi.org/10.3389/feart.2022.976962
2.	Carr, J. L., Horvath, A., Wu, D. L., & Friberg, M. D. (2022). Stereo plume height and motion retrievals for the record-setting Hunga Tonga-Hunga Ha'apai eruption of 15 January 2022. Geophysical Research Letters, 49(9), e2022GL098131. https://doi.org/10.1029/2022GL098131
3.	Khaykin, S., Podglajen, A., Ploeger, F., Grooß, J.-U., Tence, F., Bekki, S., et al. (2022). Global perturbation of stratospheric water and aerosol burden by Hunga eruption. Communications Earth & Environment, 3(1), 316. https://doi.org/10.1038/s43247-022-00652-x
4.	Millán, L., Santee, M. L., Lambert, A., Livesey, N. J., Werner, F., Schwartz, M. J., et al. (2022). The Hunga Tonga-Hunga Ha'apai hydration of the stratosphere. Geophysical Research Letters, 49(13), e2022GL099381. https://doi.org/10.1029/2022GL099381
5.	Legras, B., Duchamp, C., Sellitto, P., Podglajen, A., Carboni, E., Siddans, R., et al. (2022). The evolution and dynamics of the Hunga Tonga–Hunga Ha'apai sulfate aerosol plume in the stratosphere. Atmospheric Chemistry and Physics, 22(22), 14957–14970. https://doi.org/10.5194/acp-22-14957-2022
6.	Parker, D.E., Wilson, H., Jones, P.D., Christy, J.R. & Folland, C.K. (1996). The Impact of Mount Pinatubo on World-Wide Temperatures. Int. J. Climatol., 16: 487-497. https://doi.org/10.1002/(SICI)1097-0088(199605)16:5<487::AID-JOC39>3.0.CO;2-J
7.	Sellitto, P., Podglajen, A., Belhadji, R., Boichu, M., Carboni, E., Cuesta, J., Duchamp, C., et al. (2022). The unexpected radiative impact of the Hunga Tonga eruption of 15th January 2022. Communications Earth & Environment, 3(1), 288. https://doi.org/10.1038/s43247-022-00618-z



