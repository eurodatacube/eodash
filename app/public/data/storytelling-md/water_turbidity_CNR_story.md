# Tracking the Po river from space
The Po River is Italy’s longest and most important watercourse, stretching over 650 kilometers from the Alps to the Adriatic Sea. Its basin supports one of Europe’s most densely populated and agriculturally productive regions, while also sustaining rich ecosystems across wetlands, floodplains, and the dynamic Po Delta.

This river system is shaped by the constant interaction between freshwater discharge and tidal forces from the sea. These interactions influence water quality, sediment transport, and the distribution of suspended materials—collectively described as water turbidity. Understanding how turbidity changes with river flow and sea tides is essential for managing navigation, preserving biodiversity, and responding to extreme events like floods and droughts.

Thanks to high-resolution satellite data from Sentinel-2, scientists can now monitor these changes in great detail. By combining satellite imagery with ground-based measurements and advanced analytical tools, researchers are uncovering how the Po River behaves under different hydrological conditions—revealing patterns that are critical for both environmental protection and water resource management.

 <center>
<img src="https://www.esa.int/var/esa/storage/images/esa_multimedia/images/2019/05/po_valley_italy/19392160-1-eng-GB/Po_Valley_Italy_pillars.jpg" >
</center>

<p style="font-size: 0.85em; text-align: center;">
  Copernicus Sentinel-2 image featuring the Po Valley. This composite image contains several images captured between June 2018 and February 2019. 
  LICENCE: 
  <a href="https://creativecommons.org/licenses/by-sa/3.0/igo/" target="_blank" style="font-size: 0.85em;">CC BY-SA 3.0 IGO</a> 
  or 
  <a href="https://www.esa.int/ESA_Multimedia/Terms_and_conditions_of_use_of_images_and_videos_available_on_the_esa_website" target="_blank" style="font-size: 0.85em;">ESA Standard Licence</a> 
  (content can be used under either licence).
</p>


## Sentinel-2 Data


High-resolution satellite-based turbidity products from the Multispectral Imager (MSI) aboard the [Copernicus Sentinel-2 satellite mission constellation](https://www.esa.int/Applications/Observing_the_Earth/Copernicus/Sentinel-2) enable the analysis of variability in coastal and inland waters in the upper Adriatic region. This study focuses on the Po River basin, from Ferrara to the river mouth, where interactions between freshwater and saltwater create complex hydrodynamic patterns.

Satellite imagery from both Sentinel-2A and Sentinel-2B, acquired between 2019 and 2022, was used in this research. These images, covering approximately 3,700 km² from Ferrara to the Po River mouth, were sourced from the [Copernicus Data Space Ecosystem ](https://dataspace.copernicus.eu/). A total of 42 cloud-free images were selected based on water level and river discharge, representing a range of hydrodynamic conditions. Pseudo true-colour composites and turbidity maps at 10 m resolution were produced using radiometric calibration and atmospheric correction via [ACOLITE software](https://github.com/acolite/acolite). The composites were derived from water-leaving reflectance at specific wavelengths and converted into turbidity using established methods.

Daily average water discharge data for the Po River at Pontelagoscuro were obtained from the [Environmental Protection Agency of the Region of Emilia Romagna (ARPA-ER)](https://www.arpae.it/it), through a dedicated [data access website](https://simc.arpae.it/dext3r/), enabling the correlation of discharge with satellite image acquisition dates. Water level data from **Pontelagoscuro** and **Cavanella** stations were retrieved from the [AIPO website](https://www.agenziapo.it/content/monitoraggio-idrografico-0). At Pontelagoscuro, water levels are primarily influenced by river discharge, with minimal tidal impact. In contrast, at Cavanella, tidal influence is significant, with clear ebb and flood phases affecting water level measurements.

 <center>
<img src="https://github.com/eurodatacube/eodash-assets/blob/main/stories/water_turbidity_story/Gauging_stations.jpg?raw=true" >
</center>

<p style="font-size: 0.85em; text-align: center;">
  Gauging stations at Pontellagoscuro and Cavanella
</p>

During the study period from 2019 to 2022, the discharge measured at the Pontelagoscuro gauging station ranged from 104 to 8011 m³/s, with a mean value of 1164 m³/s. Six discharge ranges were identified: dry discharge (<500 m³/s); low discharge (500–1000 m³/s); intermediate discharge (1000–2000 m³/s); moderate flood (2000–4000 m³/s); flood (4000–6000 m³/s); extreme flood (>6000 m³/s). The dataset comprised 7 images under dry discharge, 19 under low discharge, 11 under intermediate discharge, and 5 under moderate flow conditions (Figure 1).

<center>
<img src="https://github.com/eurodatacube/eodash-assets/blob/main/stories/water_turbidity_story/water_turbidity_1.png?raw=true" height="400">
</center>
<p style="font-size: 0.85em; text-align: center;">
  Partitioning of the acquired images within the six discharge ranges based on typical Po River regime
</p>

## Turbidity and Discharge  <!--{ as="eox-map" mode="tour" }-->
### <!--{ layers='[{"type":"Tile","properties":{"id":"Overlay labels"},"source":{"type":"XYZ","urls":["//s2maps-tiles.eu/wmts/1.0.0/overlay_base_bright_3857/default/g/{z}/{y}/{x}.jpg"]}},{"type":"WebGLTile","properties":{"id":"Water turbidity"},"style":{"legend":{"title":"Water discharge","range":["rgba(43, 131, 186, 1)","rgba(171, 221, 164, 1)","rgba(255, 255, 191, 1)","rgba(253,174, 97, 1)","rgba(215, 25, 28, 1)"],"domainProperties":["vmin","vmax"]},"variables":{"vmin":0,"vmax":200},"color":["case",[">",["band",2],0],["interpolate",["linear"],["/",["-",["band",1],["var","vmin"]],["-",["var","vmax"],["var","vmin"]]],0,[43,131,186,1],0.25,[171,221,164,1],0.5,[255,255,191,1],0.75,[253,174,97,1],1,[215,25,28,1]],["color",0,0,0,0]],"jsonform":{"type":"object","title":"Data configuration","properties":{"vminmax":{"title":"Water Turbidity [FNU]","description":"","type":"object","properties":{"vmin":{"type":"number","minimum":0,"maximum":200,"format":"range","default":0},"vmax":{"type":"number","minimum":0,"maximum":200,"format":"range","default":100}},"format":"minmax"}}},"layerId":"water_discharge"},"source":{"type":"GeoTIFF","normalize":false,"sources":[{"url":"https://eox-gtif-public.s3.eu-central-1.amazonaws.com/EOX/S2B_MSI_20191026T101826_T32TQQ_L2W_turbidity_map.tiff"}],"interpolate":false}},{"type":"Tile","properties":{"id":"EOxCloudless 2021"},"source":{"type":"XYZ","urls":["//s2maps-tiles.eu/wmts/1.0.0/s2cloudless-2021_3857/default/g/{z}/{y}/{x}.jpg"]}}]' zoom="11.836738402906427" center=[12.349744137574094,44.9145339267929] animationOptions={duration:500}}-->
#### S2-derived turbidity map for the Po River delta: October 26, 2019
Turbidity patterns in the coastal area varied widely due to different riverine discharge levels, with turbidity values ranging from 0 to 400 FNU. Moderate flood events led to turbidity values exceeding 200 FNU across the downstream river stretch, notably on October 26, 2019, with a discharge of 3862 m³/s, as illustrated in this map. The full time series spanning 2019-2022 can be explored on the RACE Dashboard [here](https://eodash-testing.eox.at/&indicator=CNR_TUR_1).

<center>
<img src="https://github.com/eurodatacube/eodash-assets/blob/main/stories/water_turbidity_story/water_turbidity_2.png?raw=true" height="400">
</center>
	   <p style="font-size: 0.85em; text-align: center;">
  S2-derived turbidity map for the Po River delta: October 26, 2019. FNU = the Formazin Nephelometric Unit, which indicates water clarity—higher FNU means cloudier water.
</p>


### <!--{ layers='[{"type":"Tile","properties":{"id":"Overlay labels"},"source":{"type":"XYZ","urls":["//s2maps-tiles.eu/wmts/1.0.0/overlay_base_bright_3857/default/g/{z}/{y}/{x}.jpg"]}},{"type":"WebGLTile","properties":{"id":"Water turbidity"},"style":{"legend":{"title":"Water discharge","range":["rgba(43, 131, 186, 1)","rgba(171, 221, 164, 1)","rgba(255, 255, 191, 1)","rgba(253,174, 97, 1)","rgba(215, 25, 28, 1)"],"domainProperties":["vmin","vmax"]},"variables":{"vmin":0,"vmax":200},"color":["case",[">",["band",2],0],["interpolate",["linear"],["/",["-",["band",1],["var","vmin"]],["-",["var","vmax"],["var","vmin"]]],0,[43,131,186,1],0.25,[171,221,164,1],0.5,[255,255,191,1],0.75,[253,174,97,1],1,[215,25,28,1]],["color",0,0,0,0]],"jsonform":{"type":"object","title":"Data configuration","properties":{"vminmax":{"title":"Water Turbidity [FNU]","description":"","type":"object","properties":{"vmin":{"type":"number","minimum":0,"maximum":200,"format":"range","default":0},"vmax":{"type":"number","minimum":0,"maximum":200,"format":"range","default":100}},"format":"minmax"}}},"layerId":"water_discharge"},"source":{"type":"GeoTIFF","normalize":false,"sources":[{"url":"https://eox-gtif-public.s3.eu-central-1.amazonaws.com/EOX/S2A_MSI_20220428T101830_T32TQQ_L2W_turbidity_map.tiff"}],"interpolate":false}},{"type":"Tile","properties":{"id":"EOxCloudless 2021"},"source":{"type":"XYZ","urls":["//s2maps-tiles.eu/wmts/1.0.0/s2cloudless-2021_3857/default/g/{z}/{y}/{x}.jpg"]}}]' zoom="11.836738402906427" center=[12.349744137574094,44.9145339267929] animationOptions={duration:500}}-->
#### Intriguing high values: April 28, 2022
An intriguing case occurred on April 28, 2022, with  **notably high turbidity values** (about 350 FNU) measured at the gauge stations despite low discharge (776 m³/s), attributed to rapid relative increases in water discharge and maximum peak tide. 

<center>
<img src=" https://github.com/eurodatacube/eodash-assets/blob/main/stories/water_turbidity_story/water_turbidity_3.png?raw=true" >
	     <p style="font-size: 0.85em; text-align: center;">
  S2-derived turbidity map for the Po River delta related to hourly time series of water level measured at Cavanella and Pontelagoscuro station (yellow dots). Vertical red line marks the S2 satellite overpass time.  April 28, 2022
</p>
</center>


### <!--{ layers='[{"type":"Tile","properties":{"id":"Overlay labels"},"source":{"type":"XYZ","urls":["//s2maps-tiles.eu/wmts/1.0.0/overlay_base_bright_3857/default/g/{z}/{y}/{x}.jpg"]}},{"type":"WebGLTile","properties":{"id":"Water turbidity"},"style":{"legend":{"title":"Water discharge","range":["rgba(43, 131, 186, 1)","rgba(171, 221, 164, 1)","rgba(255, 255, 191, 1)","rgba(253,174, 97, 1)","rgba(215, 25, 28, 1)"],"domainProperties":["vmin","vmax"]},"variables":{"vmin":0,"vmax":200},"color":["case",[">",["band",2],0],["interpolate",["linear"],["/",["-",["band",1],["var","vmin"]],["-",["var","vmax"],["var","vmin"]]],0,[43,131,186,1],0.25,[171,221,164,1],0.5,[255,255,191,1],0.75,[253,174,97,1],1,[215,25,28,1]],["color",0,0,0,0]],"jsonform":{"type":"object","title":"Data configuration","properties":{"vminmax":{"title":"Water Turbidity [FNU]","description":"","type":"object","properties":{"vmin":{"type":"number","minimum":0,"maximum":200,"format":"range","default":0},"vmax":{"type":"number","minimum":0,"maximum":200,"format":"range","default":100}},"format":"minmax"}}},"layerId":"water_discharge"},"source":{"type":"GeoTIFF","normalize":false,"sources":[{"url":"https://eox-gtif-public.s3.eu-central-1.amazonaws.com/EOX/S2B_MSI_20190916T101824_T32TQQ_L2W_turbidity_map.tiff"}],"interpolate":false}},{"type":"Tile","properties":{"id":"EOxCloudless 2021"},"source":{"type":"XYZ","urls":["//s2maps-tiles.eu/wmts/1.0.0/s2cloudless-2021_3857/default/g/{z}/{y}/{x}.jpg"]}}]' zoom="11.836738402906427" center=[12.349744137574094,44.9145339267929] animationOptions={duration:500}}-->

#### Well defined turbidity along the river
In several images, as is the case of **September 16, 2019** illustrated in the map, it is possible to observe the presence of a well-defined turbidity front along the river channel that results clearly visible under condition of both low and intermediate discharge (Figures A B below). The distance between the river mouths and turbidity fronts mostly depends on the streamflow and tide, that is fundamental in modulating the dispersion of suspended load (Figures C and D).

<center>
<img src="https://github.com/eurodatacube/eodash-assets/blob/main/stories/water_turbidity_story/water_turbidity_4.png?raw=true" >
	     <p style="font-size: 0.85em; text-align: center;">
  S2-derived turbidity maps for the Po River delta related to hourly time series of tidal level measured at Cavanella SIAP station (yellow dot). Vertical red line marks the S2 satellite overpass time. a) September 16, 2019, b) August 21, 2021, c) March 19, 2020, d) January 8, 2022. 
</p>
</center>

### <!--{ layers='[{"type":"Tile","properties":{"id":"Overlay labels"},"source":{"type":"XYZ","urls":["//s2maps-tiles.eu/wmts/1.0.0/overlay_base_bright_3857/default/g/{z}/{y}/{x}.jpg"]}},{"type":"WebGLTile","properties":{"id":"Water turbidity"},"style":{"legend":{"title":"Water discharge","range":["rgba(43, 131, 186, 1)","rgba(171, 221, 164, 1)","rgba(255, 255, 191, 1)","rgba(253,174, 97, 1)","rgba(215, 25, 28, 1)"],"domainProperties":["vmin","vmax"]},"variables":{"vmin":0,"vmax":200},"color":["case",[">",["band",2],0],["interpolate",["linear"],["/",["-",["band",1],["var","vmin"]],["-",["var","vmax"],["var","vmin"]]],0,[43,131,186,1],0.25,[171,221,164,1],0.5,[255,255,191,1],0.75,[253,174,97,1],1,[215,25,28,1]],["color",0,0,0,0]],"jsonform":{"type":"object","title":"Data configuration","properties":{"vminmax":{"title":"Water Turbidity [FNU]","description":"","type":"object","properties":{"vmin":{"type":"number","minimum":0,"maximum":200,"format":"range","default":0},"vmax":{"type":"number","minimum":0,"maximum":200,"format":"range","default":100}},"format":"minmax"}}},"layerId":"water_discharge"},"source":{"type":"GeoTIFF","normalize":false,"sources":[{"url":"https://eox-gtif-public.s3.eu-central-1.amazonaws.com/EOX/S2B_MSI_20220821T101826_T32TQQ_L2W_turbidity_map.tiff"}],"interpolate":false}},{"type":"Tile","properties":{"id":"EOxCloudless 2021"},"source":{"type":"XYZ","urls":["//s2maps-tiles.eu/wmts/1.0.0/s2cloudless-2021_3857/default/g/{z}/{y}/{x}.jpg"]}}]' zoom="11.836738402906427" center=[12.349744137574094,44.9145339267929] animationOptions={duration:500}}-->
#### Dry discharge regime
The turbidity maps derived during the river regime known as **"dry discharge”** observed on **21 August 2022** and shown on the map, are characterized by turbidity values below 100 FNU. In few dates (10 September and 21 August 2022 shown side by side ub figure below) it is evident that the turbidity front is significantly displaced upstream with respect to higher discharge regimes. This phenomenon can be **attributed to the tidal current propagation and the inland intrusion of seawater** occurring farther upstream.
<center>
<img src="https://github.com/eurodatacube/eodash-assets/blob/main/stories/water_turbidity_story/water_turbidity_5.png?raw=true" >
	   <p style="font-size: 0.85em; text-align: center;">
  S2-derived turbidity maps for the Po River delta related to hourly time series of tidal level measured at Cavanella SIAP station (yellow dot). Vertical red line marks the S2 satellite overpass time. a) August 2, 2021 b) September 10, 2022.
</p>
</center>

##  Drought impacts  <!--{ as="eox-map" mode="tour" }-->
### <!--{ layers='[{"type":"Tile","properties":{"id":"Overlay labels"},"source":{"type":"XYZ","urls":["//s2maps-tiles.eu/wmts/1.0.0/overlay_base_bright_3857/default/g/{z}/{y}/{x}.jpg"]}},{"type":"WebGLTile","properties":{"id":"Water turbidity"},"style":{"legend":{"title":"Water discharge","range":["rgba(43, 131, 186, 1)","rgba(171, 221, 164, 1)","rgba(255, 255, 191, 1)","rgba(253,174, 97, 1)","rgba(215, 25, 28, 1)"],"domainProperties":["vmin","vmax"]},"variables":{"vmin":0,"vmax":126.39},"color":["case",[">",["band",2],0],["interpolate",["linear"],["/",["-",["band",1],["var","vmin"]],["-",["var","vmax"],["var","vmin"]]],0,[43,131,186,1],0.25,[171,221,164,1],0.5,[255,255,191,1],0.75,[253,174,97,1],1,[215,25,28,1]],["color",0,0,0,0]],"jsonform":{"type":"object","title":"Data configuration","properties":{"vminmax":{"title":"Water Turbidity [FNU]","description":"","type":"object","properties":{"vmin":{"type":"number","minimum":0,"maximum":200,"format":"range","default":0},"vmax":{"type":"number","minimum":0,"maximum":200,"format":"range","default":100}},"format":"minmax"}}},"layerId":"water_discharge"},"source":{"type":"GeoTIFF","normalize":false,"sources":[{"url":"https://eox-gtif-public.s3.eu-central-1.amazonaws.com/EOX/S2B_MSI_20220821T101826_T32TQQ_L2W_turbidity_map.tiff"}],"interpolate":false}},{"type":"Tile","properties":{"id":"EOxCloudless 2021"},"source":{"type":"XYZ","urls":["//s2maps-tiles.eu/wmts/1.0.0/s2cloudless-2021_3857/default/g/{z}/{y}/{x}.jpg"]}}]' zoom="13.262852110237741" center=[11.629098350548825,44.89970026917976] animationOptions={duration:500}}-->
####  Satellites show riverbed exposure during the 2022 drought

Summer 2022 was characterized by severe drought, resulting in significantly reduced river water levels (panel A on figure below). High spatial resolution satellite imagery revealed **emerged structures** in the riverbed, indicating **extreme water level reductions** (panels B,C and D in the figure). This highlighted the potential of using high-resolution sensors for detecting water level extremes and estimating bathymetry. Additionally, low river levels posed challenges for navigation, emphasizing the importance of satellite imagery for near real-time detection of shallow areas.

<center>
<img src="https://github.com/eurodatacube/eodash-assets/blob/main/stories/water_turbidity_story/water_turbidity_6.png?raw=true" >
	    <p style="font-size: 0.85em; text-align: center;">
  Panel A: river level from July 18 2022 to September 16 2022. Panel B: turbidity product derived from the satellite image acquired on July 22 2022. Panel C: turbidity product derived from the satellite image acquired on August 21 2022. Panel D: turbidity product derived from the satellite image acquired on September 10 2022.
</p>
</center>




## Diagnosing Discharge with AI
 
Nowadays, machine learning is a rapidly growing field with a wide range of applications across both scientific and humanities disciplines. Ideally, an artificial neural network can approximate any type of function without prior knowledge of the algorithm that links the inputs to the desired output. Neural networks operate using simple processing units called neurons or nodes, which, when combined, can solve more complex problems.

Among the various neural network architectures, the **Feed-Forward Neural Network (FNN)** is one of the most well-known and widely used types. Typically, an FNN consists of an input layer with a number of nodes equal to the number of inputs, a hidden layer of variable size, and an output layer. When there is more than one hidden layer, the network is referred to as a **Deep Feed-Forward Neural Network (DFNN)**.

<center>
<img src="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fi.imgur.com%2F4wn5J16.png&f=1&nofb=1&ipt=423c629f11ca287f8186bb4afc2cff3b509a51489641ef682dc8d2508bc8a5e9&ipo=images" >
	    <p style="font-size: 0.85em; text-align: center;">
  Feed-Forward Neural Network (FNN)
</p>
</center>

A DFNN structure has been used to **predict CHL anomalies** based on various in-situ and remotely sensed variables. In particular, the network was used to assess the sensitivity of weekly CHL anomalies to these variables and to geographical location. **Four sites** were selected, each representing distinct dynamic processes. These synthetic sites were strategically chosen to represent different environments: near the coast, at the Po River mouth, offshore, and just outside the Venice Lagoon (see figure below).

<center>
<img src="https://github.com/eurodatacube/eodash-assets/blob/main/stories/water_turbidity_story/water_turbidity_7.png?raw=true" height="500" >
	    <p style="font-size: 0.85em; text-align: center;">
  The four selected synthetic stations considered for the AI analysis (coordinates are reported in the inner box)
</p>
</center>

### Explainable AI

To determine the **importance of input variables in the prediction**, the [SHapley Additive exPlanation (SHAP)](https://www.sciencedirect.com/topics/computer-science/shapley-additive-explanation) method was used. Originally introduced in game theory by Shapley (1953), SHAP has since been adapted for use in neural networks (Li et al., 2022; Clare et al., 2022). In essence, SHAP values estimate the contribution of each data point to the model's output using principles from combinatorial calculus.

The basic idea is that each feature is treated as a player, and the dataset as a team. Each "player" contributes to the team’s result, and the sum of these contributions determines the value of the target variable for a given set of input features. SHAP calculates the impact of each feature on the target variable by retraining the model on all combinations of features that include the one being evaluated. The **average absolute SHAP value** for each feature is then used as a measure of its overall importance (Malato, 2021).

In this study, **SHAP analysis was applied to two networks** selected from the initial four DFNNs: the **AAOT network** and the **Pila network**. These two were chosen to represent contrasting environments—offshore and coastal/inshore, respectively. The results, showing the mean absolute SHAP values, are presented in the figure below:


<center>
<img src="https://github.com/eurodatacube/eodash-assets/blob/main/stories/water_turbidity_story/water_turbidity_8.png?raw=true" >
	    	  <p style="font-size: 0.85em; text-align: center;">
  SHAP feature importance measured as the mean absolute Shapley values
</p>

</center>

On the y-axis, the input variables are ordered from most to least important, based on their SHAP values — with the most influential features at the top and the least at the bottom. As expected, **CHL is the most important feature for both stations** (AAOT and Pila; see figure above). It is followed by **SST and its anomaly**, which implicitly carry information about water column stratification that affects nutrient supply from the bottom to the surface.

At the AAOT site, **wind velocity and its meridional component** are ranked high on the list. This likely reflects the critical role of **wind** in mixing the water column, which has a greater effect on CHL anomalies in offshore areas compared to inshore zones, such as those near the Po River mouth, where other environmental factors tend to dominate.

From the chart, the most notable difference between the AAOT and Pila stations is the importance assigned to **river discharge**. As expected, **discharge is the most influential feature at the Pila station**, showing a much greater impact on target predictions compared to the AAOT network.

Finally, the higher importance of **remote sensing reflectance at 490 nm** at AAOT may indicate the **dominance of open ocean water types**, whereas the **Pila station** reflects more optically complex waters, where the **reflectance at 510 nm** (closer to the red visible spectrum) becomes more relevant.

### Contributors 
Gian Marco Scarpa (CNR-ISMAR), Michela Sammartino (CNR-ISMAR), Federica Braga (CNR-ISMAR), Simone Colella (CNR-ISMAR), Federico Falcini (CNR-ISMAR)

---

Cover image source: <a href="https://commons.wikimedia.org/wiki/File:Torino_-_vista_ponte_Isabella_-_Castello_del_Valentino_e_Mole_Antonelliana.jpg">GJo</a>, <a href="https://creativecommons.org/licenses/by-sa/3.0">CC BY-SA 3.0</a>, via Wikimedia Commons