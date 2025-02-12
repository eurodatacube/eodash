
##

County-level crop yield averages are among the most widely used agricultural indicators, as they are highly valuable to various economic sectors and government institutions. Crop yield data is a crucial input for shaping policies that ensure food security, inform structural economic decisions, and guide market evaluations. Statistical agencies typically release this data at the end of the growing season, after collecting actual figures from producers. While these statistics are vital for assessing the performance of a country's agricultural sector, they reflect only past outcomes.

However, during the growing season, estimates or forecasts of crop yields at the county or regional level can provide highly useful insights. Access to expected yield data by crop type supports better planning, strategy development, and pricing strategies for businesses, while offering real-time input for policymakers and decision-makers.

To generate yield forecasts at a national level during the growing season, CropOM leverages Copernicus data provided by the European Space Agency (ESA), along with meteorological and soil datasets, as part of the [Danube Information Factory](https://www.ddc.cropom.com). Using these data sources and advanced information technology, [CropOM](https://cropom.com)’s CropModel API delivers regional yield predictions for commodity crops under various scenarios.

<center>
	<img src=https://www.ddc.cropom.com/assets/DDC__MAIN-DMAXp7Jk.svg height="300">

Danube Data Cube is a cloud-based platform that integrates data, decisions, and actions. Source: [https://www.ddc.cropom.com](https://www.ddc.cropom.com)
	</center>
	
A demonstration of CropOM's service capabilities is currently featured on the [RACE Dashboard](https://race.esa.int/) to highlight the importance of Copernicus data in monitoring commodity crops. On RACE, we showcase the types of information the service provides and its analytical capabilities at the country, county, and sub-county levels. The complete service is accessible through the ESA [Network of Resources](https://portfolio.nor-discover.org/?textSearch=cropom&filterServiceType=Any&filterSource=Any&filterGeographicalCoverage=Any&filterTemporalPeriodStart=&filterTemporalPeriodEnd=).

The map below illustrates the crop yield indicator for maize, under average scenario conditions. Other crops including soybean, sunflower and wheat, as well as two additional scenarios (best and worst) are [available on the RACE Dashboard](https://race.esa.int/?indicator=CROPOMHU1&x=2193607.25256&y=5996965.74672&z=7.4418).


## Crop Yield <!--{as="eox-map" style="width: 100%; height: 500px;" layers='[{"type":"Tile","properties":{"id":"Overlay labels"},"source":{"type":"XYZ","urls":["//s2maps-tiles.eu/wmts/1.0.0/overlay_base_bright_3857/default/g/{z}/{y}/{x}.jpg"]}},{"type":"Vector","properties":{"id":"Hungary yield"},"style":{"jsonform":{"type":"object","title":"Data configuration","properties":{"crop":{"title":"Crop","type":"string","enum":["Maize","Soybean","Sunflower","Wheat"],"default":"Maize"},"vstat":{"title":"Statistical value","type":"string","enum":["average","best","worst"],"default":"average"},"vminmax":{"title":"Dynamic range","description":"Yield [t/ha]","type":"object","properties":{"vmin":{"type":"number","minimum":0,"maximum":50,"format":"range","default":2},"vmax":{"type":"number","minimum":0,"maximum":50,"format":"range","default":20}},"format":"minmax"}}},"variables":{"crop":"Maize","vstat":"average","vmin":2,"vmax":7.7},"fill-color":["case",["==",["get","yield","Maize","average"],"N/A"],[253,231,37,0.25],["interpolate",["linear"],["/",["-",["get","yield","Maize","average"],2],7.7],0,[68,1,84,1],0.06666666666666667,[70,23,103,1],0.13333333333333333,[71,44,122,1],0.2,[65,63,131,1],0.26666666666666666,[59,81,139,1],0.3333333333333333,[52,97,141,1],0.4,[44,113,142,1],0.4666666666666667,[39,129,142,1],0.5333333333333333,[33,144,141,1],0.6,[39,173,129,1],0.6666666666666666,[66,187,114,1],0.7333333333333333,[92,200,99,1],0.8,[131,210,75,1],0.8666666666666667,[170,220,50,1],0.9333333333333333,[212,226,44,1],1,[253,231,37,1]]],"stroke-color":"black","stroke-width":1,"layerId":"crop_forecast_hu"},"source":{"type":"Vector","url":"https://api.cropom-dev.com/crop_model/regional_forecast?country_code=HU","format":{"type":"GeoJSON","dataProjection":"EPSG:3035"}}},{"type":"Tile","properties":{"id":"Terrain light"},"source":{"type":"XYZ","urls":["//s2maps-tiles.eu/wmts/1.0.0/terrain-light_3857/default/g/{z}/{y}/{x}.jpg"]}}]' zoom="6.69708496650794" center=[19.7,46.75390620626126] }-->

<center>
	<img src="https://raw.githubusercontent.com/eurodatacube/eodash-assets/main/collections/crop_forecast_CropOM/cm_legend.png" height="50">
</center>
	
## 
	
To mitigate the risks posed by climate impacts and droughts, irrigation systems are being developed and implemented on an increasingly widespread scale across Europe. However, these systems can only deliver the promised improvements in crop yield and stability if they have sufficient water supply. The term "sufficient water" is relative, as different crops have varying water requirements for optimal growth. Therefore, understanding crop-specific water demand at a regional level is crucial for planning the development of irrigation systems. This information is equally critical for daily decision-making during droughts, where the allocation of limited water resources must be carefully managed.

Similar to its regional yield forecasting capabilities, CropOM’s Crop Model API provides crop-specific water demand estimates. These estimates indicate the amount of irrigation water needed to achieve maximum potential yield in a region under various climatic scenarios.

## Water Demand <!--{ as="eox-map" mode="tour" }-->

### <!--{ layers='[{"type":"Tile","properties":{"id":"Overlay labels"},"source":{"type":"XYZ","urls":["//s2maps-tiles.eu/wmts/1.0.0/overlay_base_bright_3857/default/g/{z}/{y}/{x}.jpg"]}},{"type":"Vector","properties":{"id":"Hungary water demand"},"style":{"jsonform":{"type":"object","title":"Data configuration","properties":{"crop":{"title":"Crop","type":"string","enum":["Maize","Soybean","Sunflower","Wheat"],"default":"Maize"},"vstat":{"title":"Statistical value","type":"string","enum":["average","best","worst"],"default":"average"},"vminmax":{"title":"Dynamic range","description":"Water need [mm]","type":"object","properties":{"vmin":{"type":"number","minimum":0,"maximum":800,"format":"range","default":0},"vmax":{"type":"number","minimum":0,"maximum":800,"format":"range","default":500}},"format":"minmax"}}},"variables":{"crop":"Maize","vstat":"average","vmin":179.82,"vmax":263.69},"fill-color":["case",["==",["get","water_need","Maize","average"],"N/A"],[253,231,37,0.25],["interpolate",["linear"],["/",["-",["get","water_need","Maize","average"],179.82],263.69],0,[68,1,84,1],0.06666666666666667,[70,23,103,1],0.13333333333333333,[71,44,122,1],0.2,[65,63,131,1],0.26666666666666666,[59,81,139,1],0.3333333333333333,[52,97,141,1],0.4,[44,113,142,1],0.4666666666666667,[39,129,142,1],0.5333333333333333,[33,144,141,1],0.6,[39,173,129,1],0.6666666666666666,[66,187,114,1],0.7333333333333333,[92,200,99,1],0.8,[131,210,75,1],0.8666666666666667,[170,220,50,1],0.9333333333333333,[212,226,44,1],1,[253,231,37,1]]],"stroke-color":"black","stroke-width":1,"layerId":"crop_forecast_hu_water"},"source":{"type":"Vector","url":"https://api.cropom-dev.com/crop_model/regional_forecast?country_code=HU","format":{"type":"GeoJSON","dataProjection":"EPSG:3035"}}},{"type":"Tile","properties":{"id":"Terrain light"},"source":{"type":"XYZ","urls":["//s2maps-tiles.eu/wmts/1.0.0/terrain-light_3857/default/g/{z}/{y}/{x}.jpg"]}}]' zoom="6.69708496650794" center=[19.7,46.75390620626126] animationOptions={duration:500}}-->
#### County Level Forecast
Managing irrigation water to ensure that all food producers have adequate supply for successful operations is primarily a regional responsibility rather than a statewide endeavor. To support regional water management authorities—who have the legal authority and physical access to irrigation channel systems—detailed and precise mapping is essential.

By visualizing the water needs of sub-county regions and highlighting areas where demand is highest, such maps aid decision-making when timely action is critical. Updating these maps daily transforms them into an effective monitoring system, providing decision-makers with real-time information on the water demand of major crop types at the sub-county level.


<center>
	<img src="https://raw.githubusercontent.com/eurodatacube/eodash-assets/main/collections/crop_forecast_CropOM/cm_legend.png" height="50"/>
	
	Map Legend
</center>
<center>
	<img src="https://raw.githubusercontent.com/eurodatacube/eodash-assets/main/stories/RACE/county-water-demand.png"/>
</center>

### <!--{ layers='[{"type":"Tile","properties":{"id":"Overlay labels"},"source":{"type":"XYZ","urls":["//s2maps-tiles.eu/wmts/1.0.0/overlay_base_bright_3857/default/g/{z}/{y}/{x}.jpg"]}},{"type":"Vector","properties":{"id":"Hungary Békés subcounty yield"},"style":{"jsonform":{"type":"object","title":"Data configuration","properties":{"crop":{"title":"Crop","type":"string","enum":["Maize","Soybean","Sunflower","Wheat"],"default":"Maize"},"vstat":{"title":"Statistical value","type":"string","enum":["average","best","worst"],"default":"average"},"vminmax":{"title":"Dynamic range","description":"Yield [t/ha]","type":"object","properties":{"vmin":{"type":"number","minimum":0,"maximum":50,"format":"range","default":2},"vmax":{"type":"number","minimum":0,"maximum":50,"format":"range","default":20}},"format":"minmax"}}},"variables":{"crop":"Maize","vstat":"average","vmin":1.24,"vmax":3.82},"fill-color":["case",["==",["get","yield","Maize","average"],"N/A"],[253,231,37,0.25],["interpolate",["linear"],["/",["-",["get","yield","Maize","average"],1.24],3.82],0,[68,1,84,1],0.06666666666666667,[70,23,103,1],0.13333333333333333,[71,44,122,1],0.2,[65,63,131,1],0.26666666666666666,[59,81,139,1],0.3333333333333333,[52,97,141,1],0.4,[44,113,142,1],0.4666666666666667,[39,129,142,1],0.5333333333333333,[33,144,141,1],0.6,[39,173,129,1],0.6666666666666666,[66,187,114,1],0.7333333333333333,[92,200,99,1],0.8,[131,210,75,1],0.8666666666666667,[170,220,50,1],0.9333333333333333,[212,226,44,1],1,[253,231,37,1]]],"stroke-color":"black","stroke-width":1,"layerId":"crop_forecast_hu_bekes"},"source":{"type":"Vector","url":"https://api.cropom-dev.com/crop_model/regional_forecast?region_code=HU332","format":{"type":"GeoJSON","dataProjection":"EPSG:3035"}}},{"type":"Tile","properties":{"id":"Terrain light"},"source":{"type":"XYZ","urls":["//s2maps-tiles.eu/wmts/1.0.0/terrain-light_3857/default/g/{z}/{y}/{x}.jpg"]}}]' zoom="9.049803408653483" center=[21.049999999999997,46.71545914037338] animationOptions={duration:500}}-->
#### Sub-county Level Forecasting
Yield forecasts are also provided for the same sub-county regions.

<center>
	<img src="https://raw.githubusercontent.com/eurodatacube/eodash-assets/main/collections/crop_forecast_CropOM/cm_legend.png" height="50">
	
	Map Legend
</center>
<center>
	<img src="https://raw.githubusercontent.com/eurodatacube/eodash-assets/main/stories/RACE/subcounty-water-demand.png"/>
</center>

### <!--{ layers='[{"type":"Tile","properties":{"id":"Overlay labels"},"source":{"type":"XYZ","urls":["//s2maps-tiles.eu/wmts/1.0.0/overlay_base_bright_3857/default/g/{z}/{y}/{x}.jpg"]}},{"type":"Vector","properties":{"id":"Hungary Mezőhegyes microregion water demand"},"style":{"jsonform":{"type":"object","title":"Data configuration","properties":{"crop":{"title":"Crop","type":"string","enum":["Maize","Soybean","Sunflower","Wheat"],"default":"Maize"},"vstat":{"title":"Statistical value","type":"string","enum":["average","best","worst"],"default":"average"},"vminmax":{"title":"Dynamic range","description":"Water need [mm]","type":"object","properties":{"vmin":{"type":"number","minimum":0,"maximum":800,"format":"range","default":0},"vmax":{"type":"number","minimum":0,"maximum":800,"format":"range","default":500}},"format":"minmax"}}},"variables":{"crop":"Maize","vstat":"average","vmin":227.74,"vmax":251.71},"fill-color":["case",["==",["get","water_need","Maize","average"],"N/A"],[253,231,37,0.25],["interpolate",["linear"],["/",["-",["get","water_need","Maize","average"],227.74],251.71],0,[68,1,84,1],0.06666666666666667,[70,23,103,1],0.13333333333333333,[71,44,122,1],0.2,[65,63,131,1],0.26666666666666666,[59,81,139,1],0.3333333333333333,[52,97,141,1],0.4,[44,113,142,1],0.4666666666666667,[39,129,142,1],0.5333333333333333,[33,144,141,1],0.6,[39,173,129,1],0.6666666666666666,[66,187,114,1],0.7333333333333333,[92,200,99,1],0.8,[131,210,75,1],0.8666666666666667,[170,220,50,1],0.9333333333333333,[212,226,44,1],1,[253,231,37,1]]],"stroke-color":"black","stroke-width":1,"layerId":"crop_forecast_hu_mezohegyes_water"},"source":{"type":"Vector","url":"https://api.cropom-dev.com/crop_model/regional_forecast?region_code=HU3321","format":{"type":"GeoJSON","dataProjection":"EPSG:3035"}}},{"type":"Tile","properties":{"id":"Terrain light"},"source":{"type":"XYZ","urls":["//s2maps-tiles.eu/wmts/1.0.0/terrain-light_3857/default/g/{z}/{y}/{x}.jpg"]}}]' zoom="10.473578924860789" center=[20.97,46.38803298583869] animationOptions={duration:500}}-->
#### Micro-region level
Moving further down the scale to microregions, which is essentially the level of municipalities, the information can support the operation of companies, and local communities, providing information on the water demand of agriculture for every actor to facilitate informed discussion on water use.
<center>
	<img src="https://raw.githubusercontent.com/eurodatacube/eodash-assets/main/collections/crop_forecast_CropOM/cm_legend.png" height="50">
	
	Map Legend
</center>

## CropOM Model API Service

These indicators are provided as a service by [CropOM](https://cropom.com) - a technology company (SME) that develops data integration platform services and integrated software for agriculture, insurance, and education. 

The data presented on this dashboard is a demonstration of the “Crop Model API” service over selected countries and regions.

To discover the full service and explore the full offering including field level forecasts, please visit ESA’s [Network of Resources](https://portfolio.nor-discover.org/?textSearch=cropom&filterServiceType=Any&filterSource=Any&filterGeographicalCoverage=Any&filterTemporalPeriodStart=&filterTemporalPeriodEnd=).

The DDC (Dynamic Data Cube) Crop Model API is a web-based implementation of the state-of-the-art crop modelling algorithm, [AquaCrop](https://www.fao.org/aquacrop/en/), created by FAO. Crop Model API model measures the actual crop development instead of purely modelling it. Combining crop development time series, high-precision meteorological data, and soil conditions from DDC with the modelling processes of AquaCrop results in a precise crop model specific to a location.

The API takes location, crop type, crop variety, sowing date, and irrigation water application data as user inputs, HR-VPP data from [Copernicus Land Services](https://land.copernicus.eu/en), Meteorological and Soil data from DDC data sources, and retrieves daily crop development (phenology), biomass, water need, and predicted yield data.

## References

* Cover image credits: Wikimedia Commons. LICENCE
[ESA Standard Licence](https://www.esa.int/ESA_Multimedia/Terms_and_conditions_of_use_of_images_and_videos_available_on_the_esa_website) and Additional permission may be required (contact spaceinimages@esa.int for further information)
* [CropOM Crop Model API](https://cropom.com)
* [Danube Information Factory](https://www.ddc.cropom.com)
