# Water Turbidity from Sentinel-2
High-resolution satellite-based turbidity products from the Multispectral Imager (MSI) aboard the [Copernicus Sentinel-2 satellite mission constellation](https://www.esa.int/Applications/Observing_the_Earth/Copernicus/Sentinel-2) allows analyzing the variability of coastal and inland waters in the upper Adriatic region. The study concentrated on the Po River basin from Ferrara to the river mouth, where freshwater and saltwater interactions create complex hydrodynamic patterns. 
 
<center>
<img src="https://live.staticflickr.com/49/128576787_e26cfba27f_b.jpg" >
	    <figcaption>
      Po River (Turin). Credits: Beppe Zizzi
    </figcaption>
</center>

## Data & Methods

The study utilized satellite images from both Sentinel-2A and Sentinel-2B satellites, acquired between 2019 and 2022. These images, covering approximately 3700 km² from Ferrara to the Po River mouth, were obtained from the [Copernicus Data Space Ecosystem ](https://dataspace.copernicus.eu/) and the [ONDA platform](https://www.onda-dias.eu/cms/). A total of 42 cloud-free images were selected based on water level and river discharge, representing various hydrodynamic conditions. Pseudo true-color composites and turbidity maps at 10 m resolution were generated using radiometric calibration and atmospheric correction with [ACOLITE software](https://github.com/acolite/acolite). The composites were derived from water leaving reflectance at specific wavelengths and converted into turbidity using established methods. 

Daily average water discharge data for the Po River at Pontelagoscuro were obtained from the [Environmental Protection Agency of the Region of Emilia Romagna (ARPA-ER)](https://www.arpae.it/it), allowing the  **correlation of discharge with image acquisition dates** . Water level data from Pontelagoscuro and Cavanella stations were acquired from the AIPO website. At Pontelagoscuro, water level is primarily influenced by river discharge, while tidal effects are minimal. Conversely, at Cavanella, tidal influence is significant, with distinguishable ebb and flood phases affecting water level measurements.


## Results I: Water Turbidity and Discharge  <!--{ as="eox-map" mode="tour" }-->

### <!--{ layers='[{"type":"Tile","properties":{"id":"Overlay labels"},"source":{"type":"XYZ","urls":["//s2maps-tiles.eu/wmts/1.0.0/overlay_base_bright_3857/default/g/{z}/{y}/{x}.jpg"]}},{"type":"WebGLTile","properties":{"id":"Water turbidity"},"style":{"legend":{"title":"Water discharge","range":["rgba(43, 131, 186, 1)","rgba(171, 221, 164, 1)","rgba(255, 255, 191, 1)","rgba(253,174, 97, 1)","rgba(215, 25, 28, 1)"],"domainProperties":["vmin","vmax"]},"variables":{"vmin":0,"vmax":100},"color":["case",[">",["band",2],0],["interpolate",["linear"],["/",["-",["band",1],["var","vmin"]],["-",["var","vmax"],["var","vmin"]]],0,[43,131,186,1],0.25,[171,221,164,1],0.5,[255,255,191,1],0.75,[253,174,97,1],1,[215,25,28,1]],["color",0,0,0,0]],"jsonform":{"type":"object","title":"Data configuration","properties":{"vminmax":{"title":"Water Turbidity [FNU]","description":"","type":"object","properties":{"vmin":{"type":"number","minimum":0,"maximum":200,"format":"range","default":0},"vmax":{"type":"number","minimum":0,"maximum":200,"format":"range","default":100}},"format":"minmax"}}},"layerId":"water_discharge"},"source":{"type":"GeoTIFF","normalize":false,"sources":[{"url":"https://eox-gtif-public.s3.eu-central-1.amazonaws.com/EOX/S2B_MSI_20220910T101827_T32TQQ_L2W_turbidity_map.tiff"}],"interpolate":false}},{"type":"Tile","properties":{"id":"Terrain light"},"source":{"type":"XYZ","urls":["//s2maps-tiles.eu/wmts/1.0.0/terrain-light_3857/default/g/{z}/{y}/{x}.jpg"]}}]' zoom="11.657417684419967" center=[12.545415335305167,44.97300531424807] animationOptions={duration:500}}-->
#### Inland-marine water connectivity based on Water Turbidity and Discharge
During the study period from 2019 to 2022, the discharge measured at the Pontelagoscuro gauging station ranged from 104 to 8011 m³/s, with a mean value of 1164 m³/s. Six discharge ranges were identified: dry discharge (<500 m³/s); low discharge (500–1000 m³/s); intermediate discharge (1000–2000 m³/s); moderate flood (2000–4000 m³/s); flood (4000–6000 m³/s); extreme flood (>6000 m³/s). The dataset comprised 7 images under dry discharge, 19 under low discharge, 11 under intermediate discharge, and 5 under moderate flow conditions (Figure 1).

<center>
<img src="https://github.com/eurodatacube/eodash-assets/blob/main/stories/water_turbidity_story/water_turbidity_1.png?raw=true" >
	    <figcaption>
      Partitioning of the acquired images within the six discharge ranges based on typical Po River regime
    </figcaption>
</center>



### <!--{ layers='[{"type":"Tile","properties":{"id":"Overlay labels"},"source":{"type":"XYZ","urls":["//s2maps-tiles.eu/wmts/1.0.0/overlay_base_bright_3857/default/g/{z}/{y}/{x}.jpg"]}},{"type":"WebGLTile","properties":{"id":"Water turbidity"},"style":{"legend":{"title":"Water discharge","range":["rgba(43, 131, 186, 1)","rgba(171, 221, 164, 1)","rgba(255, 255, 191, 1)","rgba(253,174, 97, 1)","rgba(215, 25, 28, 1)"],"domainProperties":["vmin","vmax"]},"variables":{"vmin":0,"vmax":100},"color":["case",[">",["band",2],0],["interpolate",["linear"],["/",["-",["band",1],["var","vmin"]],["-",["var","vmax"],["var","vmin"]]],0,[43,131,186,1],0.25,[171,221,164,1],0.5,[255,255,191,1],0.75,[253,174,97,1],1,[215,25,28,1]],["color",0,0,0,0]],"jsonform":{"type":"object","title":"Data configuration","properties":{"vminmax":{"title":"Water Turbidity [FNU]","description":"","type":"object","properties":{"vmin":{"type":"number","minimum":0,"maximum":200,"format":"range","default":0},"vmax":{"type":"number","minimum":0,"maximum":200,"format":"range","default":100}},"format":"minmax"}}},"layerId":"water_discharge"},"source":{"type":"GeoTIFF","normalize":false,"sources":[{"url":"https://eox-gtif-public.s3.eu-central-1.amazonaws.com/EOX/S2B_MSI_20191026T101826_T32TQQ_L2W_turbidity_map.tiff"}],"interpolate":false}},{"type":"Tile","properties":{"id":"Terrain light"},"source":{"type":"XYZ","urls":["//s2maps-tiles.eu/wmts/1.0.0/terrain-light_3857/default/g/{z}/{y}/{x}.jpg"]}}]' zoom="11.057417684419967" center=[12.445415335305167,44.97300531424807] animationOptions={duration:500}}-->
#### Po River delta discharge: October 26, 2019
Turbidity patterns in the coastal area varied widely due to different riverine discharge levels, with turbidity values ranging from 0 to 400 FNU. Moderate flood events led to turbidity values exceeding 200 FNU across the downstream river stretch, notably on October 26, 2019, with a discharge of 3862 m³/s.

<center>
<img src="https://github.com/eurodatacube/eodash-assets/blob/main/stories/water_turbidity_story/water_turbidity_2.png?raw=true" >
	    <figcaption>
      S2-derived turbidity map for the Po River delta: October 26, 2019
    </figcaption>
</center>



### <!--{ layers='[{"type":"Tile","properties":{"id":"Overlay labels"},"source":{"type":"XYZ","urls":["//s2maps-tiles.eu/wmts/1.0.0/overlay_base_bright_3857/default/g/{z}/{y}/{x}.jpg"]}},{"type":"WebGLTile","properties":{"id":"Water turbidity"},"style":{"legend":{"title":"Water discharge","range":["rgba(43, 131, 186, 1)","rgba(171, 221, 164, 1)","rgba(255, 255, 191, 1)","rgba(253,174, 97, 1)","rgba(215, 25, 28, 1)"],"domainProperties":["vmin","vmax"]},"variables":{"vmin":0,"vmax":100},"color":["case",[">",["band",2],0],["interpolate",["linear"],["/",["-",["band",1],["var","vmin"]],["-",["var","vmax"],["var","vmin"]]],0,[43,131,186,1],0.25,[171,221,164,1],0.5,[255,255,191,1],0.75,[253,174,97,1],1,[215,25,28,1]],["color",0,0,0,0]],"jsonform":{"type":"object","title":"Data configuration","properties":{"vminmax":{"title":"Water Turbidity [FNU]","description":"","type":"object","properties":{"vmin":{"type":"number","minimum":0,"maximum":200,"format":"range","default":0},"vmax":{"type":"number","minimum":0,"maximum":200,"format":"range","default":100}},"format":"minmax"}}},"layerId":"water_discharge"},"source":{"type":"GeoTIFF","normalize":false,"sources":[{"url":"https://eox-gtif-public.s3.eu-central-1.amazonaws.com/EOX/S2A_MSI_20220428T101830_T32TQQ_L2W_turbidity_map.tiff"}],"interpolate":false}},{"type":"Tile","properties":{"id":"Terrain light"},"source":{"type":"XYZ","urls":["//s2maps-tiles.eu/wmts/1.0.0/terrain-light_3857/default/g/{z}/{y}/{x}.jpg"]}}]' zoom="12.453695524785632" center=[12.149095646390808,45.01090734150043] animationOptions={duration:500}}-->
#### Intriguing high values: April 28, 2022
An intriguing case occurred on April 28, 2022, with  **notably high turbidity values** (about 350 FNU) despite low discharge (776 m³/s), attributed to rapid relative increases in water discharge and maximum peak tide. 

<center>
<img src=" https://github.com/eurodatacube/eodash-assets/blob/main/stories/water_turbidity_story/water_turbidity_3.png?raw=true" >
	    <figcaption>
      S2-derived turbidity map for the Po River delta related to hourly time series of water level measured at Cavanella and Pontelagoscuro station (yellow dots). Vertical red line marks the S2 satellite overpass time.  April 28, 2022
    </figcaption>
</center>

In several images, it is possible to observe the presence of a well-defined turbidity front along the river channel that results clearly visible under condition of both low and intermediate discharge (Figures A B below). The distance between the river mouths and turbidity fronts mostly depends on the streamflow and tide, that is fundamental in modulating the dispersion of suspended load (Figures C and D).

<center>
<img src="https://github.com/eurodatacube/eodash-assets/blob/main/stories/water_turbidity_story/water_turbidity_4.png?raw=true" >
	    <figcaption>
      S2-derived turbidity maps for the Po River delta related to hourly time series of tidal level measured at Cavanella SIAP station (yellow dot). Vertical red line marks the S2 satellite overpass time. a) September 16, 2019, b) August 21, 2021, c) March 19, 2020, d) January 8, 2022.  
    </figcaption>
</center>

### <!--{ layers='[{"type":"Tile","properties":{"id":"Overlay labels"},"source":{"type":"XYZ","urls":["//s2maps-tiles.eu/wmts/1.0.0/overlay_base_bright_3857/default/g/{z}/{y}/{x}.jpg"]}},{"type":"WebGLTile","properties":{"id":"Water turbidity"},"style":{"legend":{"title":"Water discharge","range":["rgba(43, 131, 186, 1)","rgba(171, 221, 164, 1)","rgba(255, 255, 191, 1)","rgba(253,174, 97, 1)","rgba(215, 25, 28, 1)"],"domainProperties":["vmin","vmax"]},"variables":{"vmin":0,"vmax":100},"color":["case",[">",["band",2],0],["interpolate",["linear"],["/",["-",["band",1],["var","vmin"]],["-",["var","vmax"],["var","vmin"]]],0,[43,131,186,1],0.25,[171,221,164,1],0.5,[255,255,191,1],0.75,[253,174,97,1],1,[215,25,28,1]],["color",0,0,0,0]],"jsonform":{"type":"object","title":"Data configuration","properties":{"vminmax":{"title":"Water Turbidity [FNU]","description":"","type":"object","properties":{"vmin":{"type":"number","minimum":0,"maximum":200,"format":"range","default":0},"vmax":{"type":"number","minimum":0,"maximum":200,"format":"range","default":100}},"format":"minmax"}}},"layerId":"water_discharge"},"source":{"type":"GeoTIFF","normalize":false,"sources":[{"url":"https://eox-gtif-public.s3.eu-central-1.amazonaws.com/EOX/S2B_MSI_20190916T101824_T32TQQ_L2W_turbidity_map.tiff"}],"interpolate":false}},{"type":"Tile","properties":{"id":"Terrain light"},"source":{"type":"XYZ","urls":["//s2maps-tiles.eu/wmts/1.0.0/terrain-light_3857/default/g/{z}/{y}/{x}.jpg"]}}]' zoom="11.100828709765471" center=[12.209424653582563,45.03339674914281] animationOptions={duration:500}}-->
#### Well defined turbidity: September 16, 2019
In several images, it is possible to observe the presence of a well-defined turbidity front along the river channel that results clearly visible under condition of both low and intermediate discharge (Figures A B below). The distance between the river mouths and turbidity fronts mostly depends on the streamflow and tide, that is fundamental in modulating the dispersion of suspended load (Figures C and D).

<center>
<img src="https://github.com/eurodatacube/eodash-assets/blob/main/stories/water_turbidity_story/water_turbidity_4.png?raw=true" >
	    <figcaption>
      S2-derived turbidity maps for the Po River delta related to hourly time series of tidal level measured at Cavanella SIAP station (yellow dot). Vertical red line marks the S2 satellite overpass time. a) September 16, 2019, b) August 21, 2021, c) March 19, 2020, d) January 8, 2022.  
    </figcaption>
</center>

### <!--{ layers='[{"type":"Tile","properties":{"id":"Overlay labels"},"source":{"type":"XYZ","urls":["//s2maps-tiles.eu/wmts/1.0.0/overlay_base_bright_3857/default/g/{z}/{y}/{x}.jpg"]}},{"type":"WebGLTile","properties":{"id":"Water turbidity"},"style":{"legend":{"title":"Water discharge","range":["rgba(43, 131, 186, 1)","rgba(171, 221, 164, 1)","rgba(255, 255, 191, 1)","rgba(253,174, 97, 1)","rgba(215, 25, 28, 1)"],"domainProperties":["vmin","vmax"]},"variables":{"vmin":0,"vmax":100},"color":["case",[">",["band",2],0],["interpolate",["linear"],["/",["-",["band",1],["var","vmin"]],["-",["var","vmax"],["var","vmin"]]],0,[43,131,186,1],0.25,[171,221,164,1],0.5,[255,255,191,1],0.75,[253,174,97,1],1,[215,25,28,1]],["color",0,0,0,0]],"jsonform":{"type":"object","title":"Data configuration","properties":{"vminmax":{"title":"Water Turbidity [FNU]","description":"","type":"object","properties":{"vmin":{"type":"number","minimum":0,"maximum":200,"format":"range","default":0},"vmax":{"type":"number","minimum":0,"maximum":200,"format":"range","default":100}},"format":"minmax"}}},"layerId":"water_discharge"},"source":{"type":"GeoTIFF","normalize":false,"sources":[{"url":"https://eox-gtif-public.s3.eu-central-1.amazonaws.com/EOX/S2B_MSI_20220821T101826_T32TQQ_L2W_turbidity_map.tiff"}],"interpolate":false}},{"type":"Tile","properties":{"id":"Terrain light"},"source":{"type":"XYZ","urls":["//s2maps-tiles.eu/wmts/1.0.0/terrain-light_3857/default/g/{z}/{y}/{x}.jpg"]}}]' zoom="10.10082870976547" center=[12.091195458254502,45.07832392216585] animationOptions={duration:500}}-->
#### Dry discharge: 21 August 2022
The turbidity maps derived during river regime  **classified as “dry discharge”** are characterized by turbidity values below 100 FNU, in few examples (figure below) it is evident that the turbidity front is significantly displaced upstream respect than higher discharge regimes. This phenomenon can be **attributed to the tidal current propagation and the inland intrusion of seawater** occurring farther upstream.
<center>
<img src="https://github.com/eurodatacube/eodash-assets/blob/main/stories/water_turbidity_story/water_turbidity_5.png?raw=true" >
	    <figcaption>
     S2-derived turbidity maps for the Po River delta related to hourly time series of tidal level measured at Cavanella SIAP station (yellow dot). Vertical red line marks the S2 satellite overpass time. a) August 2, 2021 b) September 10, 2022. 
    </figcaption>
</center>

##  Results II: revealing riverdbed  <!--{ as="eox-map" mode="tour" }-->
### <!--{ layers='[{"type":"Tile","properties":{"id":"Overlay labels"},"source":{"type":"XYZ","urls":["//s2maps-tiles.eu/wmts/1.0.0/overlay_base_bright_3857/default/g/{z}/{y}/{x}.jpg"]}},{"type":"WebGLTile","properties":{"id":"Water turbidity"},"style":{"legend":{"title":"Water discharge","range":["rgba(43, 131, 186, 1)","rgba(171, 221, 164, 1)","rgba(255, 255, 191, 1)","rgba(253,174, 97, 1)","rgba(215, 25, 28, 1)"],"domainProperties":["vmin","vmax"]},"variables":{"vmin":0,"vmax":126.39},"color":["case",[">",["band",2],0],["interpolate",["linear"],["/",["-",["band",1],["var","vmin"]],["-",["var","vmax"],["var","vmin"]]],0,[43,131,186,1],0.25,[171,221,164,1],0.5,[255,255,191,1],0.75,[253,174,97,1],1,[215,25,28,1]],["color",0,0,0,0]],"jsonform":{"type":"object","title":"Data configuration","properties":{"vminmax":{"title":"Water Turbidity [FNU]","description":"","type":"object","properties":{"vmin":{"type":"number","minimum":0,"maximum":200,"format":"range","default":0},"vmax":{"type":"number","minimum":0,"maximum":200,"format":"range","default":100}},"format":"minmax"}}},"layerId":"water_discharge"},"source":{"type":"GeoTIFF","normalize":false,"sources":[{"url":"https://eox-gtif-public.s3.eu-central-1.amazonaws.com/EOX/S2B_MSI_20220821T101826_T32TQQ_L2W_turbidity_map.tiff"}],"interpolate":false}},{"type":"Tile","properties":{"id":"EOxCloudless 2021"},"source":{"type":"XYZ","urls":["//s2maps-tiles.eu/wmts/1.0.0/s2cloudless-2021_3857/default/g/{z}/{y}/{x}.jpg"]}}]' zoom="13.262852110237741" center=[11.629098350548825,44.89970026917976] animationOptions={duration:500}}-->
####  Revealing riverbed from satellite during droughts
Summer 2022 was characterized by severe drought, resulting in significantly reduced river water levels (panel A on figure below). High spatial resolution satellite imagery revealed **emerged structures** in the riverbed, indicating **extreme water level reductions** (panels B,C and D in the figure). This highlighted the potential of using high-resolution sensors for detecting water level extremes and estimating bathymetry. Additionally, low river levels posed challenges for navigation, emphasizing the importance of satellite imagery for near real-time detection of shallow areas.

<center>
<img src="https://github.com/eurodatacube/eodash-assets/blob/main/stories/water_turbidity_story/water_turbidity_6.png?raw=true" >
	    <figcaption>
       Panel A: river level from July 18 2022 to September 16 2022. Panel B: turbidity product derived from the satellite image acquired on July 22 2022. Panel C: turbidity product derived from the satellite image acquired on August 21 2022. Panel D: turbidity product derived from the satellite image acquired on September 10 2022.
    </figcaption>
</center>




## AI to further disclose water discharge impacts
### Machine Learning to diagnose the role of water discharge along coast 
Nowadays, machine learning represents an ever-expanding discipline with a lot of applications in several scientific and humanities fields. Ideally an artificial neural network can approximate any type of function without knowing a priori the algorithm that relates the inputs to the desired output. The functioning of a neural network is based on simple processing units called neurons or nodes that, if combined together, can resolve a more complex scenario.
Among neural networks structures, the **Feed-Forward (FNN)** is one the most known and exploited type. Usually an FNN comprises an input layer containing a number of nodes equivalent to the number of inputs, a hidden layer of variable size and an output layer. When there is more than one hidden layer the FNN is called Deep Feed-Forward Neural Network (DFNN).

<center>
<img src="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fi.imgur.com%2F4wn5J16.png&f=1&nofb=1&ipt=423c629f11ca287f8186bb4afc2cff3b509a51489641ef682dc8d2508bc8a5e9&ipo=images" >
	    <figcaption>
       FFNN
    </figcaption>
</center>

A DFNN structure has been used to **predict the anomaly of CHL** from several in-situ and remotely-sensed variables and, in particular, to assess sensitivity of weekly CHL anomaly in response to these variables, and geographical position. **Four sites** have been selected, each characterized by specific dynamical processes. The four synthetic sites have been selected differently, i.e., close to the coast, at the Po River mouth, offshore, and off the Venice Lagoon (figure below).

<center>
<img src="https://github.com/eurodatacube/eodash-assets/blob/main/stories/water_turbidity_story/water_turbidity_7.png?raw=true" >
	    <figcaption>
      The four selected synthetic stations considered for the AI analysis (coordinates are reported in the inner box).
    </figcaption>
</center>

### Importance of inputs

In order to determine the **importance of the input variables on the prediction**, it was used the [SHapley Addictive exPlanation (SHAP)](https://www.sciencedirect.com/topics/computer-science/shapley-additive-explanation) value, which was firstly proposed in the context of the game theory in Shapley (1953) and then was extended to the neural networks (Li et al. 2022, Clare et al. 2022). More in detail, the SHAP values gives an estimate of the contribution of each datapoint to the output according to the combinatorial calculus.

The idea concept is that each feature is considered as a player and the dataset as a team. Each player gives its contribution to the result of the team. The sum of these contributions gives us the value of the target variable given some values of the features (i.e. given a particular record). So, SHAP calculates the impact of every feature to the target variable (called SHAP value) retraining the model over all the combination of features that contains the one we are considering. The average absolute value of the impact of a feature against a target variable can be used as a measure of its importance (Malato, 2021). The **SHAP value has been applied on two networks selected** among the initial four DFNNs. These two, the **AAOT network and the Pila**, were considered representative of contrasting scenarios: offshore and coastal/inshore respectively
The results of the mean absolute SHAP values are given in the figure below:

<center>
<img src="https://github.com/eurodatacube/eodash-assets/blob/main/stories/water_turbidity_story/water_turbidity_8.png?raw=true" >
	    <figcaption>
      SHAP feature importance measured as the mean absolute Shapley values
    </figcaption>
</center>

On the y-axis the inputs are ordered from the more important with higher SHAP value to the less important at the bottom characterized by lower SHAP values. As expected, **CHL is the most important feature for both stations** (AAOT and Pila; figure below). It is followed by the **SST and its anomaly** that contain implicitly information on the water column stratification impacting on nutrients supply from the bottom toward surface. At the AAOT, the wind velocity and its meridional component are placed at high level of the list. This could be related to the high importance of the **wind** in water column mixing and its higher impact on the CHL anomaly at offshore areas instead of inshore ones such as those close to the Po river mouth where other environmental variables can predominate. Observing the chart in the figure, the most evident difference between AAOT and Pila stations is the importance given to the discharge. As expected, **the discharge is the feature that most impacts the Pila station showing a higher importance on the target prediction with respect to the AAOT network**. Finally, the higher importance covered by the remote sensing reflectance at 490 nm at AAOT could be an implicit expression of the **dominance of open ocean water type**, instead of more optically complex waters observed at Pila station, where the reflectance of 510 nm (close to red visible spectrum) prevails.


