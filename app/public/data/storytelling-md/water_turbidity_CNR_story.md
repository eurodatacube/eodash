# Water Turbidity from Sentinel-2
High-resolution satellite-based turbidity products from the Multispectral Imager (MSI) aboard the [Copernicus Sentinel-2 satellite mission constellation](https://www.esa.int/Applications/Observing_the_Earth/Copernicus/Sentinel-2) allows analyzing the variability of coastal and inland waters in the upper Adriatic region. The study concentrated on the Po River basin from Ferrara to the river mouth, where freshwater and saltwater interactions create complex hydrodynamic patterns. 
 
<center>
<img src="https://live.staticflickr.com/49/128576787_e26cfba27f_b.jpg" >
	    <figcaption>
      Po River (Turin). Credits: Beppe Zizzi
    </figcaption>
</center>

## Data & Methods

This study was based on 42 cloud-free images from Copernicus Sentinel-2 mission, acquired between 2019 and 2022 (obtained from the [Copernicus Data Space Ecosystem ](https://dataspace.copernicus.eu/) and the [ONDA platform](https://www.onda-dias.eu/cms/). The area of interest, the region from Ferrara to the Po River mouth (covering approximately 3700 km²) overlooks a region of river discharge presenting various hydrodynamic conditions throught the time. Pseudo true-color composites and turbidity maps at 10 m resolution were generated using radiometric calibration and atmospheric correction with [ACOLITE software](https://github.com/acolite/acolite). The composites were derived from water leaving reflectance at specific wavelengths and converted into turbidity using established methods. 

Daily average water discharge data for the Po River at Pontelagoscuro were obtained from the [Environmental Protection Agency of the Region of Emilia Romagna (ARPA-ER)](https://www.arpae.it/it), allowing the  **correlation of discharge with image acquisition dates** . Water level data from Pontelagoscuro and Cavanella stations were acquired from the AIPO website. At Pontelagoscuro, water level is primarily influenced by river discharge, while tidal effects are minimal. Conversely, at Cavanella, tidal influence is significant, with distinguishable ebb and flood phases affecting water level measurements.


## Results I: Water Turbidity and Discharge  <!--{ as="eox-map" mode="tour" }-->
### <!--{ layers='[{"type":"Tile","properties":{"id":"Overlay labels"},"source":{"type":"XYZ","urls":["//s2maps-tiles.eu/wmts/1.0.0/overlay_base_bright_3857/default/g/{z}/{y}/{x}.jpg"]}},{"type":"Tile","properties":{"id":"N3a2_chl_concentration_tri_esa-2024-10-19T00:00:00Z"},"source":{"type":"TileWMS","urls":["https://services.sentinel-hub.com/ogc/wms/0635c213-17a1-48ee-aef7-9d1731695a54"],"params":{"layers":"AWS_N3_CUSTOM_TRILATERAL","styles":"","format":"image/png","time":"2024-10-19T00:00:00Z"}}},{"type":"Tile","properties":{"id":"Terrain light"},"source":{"type":"XYZ","urls":["//s2maps-tiles.eu/wmts/1.0.0/terrain-light_3857/default/g/{z}/{y}/{x}.jpg"]}}]' zoom="8.809187632083866" center=[-9.624996185302738,38.65674144988111] animationOptions={duration:500}}-->
#### Inland-marine water connectivity based on Water Turbidity and Discharge
The Po River's flow rate at the monitoring station averaged 1164 m³/s, ranging between 104 and 8011 cubic meters per second during the study period. The authors established six classification categories for analysis: 'dry conditions' (<500 m³/s), 'low flow' (500-1000 m³/s), 'moderate flow' (1000-2000 m³/s), 'high flow' (2000-4000 m³/s), 'flood stage' (4000-6000 m³/s), and 'extreme flood' (>6000 m³/s).  From the collected imagery, 7 fit in the 'dry conditions' category, 19 to 'low flow', 11 to 'moderate flow', and 5 to 'high flow' events (Figure 1).

<center>
<img src="https://github.com/eurodatacube/eodash-assets/blob/main/stories/water_turbidity_story/water_turbidity_1.png?raw=true" >
	    <figcaption>
      Partitioning of the acquired images within the six discharge ranges based on typical Po River regime
    </figcaption>
</center>


### <!--{ layers='[{"type":"Tile","properties":{"id":"Overlay labels"},"source":{"type":"XYZ","urls":["//s2maps-tiles.eu/wmts/1.0.0/overlay_base_bright_3857/default/g/{z}/{y}/{x}.jpg"]}},{"type":"Tile","properties":{"id":"N3a2_chl_concentration_tri_esa-2024-10-19T00:00:00Z"},"source":{"type":"TileWMS","urls":["https://services.sentinel-hub.com/ogc/wms/0635c213-17a1-48ee-aef7-9d1731695a54"],"params":{"layers":"AWS_N3_CUSTOM_TRILATERAL","styles":"","format":"image/png","time":"2024-10-19T00:00:00Z"}}},{"type":"Tile","properties":{"id":"Terrain light"},"source":{"type":"XYZ","urls":["//s2maps-tiles.eu/wmts/1.0.0/terrain-light_3857/default/g/{z}/{y}/{x}.jpg"]}}]' zoom="10.809187632083866" center=[-8.724996185302738,38.65674144988111] animationOptions={duration:500}}-->
#### Po River delta discharge: October 26, 2019
During the study period, the Po River delta exhibited considerable variation in coastal turbidity patterns, with measurements ranging from clear water to highly turbid conditions (0-400 FNU). The moderate flood event recorded on October 26, 2019 (3862 m³/s) produced substantial sediment transport, with turbidity exceeding 200 FNU throughout the downstream reaches of the river system.

<center>
<img src="https://github.com/eurodatacube/eodash-assets/blob/main/stories/water_turbidity_story/water_turbidity_2.png?raw=true" >
	    <figcaption>
      S2-derived turbidity map for the Po River delta: October 26, 2019
    </figcaption>
</center>


### <!--{ layers='[{"type":"Tile","properties":{"id":"Overlay labels"},"source":{"type":"XYZ","urls":["//s2maps-tiles.eu/wmts/1.0.0/overlay_base_bright_3857/default/g/{z}/{y}/{x}.jpg"]}},{"type":"Tile","properties":{"id":"N3a2_chl_concentration_tri_esa-2024-10-19T00:00:00Z"},"source":{"type":"TileWMS","urls":["https://services.sentinel-hub.com/ogc/wms/0635c213-17a1-48ee-aef7-9d1731695a54"],"params":{"layers":"AWS_N3_CUSTOM_TRILATERAL","styles":"","format":"image/png","time":"2024-10-19T00:00:00Z"}}},{"type":"Tile","properties":{"id":"Terrain light"},"source":{"type":"XYZ","urls":["//s2maps-tiles.eu/wmts/1.0.0/terrain-light_3857/default/g/{z}/{y}/{x}.jpg"]}}]' zoom="9.9809187632083866" center=[-8.724996185302738,38.65674144988111] animationOptions={duration:500}}-->

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

The turbidity maps derived during river regime  **classified as “dry discharge”** are characterized by turbidity values below 100 FNU, in few examples (figure below) it is evident that the turbidity front is significantly displaced upstream respect than higher discharge regimes. This phenomenon can be **attributed to the tidal current propagation and the inland intrusion of seawater** occurring farther upstream.
<center>
<img src="https://github.com/eurodatacube/eodash-assets/blob/main/stories/water_turbidity_story/water_turbidity_5.png?raw=true" >
	    <figcaption>
     S2-derived turbidity maps for the Po River delta related to hourly time series of tidal level measured at Cavanella SIAP station (yellow dot). Vertical red line marks the S2 satellite overpass time. a) August 2, 2021 b) September 10, 2022. 
    </figcaption>
</center>


## Results II: revealing riverdbed 
### Revealing riverbed from satellite during droughts
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



