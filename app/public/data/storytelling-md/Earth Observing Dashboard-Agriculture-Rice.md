## Early Rice Planting in Sacramento, California, USA 

Satellite imagery observed by ALOS-2 PALSAR-2 and GCOM-C operated by JAXA, Sentinel-2 by ESA, and Landsat-8 by NASA/USGS were used to assess the state of rice cultivation near Sacramento, California, USA.

 These observations show that the rice planting, heading and harvesting in 2020 began earlier than the past two years in many regions, and rice planting area was larger than in 2019.

As for the timing of planting, effect of weather conditions is one reason. In addition, there is a possibility that high rice price caused by the COVID-19 related concerns over global rice supply through potential increases in demand, threats of export restrictions, and shortage of labor.

The map below shows observations from GCOM-C SGLI on 24 May 2020 ([to browse more dates, open indicator in EO Dashboard](https://www.eodashboard.org/explore?indicator=E10c&x=-13558713.97862&y=4694525.17969&z=7.79683&poi=US05-E10c)).

## Map Example <!--{as="eox-map" style="width: 100%; height: 500px;" layers='[{"type":"Tile","properties":{"id":"Overlay labels"},"source":{"type":"XYZ","urls":["//s2maps-tiles.eu/wmts/1.0.0/overlay_base_bright_3857/default/g/{z}/{y}/{x}.jpg"]}},{"type":"Tile","properties":{"id":"Rice planting-2020-05-24"},"source":{"type":"XYZ","urls":["https://8ib71h0627.execute-api.us-east-1.amazonaws.com/v1/{z}/{x}/{y}@1x?url=s3%3A%2F%2Fcovid-eo-data%2Fagriculture%2Fgcom-c-2020_05_24.tif&resampling_method=bilinear&bidx=1&rescale=-1%2C1&color_map=cfastie"]}},{"type":"Tile","properties":{"id":"OSM Background"},"source":{"type":"XYZ","urls":["//s2maps-tiles.eu/wmts/1.0.0/osm_3857/default/g/{z}/{y}/{x}.jpg"]}}]' zoom="7.796826239373065" center=[-121.79999999999998,38.810231346133094] }-->



## Observation and Analysis Results


Global food supply in the best conditions is becoming a major challenge.
COVID-19 has strained the food supply and demand balance by disrupting food supply chain systems, such as labor, logistics, trade/domestic policies, and market anxiety.
In the case of rice production, COVID-19 contributed to concerns over global supply through potential increases in demand, threats of export restrictions, and farm labor concerns.
These and other factors resulted in a reported high rice price and increase in global rice production. 

For decades, satellite monitoring for global food supply has provided critical, independent, and objective indicators of major commodity supplies, and it has been continued during the COVID-19 pandemic. Satellite imagery is able to confirm planting progress in key rice producing areas. Satellite imagery are used to assess the state of planting near Sacramento, California, USA, using ALOS-2 PALSAR-2 and GCOM-C operated by JAXA, Sentinel-2 by ESA, and Landsat-8 by NASA/USGS. These satellites can capture rice phenology, when rice is planted, mature and harvested, through the observation of land surface conditions such as water inundation for planting and leaf area after emergence.

Satellite observations show that the rice planting and harvesting in 2020 began earlier than the previous two years (2018, 2019) in many regions. In addition, the planting area was larger than 2019. Early assessments of planting or harvesting progress allow agriculture markets to respond efficiently to supply disruptions due to natural (e.g. weather, pandemics) and man-made events (e.g. trade policy changes).

Satellite observations show that the rice planting in 2020 began earlier than 2019 (Figure 1). Observations by Synthetic Aperture Radar (ALOS-2) show the timing of paddy field flooding was earlier than 2019 in many areas (Figure 2).

<center>
	
![](https://raw.githubusercontent.com/eurodatacube/eodash-assets/main/collections/E10c_rice_planting/US07-E10c-Fig1.png)

*Figure 1. Study Area (Colusa, Glenn, and Yolo counties in CA, USA). Background image is Normalized Difference Vegetation Index (NDVI)  generated from the data observed by GCOM-C SGLI during March 5-12 2020.*

![](https://raw.githubusercontent.com/eurodatacube/eodash-assets/main/collections/E10c_rice_planting/US07-E10c-Fig2.png)

*Figure 2. Comparison result of observation image around Sacramento captured by ALOS-2 PALSAR on May 29, 2019 and May 28, 2020. Red color shows the paddy fields which have already been planted at the end of May only in 2020. Many fields indicated in red imply the advance of rice planting in 2020.*

</center>

## NDVI Time Series
Normalized Difference Vegetation Index (NDVI) is highly related with vegetation of the amount green leaves. So, higher value shows rice growing conditions with much green leaves. According to the time-series changes of NDVI observed by GCOM-C, Sentinel-2, and Landsat-8 optical satellites, the earlier increase of NDVI in 2020 than in previous years indicates that the sowing period of the paddy rice began earlier. (Figures 3 and 4).

<center>
	
<img src="https://raw.githubusercontent.com/eurodatacube/eodash-assets/main/collections/E10c_rice_planting/US07-E10c-Fig3a.png" width="50%" height="500px">

*a) Colusa county, CA, USA*

<img src="https://raw.githubusercontent.com/eurodatacube/eodash-assets/main/collections/E10c_rice_planting/US07-E10c-Fig3b.png" width="50%" height="500px">

*b) Glenn county, CA, USA*

<img src="https://raw.githubusercontent.com/eurodatacube/eodash-assets/main/collections/E10c_rice_planting/US07-E10c-Fig3c.png" width="50%" height="500px">

*c) Yolo county, CA, USA*

*Figure 3. Time-series changes of NDVI observed by GCOM-C SGLI in paddy fields of Colusa, Glenn, and Yolo counties. Yellow lines (2020) increase earlier than red (2019) or blue (2018), which indicates that the timing of planting in 2020 was the earliest of the three years (2020, 2019, 2018). Similarly, the yellow lines decrease earlier, which means that the timing of harvest was also earlier than usual. Horizontal axis shows “Day of Year” (“1” means January 1st and “365” means December 31st).*

<center>
	
<img src="https://raw.githubusercontent.com/eurodatacube/eodash-assets/main/collections/E10c_rice_planting/US07-E10c-Fig4a.png" width="50%" height="500px">

*a) Sentinel-2*

<img src="https://raw.githubusercontent.com/eurodatacube/eodash-assets/main/collections/E10c_rice_planting/US07-E10c-Fig4b.png" width="50%" height="500px">

*b) Landsat-8*

*Figure 4. Time-series changes of Vegetation Index observed by Sentinel-2 and Landsat-8 at a specific point (N 39.48284, W122.06556) in Glenn county, CA USA.*

</center>

Also, the peaks of NDVI means that the amount of paddy rice leaves was at its maximum (heading period). The earlier peak of NDVI in 2020 indicates that heading period was earlier than previous years. Similarly, the decrease of NDVI in 2020 means that leaves turn yellow or red and leaf mass decreases due to harvesting. The earlier decrease of NDVI indicates that the harvest period of paddy rice was also earlier than previous years. The [Foreign Food Supply and Demand Report (October 2020, in Japanese)](https://www.maff.go.jp/j/zyukyu/jki/j_rep/monthly/attach/pdf/r2index-28.pdf) published by the Ministry of Agriculture, Forestry and Fisheries of Japan also states "According to the U.S. Department of Agriculture, California's harvest progress was 90 percent, which is higher than the same period in 2019 (77%). “, which is consistent with the tendency by satellite observations.

## Using Machine Learning 

In addition, Rice planting area around Sacramento was estimated by machine learning technology, which is utilized for AI etc., using complex utilization of images from ALOS-2　(Rader) and Sentinel-2　(Optical) (Figure 5).  Rice harvest in 2020 was expected to increase, because planted area had expanded in 2020 compared to 2019. The planted area in 2019 was 496,000 acres ([official statistics by USDA](https://www.nass.usda.gov/Quick_ Stats/Ag_Overview/stateOverview.php?state=CALIFORNIA)). Furthermore, the planted area in 2020 estimated from ALOS-2 is 515,000 acres. This estimated area will be the second largest on record since 2014.

The timing of rice planting, growing and harvesting in 2020 was the earliest among last six years observed by Sentinel-2 and last eight years observed by Landsat-8, respectively. Horizontal axis shows “Day of Year” (“1” means January 1st and “365” means December 31st).  

<center>
	
![](https://raw.githubusercontent.com/eurodatacube/eodash-assets/main/collections/E10c_rice_planting/US07-E10c-Fig5.png)

*Figure 5: Estimated result of rice planting area around Sacramento in 2019 and 2020 by using ALOS-2 (Radar) and Sentinel-2 (Optical) data. The White parts indicate areas of rice planting in both 2019 and 2020. The red parts indicate areas of rice planting only in 2020, and the blue parts indicate areas of rice planting only in 2019. Because the red area is larger than the blue area, the rice harvest in 2020 is expected to be higher than in 2019.*


## Multi-mission approach

#### New results until June in 2021 captured by GCOM-C, Sentinel-2, Landsat-8 and ALOS-2

Same as for 2020, satellite imagery observed by ALOS-2 PALSAR-2 and GCOM-C operated by JAXA, Sentinel-2 by ESA, and Landsat-8 by NASA/USGS were also used to monitor rice planting conditions around Sacramento, California, USA in 2021. Especially, the year 2021 is expected to be one of the hottest years on record and precipitation and snowfall are far below average. According to the [“U.S. Drought Monitor”](https://droughtmonitor.unl.edu/CurrentMap/StateDroughtMonitor.aspx?West) published by the National Oceanic and Atmospheric Administration and other organizations, the drought intensity is D3 (Extreme Drought) or D4 (Exceptional Drought) on large areas of California, and these are the most serious of the five stages (as of July 2021). Due to the drought, more than 1,500 dams and reservoirs in California had less than 50% water volume compared to the average year.

Because of the serious shortage of agricultural water, the planting area is forecasted to significantly decrease. According to the [“Rice Outlook“ in July](https://www.ers.usda.gov/publications/pub-details/?pubid=101645) published by United States Department of Agriculture (USDA), the planting area in California was forecasted as 417,000 acres, which is the lowest since 1992.

Comparison result of ALOS-2 (Synthetic Aperture Radar) satellite data at the end of May in 2020 and 2021 shows the area of paddy field filled with water in 2021 was significantly smaller than that of 2020. Therefore, planting area is also estimated to decrease (Figure 6), which is consistent with the USDA Rice Outlook report. 

<center> 
	
![](https://raw.githubusercontent.com/eurodatacube/eodash-assets/main/collections/E10c_rice_planting/E10c-Fig6.png)

*Figure 6: Comparison result of paddy fields filled with water around Sacramento analyzed by ALOS-2 satellite data on May 28, 2020 and May 27, 2021.*

</center>

As of the end of May, the paddy fields filled with water only in 2021 are shown as blue color and the paddy fields filled with water only in 2020 are shown as red color. Many fields are shown in red, which implies that the paddy field filled with water in 2021 drastically　decreased from 2020 due to the shortage of water supplies.

Figures. 7 and 8 show the time-series changes of the Normalized Difference Vegetation Index (NDVI) of each region observed by the optical satellites of GCOM-C (Shikisai), Sentinel-2, and Landsat-8. The increase of NDVI in 2021 was earlier than usual, but not as early as 2020. Therefore, it is estimated that planting and growth will not be as early as in 2020. Water shortages are still ongoing, and it is necessary to continue careful monitoring how water shortage will affect rice growing conditions until harvesting season.

<center> 
<img src="https://raw.githubusercontent.com/eurodatacube/eodash-assets/main/collections/E10c_rice_planting/E10c-Fig7.png" width="50%" >

*a) Colusa county, CA, USA*

<img src="https://raw.githubusercontent.com/eurodatacube/eodash-assets/main/collections/E10c_rice_planting/E10c-Fig8.png" width="50%" >

*b) Glenn county, CA, USA*

<img src="https://raw.githubusercontent.com/eurodatacube/eodash-assets/main/collections/E10c_rice_planting/E10c-Fig9.png" width="50%" >

*c) Yolo county, CA, USA*

*Figure 7: Time-series changes of NDVI (Normalized Difference Vegetation Index) observed by GCOM-C SGLI in paddy fields of Colusa, Glenn, and Yolo counties Looking at purple lines (2021), the increase of NDVI was earlier than usual, but not as early as 2020. Horizontal axis shows "Day of Year" ("1" means January 1st and "365" means December 31st).*

<img src="https://raw.githubusercontent.com/eurodatacube/eodash-assets/main/collections/E10c_rice_planting/E10c-Fig10.png" width="50%">

*a) Sentinel-2*

<img src="https://raw.githubusercontent.com/eurodatacube/eodash-assets/main/collections/E10c_rice_planting/E10c-Fig11.png" width="50%">

*b) Landsat-8*


*Figure 8: Time-series changes of NDVI (Normalized Difference Vegetation Index) observed by Sentinel-2 and Landsat-8 at a specific point (N 39.48284, W122.06556) in Glenn county, CA USA. Looking at the time-series changes over last seven years observed by Sentinel-2 and last nine years observed by Landsat-8, respectively, the timing of rice planting in 2021 was earlier than usual, but not as early as 2020. Horizontal axis shows "Day of Year" ("1" means January 1st and "365" means December 31st).*

</center> 
	
