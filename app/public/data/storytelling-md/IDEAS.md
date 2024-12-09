
## IDEAS: Indicator Development For Economy And Society
The **IDEAS (Indicator Development For Economy And Society)** project aimed to leverage cross-cutting technologies to create innovative, interdisciplinary indicators using Earth Observation (EO) and geospatial data. These indicators provide new insights into complex societal challenges by utilizing cloud-based EO platforms, accessible datasets, computational resources, and advanced analytical tools. The objectives were to develop **novel indicators** at a **European leve**l for integration into various [ESA](www.esa.int)-supported platforms.
Utilization of Technology: Enhance the value and innovation of these indicators by linking EO data with socio-economic processes not directly observable through EO.

The project focused initially on developing, assessing, and validating the indicators. This involved selecting appropriate methodologies, preparing relevant data, and collaborating with stakeholders to ensure practical relevance. The indicators addressed key societal challenges such as **Climate Crisis & Adaptation**, the **Green Transition and the European Green Deal** and  **Emerging Energy Crisis**.

As a result, these were some of the developed indicators:
* [Pollution and Urban Heat Islands](https://eodash-staging.eox.at/?catalog=ideas-data-addition&indicator=IND1_1&x=1001875.41714&y=6858580.88283&z=2.98626) - ([Murmuration](https://murmuration-sas.com/))
* [Wildlife and Biodiversity](https://eodash-staging.eox.at/?catalog=ideas-data-addition&indicator=IND2_1&x=1001875.41714&y=6858580.88283&z=2.98626) ([Murmuration](https://murmuration-sas.com/))
* [Real Estate Trends](https://eodash-staging.eox.at/?catalog=ideas-data-addition&indicator=IND5_1&x=159447.63774&y=5397590.29524&z=10.82567) ([Murmuration](https://murmuration-sas.com/))
*  [Food Security](https://eodash-trilateral-staging.eox.at/explore?catalog=ideas-data-addition&indicator=IND3_1&x=2782987.26983&y=939302.89999&z=2.49185) (SISTEMA)
* [Flood Risk](https://eodash-trilateral-staging.eox.at/explore?catalog=ideas-data-addition&indicator=IND4_1&x=1575214.26499&y=4473751.30216&z=7.15347) (SISTEMA)

Let's have a look on the first three indicators.These indicators provide tools for understanding and mitigating critical societal and environmental challenges by bridging EO data with actionable socio-economic insights.

## Map Tour Example <!--{ as="eox-map" mode="tour" }-->

### <!--{ layers='[{"type":"Tile","properties":{"id":"Overlay labels"},"source":{"type":"XYZ","urls":["//s2maps-tiles.eu/wmts/1.0.0/overlay_base_bright_3857/default/g/{z}/{y}/{x}.jpg"]}},{"type":"Tile","properties":{"id":"Terrain light"},"source":{"type":"XYZ","urls":["//s2maps-tiles.eu/wmts/1.0.0/terrain-light_3857/default/g/{z}/{y}/{x}.jpg"]}}]' zoom="4.556091442062867" center=[11.808883076498274,50.12749237675618] animationOptions={duration:500}}-->
#### Health-Oriented Urban Heat and Pollution Index
Anthropic-induced pollution and climate change consequences as extreme heat waves, makes it essential to develop efficient health indicators. The [Health Oriented Urban Heat and air Pollution Indicator (HOUHPI) indicator]((https://eodash-staging.eox.at/?catalog=ideas-data-addition&indicator=IND1_1&x=2215010.89618&y=7560686.82923&z=3.46398)) is produced by combining four inputs:
* Air pollution
* Urban heat
* Vulnerable population
* Distance to healthcare

<center>
<img src="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fwww.architetturaecosostenibile.it%2Fimages%2Fstories%2F2014%2Fcombattere-isole-calore-b.jpg&f=1&nofb=1&ipt=be519d4e43b5a88d3f6d655b0e0a5e137859683ab96bf9da689dc245087683ba&ipo=images" >
	    <figcaption>
      Fighting heat island. Credits: architetturaecosostenibilie.it
    </figcaption>
</center>


On the map white and yellow mean low risk on health , dark red means high risk on health. In the Analysis panel below you ca use the range slider to filter out values displayed.

#### Gamification of indicators
For this indicator, there is a dedicated 'Minesweeper' mode where insights into air pollution and health respectively, can be playfully discovered by slowly and carefully uncovering hexagonal fields while avoiding *"mine" fields*. The game is implemented as a plugin (or extension) of eodash and works directly with
OpenLayers under the hood.
Try out this game on [race.esa.int🌡️💣](https://eodash-staging.eox.at/?catalog=ideas-data-addition&x=184547.61308&y=4667321.36174&z=6.75861&indicator=IND1_1_minesweeper)



### <!--{ layers='[{"type":"Tile","properties":{"id":"Overlay labels"},"source":{"type":"XYZ","urls":["//s2maps-tiles.eu/wmts/1.0.0/overlay_base_bright_3857/default/g/{z}/{y}/{x}.jpg"]}},{"type":"Tile","properties":{"id":"Terrain light"},"source":{"type":"XYZ","urls":["//s2maps-tiles.eu/wmts/1.0.0/terrain-light_3857/default/g/{z}/{y}/{x}.jpg"]}}]' zoom="10.825672338356757" center=[1.4323425000000007,43.55992546236584] animationOptions={duration:500}}-->
#### Heat Risk Indicator
This indicator is a combination of satellite and field data. For satellite data, the land surface temperature measured from [Landsat 8/9](https://www.usgs.gov/landsat-missions/landsat-8) is used. It allows to identify the warmer areas in the city.
<center>
<img src="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fc1.staticflickr.com%2F3%2F2493%2F4027763485_9570dd5f07_b.jpg&f=1&nofb=1&ipt=4ead775e186bd6e3f34a5ce6d3d530f5297713eb7cff8bdcebad78e6bfebea83&ipo=images" >
	    <figcaption>
      Urban heat island. Credis: Dustin Phillips | Flickr
    </figcaption>
</center>



For field data, the [French National Database of Buildings](https://www.spaceclimateobservatory.org/sat4bdnb) is used. It gather information about thousands of building in France. It includes the energy efficiency report, which provides information on the quality of insulation in homes, and economic statistics such as the price per m², which is used as an indicator to classify areas into rich and poor categories.
For data interpretation, the values range from 1 to 6, with 6 representing the highest-risk areas, characterized by poor insulation or LST and a vulnerable population (elderly and economically disadvantaged). 

Explore this dataset at [race.esa.int🔍](https://eodash-staging.eox.at/?catalog=ideas-data-addition&indicator=IND5_1&x=159447.63774&y=5397590.29524&z=10.82567) and play with the filters in the Analysis panel.


### <!--{ layers='[{"type":"Tile","properties":{"id":"Terrain light"},"source":{"type":"XYZ","urls":["//s2maps-tiles.eu/wmts/1.0.0/terrain-light_3857/default/g/{z}/{y}/{x}.jpg"]}}]' zoom="4.767714633767641" center=[15.486783558567454,64.53089148928188] animationOptions={duration:500}}-->
#### Wildlife Biodiversity Indicator
This indicator has been developed to be a powerful, impacting, visual indicator to help build the general public’s knowledge and raise awareness around the current status of biodiversity and the importance of conservation efforts. 

<center>
<img src="https://api.gbif.org/v1/image/unsafe/480x480/http:%2F%2Fimages.ctfassets.net%2Fuo17ejk9rkwj%2F3XIFYv7n3XJMNLbZkNLKRq%2F6bc385472038cbd72071e81d6b284c06%2FSenna_reticulata.jpg" >
	    <figcaption>
     Biodiversity. Credis: GBIF
    </figcaption>
</center>


The indicator will build on crowdsourced fauna and flora observation data available from the [GBIF (Global Biodiversity Information Facility)](https://www.gbif.org/). In addition to observation data on species, it is possible to retrieve their occurrences and evolution of population over time. Coupling this crowdsourced data with the IUCN red list of endangered species as well as the monitoring of the target habitats’ health allows to build a clear message and narrative to raise the general public’s awareness towards this essential topic. 

#### Gamification of indicators
For this indicator, there is a dedicated 'Minesweeper' mode where insights into wildlife and biodiversity respectively, can be playfully discovered by slowly and carefully uncovering hexagonal fields while avoiding *"mine" fields* . The game is implemented as a plugin (or extension) of eodash and works directly with
OpenLayers under the hood.
Try out this game on [race.esa.int🌱💣](https://eodash-staging.eox.at/?catalog=ideas-data-addition&x=184547.61308&y=4667321.36174&z=6.75861&indicator=IND1_1_minesweeper)


