##

The integration of **IDEAS (Indicator Development For Economy And Society)**  indicators into [race.esa.int](race.esa.int) represents a significant step forward in leveraging Earth Observation (EO) and geospatial data to address pressing societal and environmental challenges.

## IDEAS contribution to RACE
The **IDEAS (Indicator Development For Economy And Society)** project aimed to leverage cross-cutting technologies to create innovative, interdisciplinary indicators using Earth Observation (EO) and geospatial data. These indicators provide new insights into complex societal challenges by utilizing cloud-based EO platforms, accessible datasets, computational resources, and advanced analytical tools. The objectives were to develop **novel indicators** at a **European level** for integration into various [ESA](www.esa.int)-supported platforms, by linking Earth observation  data with socio-economic processes not directly observable through EO.

The project focused initially on developing, assessing, and validating the indicators. This involved selecting appropriate methodologies, preparing relevant data, and collaborating with stakeholders to ensure practical relevance. The indicators addressed key societal challenges such as **Climate Crisis & Adaptation**, the **Green Transition and the European Green Deal** and  **Emerging Energy Crisis**.

As a result, these were some of the developed indicators:
* [Pollution and Urban Heat Islands](https://race.esa.int/?x=2967522.23407&y=6702701.93523&z=5.61664) - ([Murmuration](https://murmuration-sas.com/))
* [Wildlife and Biodiversity](https://race.esa.int/?indicator=IND2_1&x=1001875.41714&y=6402818.2363&z=2.32929) ([Murmuration](https://murmuration-sas.com/))
* [Real Estate Trends](https://race.esa.int/?indicator=IND5_1&x=159447.63774&y=5396118.06247&z=10.31298) ([Murmuration](https://murmuration-sas.com/))
* Food Security - (SISTEMA)
* Flood Risk - (SISTEMA)

Let's have a look on the first three indicators.These indicators provide tools for understanding and mitigating critical societal and environmental challenges by bridging EO data with actionable socio-economic insights.

## About RACE
The [**RACE (Rapid Action on Climate and Environment)**](race.esa.int) is an ESA-led initiative developed in collaboration with the European Commission. The platform is a cornerstone for delivering actionable insights on environmental, social, and economic transformations, aligned with Europe’s policy priorities, including the European Green Deal. RACE connects advanced EO technology with real-world needs, helping policymakers, researchers, and stakeholders drive sustainable change.

<center>
  <a href="https://race.esa.int" target="_blank" style="text-decoration: none; color: inherit;">
    <img 
      src="https://raw.githubusercontent.com/eurodatacube/eodash-assets/refs/heads/main/stories/IDEAS/RACE_KV_2022.jpg" 
      style="width: 50%" 
      alt="Visit race.esa.int">
    <figcaption>
      Visit race.esa.int
    </figcaption>
  </a>
</center>
 
## Explore the indicators <!--{ as="eox-map" mode="tour" }-->

### <!--{ layers='[{"type":"Tile","properties":{"id":"Overlay labels"},"source":{"type":"XYZ","urls":["//s2maps-tiles.eu/wmts/1.0.0/overlay_base_bright_3857/default/g/{z}/{y}/{x}.jpg"]}},{"type":"WebGLTile","properties":{"id":"Health-Oriented Urban Heat and Pollution Index"},"style":{"variables":{"houhpiMin":0,"houhpiMax":1},"color":["case",["==",["band",1],0],["color",0,0,0,0],["between",["band",1],["var","houhpiMin"],["var","houhpiMax"]],["interpolate",["linear"],["band",1],0,[255,255,255,1],0.02564102564102564,[255,252,239,1],0.05128205128205128,[255,249,223,1],0.07692307692307693,[255,247,207,1],0.10256410256410256,[255,244,191,1],0.1282051282051282,[255,241,175,1],0.15384615384615385,[255,238,159,1],0.1794871794871795,[255,235,143,1],0.20512820512820512,[255,233,128,1],0.23076923076923075,[255,230,112,1],0.2564102564102564,[255,227,96,1],0.28205128205128205,[255,224,80,1],0.3076923076923077,[255,221,64,1],0.3333333333333333,[255,218,48,1],0.358974358974359,[255,216,32,1],0.3846153846153846,[255,213,16,1],0.41025641025641024,[255,210,0,1],0.4358974358974359,[253,191,0,1],0.4615384615384615,[250,172,0,1],0.48717948717948717,[248,153,0,1],0.5128205128205128,[246,134,0,1],0.5384615384615384,[244,115,0,1],0.5641025641025641,[241,95,0,1],0.5897435897435898,[239,76,0,1],0.6153846153846154,[237,57,0,1],0.641025641025641,[235,38,0,1],0.6666666666666666,[232,19,0,1],0.6923076923076923,[230,0,0,1],0.717948717948718,[211,0,0,1],0.7435897435897436,[192,0,0,1],0.7692307692307692,[173,0,0,1],0.7948717948717948,[153,0,0,1],0.8205128205128205,[134,0,0,1],0.8461538461538461,[115,0,0,1],0.8717948717948718,[96,0,0,1],0.8974358974358974,[77,0,0,1],0.923076923076923,[58,0,0,1],0.9487179487179487,[38,0,0,1],0.9743589743589743,[19,0,0,1],1,[0,0,0,1]],["color",0,0,0,0]]},"source":{"type":"GeoTIFF","normalize":false,"sources":[{"url":"https://eox-ideas.s3.eu-central-1.amazonaws.com/indicator1/indicator1_v1_houhpi_Summer_europe_3857_b1.tif"}],"interpolate":false}},{"type":"Tile","properties":{"id":"Terrain light"},"source":{"type":"XYZ","urls":["//s2maps-tiles.eu/wmts/1.0.0/terrain-light_3857/default/g/{z}/{y}/{x}.jpg"]}}]' zoom="4.2" center=[-15.000000000000002,51.45704653062478] animationOptions={duration:500}}-->
#### Health-Oriented Urban Heat and Pollution Index
Anthropic-induced pollution and climate change consequences as extreme heat waves, makes it essential to develop efficient health indicators. The [Health Oriented Urban Heat and air Pollution Indicator (HOUHPI) indicator](https://race.esa.int/?indicator=IND1_1&x=1001875.41714&y=6396443.78992&z=2.32193) is produced by combining four inputs:
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
Try out this game on [race.esa.int🌡️💣](https://race.esa.int/?indicator=IND1_1_minesweeper&x=2967522.23407&y=6702701.93523&z=5.61664)



### <!--{ layers='[{"type":"Tile","properties":{"id":"Overlay labels"},"source":{"type":"XYZ","urls":["//s2maps-tiles.eu/wmts/1.0.0/overlay_base_bright_3857/default/g/{z}/{y}/{x}.jpg"]}},{"type":"WebGLTile","properties":{"id":"Heat Risk Indicator"},"style":{"variables":{"urban_heatMin":0,"urban_heatMax":6},"color":["case",["between",["band",1],["var","urban_heatMin"],["var","urban_heatMax"]],["interpolate",["linear"],["band",1],0,[255,255,255,1],0.15384615384615385,[255,252,239,1],0.3076923076923077,[255,249,223,1],0.46153846153846156,[255,247,207,1],0.6153846153846154,[255,244,191,1],0.7692307692307693,[255,241,175,1],0.9230769230769231,[255,238,159,1],1.076923076923077,[255,235,143,1],1.2307692307692308,[255,233,128,1],1.3846153846153846,[255,230,112,1],1.5384615384615385,[255,227,96,1],1.6923076923076925,[255,224,80,1],1.8461538461538463,[255,221,64,1],2,[255,218,48,1],2.153846153846154,[255,216,32,1],2.307692307692308,[255,213,16,1],2.4615384615384617,[255,210,0,1],2.6153846153846154,[253,191,0,1],2.769230769230769,[250,172,0,1],2.9230769230769234,[248,153,0,1],3.076923076923077,[246,134,0,1],3.230769230769231,[244,115,0,1],3.384615384615385,[241,95,0,1],3.5384615384615388,[239,76,0,1],3.6923076923076925,[237,57,0,1],3.8461538461538463,[235,38,0,1],4,[232,19,0,1],4.153846153846154,[230,0,0,1],4.307692307692308,[211,0,0,1],4.461538461538462,[192,0,0,1],4.615384615384616,[173,0,0,1],4.769230769230769,[153,0,0,1],4.923076923076923,[134,0,0,1],5.0769230769230775,[115,0,0,1],5.230769230769231,[96,0,0,1],5.384615384615385,[77,0,0,1],5.538461538461538,[58,0,0,1],5.6923076923076925,[38,0,0,1],5.846153846153847,[19,0,0,1],6,[0,0,0,1]],["color",0,0,0,0]]},"source":{"type":"GeoTIFF","normalize":false,"sources":[{"url":"https://eox-ideas.s3.eu-central-1.amazonaws.com/indicator5/final_Real-Estate_output_France_4326.tif"}],"interpolate":false}},{"type":"Tile","properties":{"id":"Terrain light"},"source":{"type":"XYZ","urls":["//s2maps-tiles.eu/wmts/1.0.0/terrain-light_3857/default/g/{z}/{y}/{x}.jpg"]}}]' zoom="13.38599767285079" center=[1.3427525836241983,43.59664161740773] animationOptions={duration:500}}-->
#### Heat Risk Indicator
The [Heat Risk indicator](https://race.esa.int/?indicator=IND5_1&x=159447.63774&y=5396118.06247&z=10.31298) is a combination of satellite and field data. For satellite data, the land surface temperature measured from [Landsat 8/9](https://www.usgs.gov/landsat-missions/landsat-8) is used. It allows to identify the warmer areas in the city.
<center>
<img src="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fc1.staticflickr.com%2F3%2F2493%2F4027763485_9570dd5f07_b.jpg&f=1&nofb=1&ipt=4ead775e186bd6e3f34a5ce6d3d530f5297713eb7cff8bdcebad78e6bfebea83&ipo=images" >
	    <figcaption>
      Urban heat island. Credis: Dustin Phillips | Flickr
    </figcaption>
</center>


For field data, the [French National Database of Buildings](https://www.spaceclimateobservatory.org/sat4bdnb) is used. It gather information about thousands of building in France. It includes the energy efficiency report, which provides information on the quality of insulation in homes, and economic statistics such as the price per m², which is used as an indicator to classify areas into rich and poor categories.
For data interpretation, the values range from 1 to 6, with 6 representing the highest-risk areas, characterized by poor insulation or LST and a vulnerable population (elderly and economically disadvantaged). 

Explore this dataset at [race.esa.int🔍](https://race.esa.int/?indicator=IND5_1&x=159447.63774&y=5396118.06247&z=10.31298) and play with the filters in the Analysis panel.


### <!--{ layers='[{"type":"WebGLTile","properties":{"id":"Wildlife Biodiversity Indicator"},"style":{"variables":{"wildlifeMin":0.25,"wildlifeMax":5,"road_pressure_indicatorMin":-1,"road_pressure_indicatorMax":5,"species_count_quintileMin":0,"species_count_quintileMax":5,"vegetationMin":0,"vegetationMax":5},"color":["case",["all",["between",["band",1],["var","wildlifeMin"],["var","wildlifeMax"]],["between",["band",2],["var","road_pressure_indicatorMin"],["var","road_pressure_indicatorMax"]],["between",["band",3],["var","species_count_quintileMin"],["var","species_count_quintileMax"]],["between",["band",4],["var","vegetationMin"],["var","vegetationMax"]]],["interpolate",["linear"],["band",1],0,[253,231,37,1],0.19230769230769232,[225,227,41,1],0.38461538461538464,[198,224,46,1],0.576923076923077,[170,220,50,1],0.7692307692307693,[144,213,66,1],0.9615384615384616,[118,207,83,1],1.153846153846154,[92,200,99,1],1.3461538461538463,[79,193,107,1],1.5384615384615385,[66,187,114,1],1.7307692307692308,[52,180,122,1],1.9230769230769231,[39,173,129,1],2.1153846153846154,[37,163,133,1],2.307692307692308,[35,154,137,1],2.5,[33,144,141,1],2.6923076923076925,[37,134,141,1],2.8846153846153846,[40,123,142,1],3.076923076923077,[44,113,142,1],3.2692307692307696,[49,102,141,1],3.4615384615384617,[54,92,140,1],3.653846153846154,[59,81,139,1],3.8461538461538463,[62,72,135,1],4.038461538461538,[65,63,131,1],4.230769230769231,[68,53,126,1],4.423076923076923,[71,44,122,1],4.615384615384616,[70,30,109,1],4.807692307692308,[69,15,97,1],5,[68,1,84,1]],["color",0,0,0,0]]},"source":{"type":"GeoTIFF","normalize":false,"sources":[{"url":"https://eox-ideas.s3.eu-central-1.amazonaws.com/indicator2/AR3_wildlife.tif"}],"interpolate":false}},{"type":"Tile","properties":{"id":"Terrain light"},"source":{"type":"XYZ","urls":["//s2maps-tiles.eu/wmts/1.0.0/terrain-light_3857/default/g/{z}/{y}/{x}.jpg"]}}]' zoom="4.2" center=[-15.000000000000002,51.68402442383757] animationOptions={duration:500}}-->

#### Wildlife Biodiversity Indicator
The [Wildlife Biodiversity Indicator](https://race.esa.int/?indicator=IND2_1&x=1001875.41714&y=6402818.2363&z=2.32929) has been developed to be a powerful, impacting, visual indicator to help build the general public’s knowledge and raise awareness around the current status of biodiversity and the importance of conservation efforts. 

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
Try out this game on [race.esa.int🌱💣](https://race.esa.int/?indicator=IND2_1_minesweeper&x=2967522.23407&y=6702701.93523&z=5.61664)


## Gamification of Indicators: Discovering Insights Through Play
One of the most original and engaging features of the IDEAS indicators is their integration with a classic Minesweeper-inspired game mode. This gamification approach merges old-school gameplay with the power of Earth Observation (EO) to provide meaningful insights into critical societal topics, such as air pollution, health, wildlife, and biodiversity.

#### How It Works
In this Minesweeper mode, users interactively explore hexagonal fields on a map. The goal is to uncover fields and reveal valuable data while avoiding “mine” fields that symbolize areas with potential environmental risks or challenges. Each successful step reveals insights tied to the chosen indicator—whether it’s air quality, health impacts, or biodiversity.
<center>
  <a href="https://race.esa.int/?indicator=IND5_1&x=159447.63774&y=5396118.06247&z=10.31298" target="_blank" style="text-decoration: none; color: inherit;">
    <img 
      src="https://raw.githubusercontent.com/eurodatacube/eodash-assets/refs/heads/main/stories/IDEAS/race_indicator_view.png"
      style="width: 50%" 
      alt="RACE dashboard view of Minesweeper mode of Health-Oriented Urban Heat and Pollution Index Indicator">
    <figcaption>
      RACE dashboard view of Minesweeper mode of Heat Risk Indicator
    </figcaption>
  </a>
</center>

The game runs seamlessly as a plugin (or extension) of [race.esa.int](race.esa.int), leveraging the OpenLayers mapping library. This integration ensures smooth geospatial visualization and data interaction, turning learning into an engaging, hands-on experience.

#### Why It’s Unique
The originality lies in how this feature combines the nostalgic feel of Minesweeper with real-world, satellite-supported data analysis. While players enjoy the familiar gameplay mechanics, they simultaneously uncover meaningful, actionable insights derived from EO data. This innovative approach bridges the gap between technology, learning, and play. This playful yet purposeful application of gamification offers a new way to engage with satellite data, fostering awareness and understanding of societal challenges through a creative and interactive lens.
- Explore air pollution and health insights:  [race.esa.int🌡️💣](https://race.esa.int/?x=2967522.23407&y=6702701.93523&z=5.61664&indicator=IND1_1_minesweeper)
-  Discover wildlife and biodiversity insights: [race.esa.int🌱💣](https://race.esa.int/?x=2967522.23407&y=6702701.93523&z=5.61664&indicator=IND2_1_minesweeper)

