# Using Earth Observation to Track Urban Indicators: Biodiversity, Heat Islands, Flood Risk, and More

As cities continue to grow and evolve, monitoring urban environments becomes crucial to ensure sustainability and resilience. Earth Observation (EO) plays a pivotal role in tracking a range of key indicators on urban living. From assessing biodiversity and urban heat islands to monitoring flood risk, real estate development, and food security, EO provides valuable insights for urban planning and policy. These indicators are essential for making informed decisions that promote greener, safer, and more livable cities.

The **IDEAS (Indicator Development For Economy And Society)** project developed novel EO-based indicators that address pressing societal challenges. By integrating satellite data with urban sustainability assessments, IDEAS offers scientifically robust tools to help characterise urban environments. Some of these indicators are now integrated into the [**RACE Dashboard (Rapid Action for Citizens with EO)**](race.esa.int), a platform developed by ESA in collaboration with the European Commission. 

IDEAS is a project funded by the European Space Agency ([ESA](www.esa.int)) through its Future-EO Programme.

## Integrated Indicators
The **IDEAS** project leveraged cross-cutting technologies to create innovative, interdisciplinary indicators at European level, with practical relevance for stakeholders. To achieve this, the team used open Earth Observation (EO) and geospatial data, cloud-based EO platforms, and advanced analytical tools. 

The project developed a range of indicators, addressing various societal challenges:

* [Pollution and Urban Heat Islands](https://race.esa.int/?x=2967522.23407&y=6702701.93523&z=5.61664) - (developed by [Murmuration](https://murmuration-sas.com/))
* [Wildlife and Biodiversity](https://race.esa.int/?indicator=IND2_1&x=1001875.41714&y=6402818.2363&z=2.32929) (developed by [Murmuration](https://murmuration-sas.com/))
* [Real Estate Trends](https://race.esa.int/?indicator=IND5_1&x=159447.63774&y=5396118.06247&z=10.31298) (developed by [Murmuration](https://murmuration-sas.com/))
* Food Security - (developed by [SISTEMA](https://www.sistema.at))
* Flood Risk - (developed by [SISTEMA](https://www.sistema.at))

Some of these indicators are now openly available for exploration on the joint ESA-EC [**RACE Dashboard**](race.esa.int). This dashboard aims to showcase the power of Earth Observations to inform on societal global challenges, and since its launch in 2020 it continued to serve as testbed for Open Innovation, with participation of European Industry and citizens.

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
 
## Urban Heat Islands <!--{ as="eox-map" mode="tour" }-->

### <!--{ layers='[{"type":"Tile","properties":{"id":"Overlay labels"},"source":{"type":"XYZ","urls":["//s2maps-tiles.eu/wmts/1.0.0/overlay_base_bright_3857/default/g/{z}/{y}/{x}.jpg"]}},{"type":"WebGLTile","properties":{"id":"Health-Oriented Urban Heat and Pollution Index"},"style":{"variables":{"houhpiMin":0,"houhpiMax":1},"color":["case",["==",["band",1],0],["color",0,0,0,0],["between",["band",1],["var","houhpiMin"],["var","houhpiMax"]],["interpolate",["linear"],["band",1],0,[255,255,255,1],0.02564102564102564,[255,252,239,1],0.05128205128205128,[255,249,223,1],0.07692307692307693,[255,247,207,1],0.10256410256410256,[255,244,191,1],0.1282051282051282,[255,241,175,1],0.15384615384615385,[255,238,159,1],0.1794871794871795,[255,235,143,1],0.20512820512820512,[255,233,128,1],0.23076923076923075,[255,230,112,1],0.2564102564102564,[255,227,96,1],0.28205128205128205,[255,224,80,1],0.3076923076923077,[255,221,64,1],0.3333333333333333,[255,218,48,1],0.358974358974359,[255,216,32,1],0.3846153846153846,[255,213,16,1],0.41025641025641024,[255,210,0,1],0.4358974358974359,[253,191,0,1],0.4615384615384615,[250,172,0,1],0.48717948717948717,[248,153,0,1],0.5128205128205128,[246,134,0,1],0.5384615384615384,[244,115,0,1],0.5641025641025641,[241,95,0,1],0.5897435897435898,[239,76,0,1],0.6153846153846154,[237,57,0,1],0.641025641025641,[235,38,0,1],0.6666666666666666,[232,19,0,1],0.6923076923076923,[230,0,0,1],0.717948717948718,[211,0,0,1],0.7435897435897436,[192,0,0,1],0.7692307692307692,[173,0,0,1],0.7948717948717948,[153,0,0,1],0.8205128205128205,[134,0,0,1],0.8461538461538461,[115,0,0,1],0.8717948717948718,[96,0,0,1],0.8974358974358974,[77,0,0,1],0.923076923076923,[58,0,0,1],0.9487179487179487,[38,0,0,1],0.9743589743589743,[19,0,0,1],1,[0,0,0,1]],["color",0,0,0,0]]},"source":{"type":"GeoTIFF","normalize":false,"sources":[{"url":"https://eox-ideas.s3.eu-central-1.amazonaws.com/indicator1/indicator1_v1_houhpi_Summer_europe_3857_b1.tif"}],"interpolate":false}},{"type":"Tile","properties":{"id":"Terrain light"},"source":{"type":"XYZ","urls":["//s2maps-tiles.eu/wmts/1.0.0/terrain-light_3857/default/g/{z}/{y}/{x}.jpg"]}}]' zoom="4.2" center=[-15.000000000000002,51.45704653062478] animationOptions={duration:500}}-->
#### Health-Oriented Urban Heat and Pollution Index
Urban Heat Islands (UHIs) are areas within cities that experience significantly higher temperatures compared to surrounding rural areas. This phenomenon is primarily caused by modifications in land surfaces and the concentration of heat-absorbing infrastructure. EO data helps track the extent and intensity of UHIs, enabling urban planners to implement strategies such as green spaces, cool roofs, and reflective surfaces to mitigate the effects of excessive heat. The [Health Oriented Urban Heat and air Pollution Indicator (HOUHPI) indicator](https://race.esa.int/?indicator=IND1_1&x=1001875.41714&y=6396443.78992&z=2.32193) is produced by combining four inputs:
* Air pollution
* Urban heat
* Vulnerable population
* Distance to healthcare

<center>
<img src="https://www.esa.int/var/esa/storage/images/esa_multimedia/images/2008/07/profile_of_urban_heat_island/10242545-2-eng-GB/Profile_of_Urban_Heat_Island_pillars.jpg" >
	    <figcaption>
      Profile of Urban Heat Island. In densely built cities with a low percentage of vegetation and water, the temperatures in the heart of the city might, in some cases, be up to 10º C warmer than in the surrounding countryside. Credits: ESA 
    </figcaption>
</center>

**Map legend:**

<img src="https://raw.githubusercontent.com/eurodatacube/eodash-assets/main/collections/IDEAS1_hopi_b1/cm_legend.png" height="50">

Explore this indicator in detail and access more tools such as the range slider to filter out values displayed: [Health Oriented Urban Heat and air Pollution Indicator (HOUHPI) indicator](https://race.esa.int/?indicator=IND1_1&x=1001875.41714&y=6396443.78992&z=2.32193)


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


## Gamification of Indicators: Discovering Insights Through Play
One of the most original and engaging features of the IDEAS indicators is the gamification of environmental data through a Minesweeper-inspired game mode. This interactive approach transforms Earth Observation insights into an engaging, hands-on experience for users of all backgrounds—including those unfamiliar with traditional geospatial tools.

#### How It Works
In the Minesweeper mode, users interactively explore hexagonal fields on a digital map. The goal is to uncover fields containing useful environmental data while avoiding "mine" fields, which represent areas of risk or concern. Each step reveals valuable insights related to the chosen indicator—whether it's air pollution, health impacts, or biodiversity status.

For example, in the Health-Oriented Urban Heat and Pollution Index, mines may represent high-risk pollution zones, while safe tiles provide insights on air quality, heat risk, and healthcare access. Similarly, in the Wildlife Biodiversity Indicator, mines might indicate areas of environmental stress, while uncovered tiles reveal species richness and habitat health.

<center>
  <a href="https://race.esa.int/?indicator=IND5_1&x=159447.63774&y=5396118.06247&z=10.31298" target="_blank" style="text-decoration: none; color: inherit;">
    <img 
      src="https://raw.githubusercontent.com/eurodatacube/eodash-assets/refs/heads/main/stories/IDEAS/race_indicator_view.png"
      alt="RACE dashboard view of Minesweeper mode of Health-Oriented Urban Heat and Pollution Index Indicator">
    <figcaption>
      RACE dashboard view of Minesweeper mode of Heat Risk Indicator
    </figcaption>
  </a>
</center>


#### Why It’s Unique
The gamification feature offers a fresh and engaging way to interact with EO data. Instead of static maps or complex datasets, users can "play" with the data, making discoveries through exploration. This approach lowers the barrier for public engagement while maintaining scientific rigor.

The game runs seamlessly as a plugin (or extension) of [race.esa.int](race.esa.int), leveraging the OpenLayers mapping library. This integration ensures smooth geospatial visualization and data interaction, turning learning into an engaging, hands-on experience.


#### Try It Yourself!

- Play the [Air Pollution & Health Minesweeper game 🌡️💣](https://race.esa.int/?x=2967522.23407&y=6702701.93523&z=5.61664&indicator=IND1_1_minesweeper)
-  Play the [Wildlife & Biodiversity Minesweeper game  🌱💣](https://race.esa.int/?x=2967522.23407&y=6702701.93523&z=5.61664&indicator=IND2_1_minesweeper)

