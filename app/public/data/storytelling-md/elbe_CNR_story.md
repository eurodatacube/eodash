##  Elbe Estuary Monitoring: Advancing Algorithm Development with Sentinel-3 OLCI Data
The German Bight and the river Elbe estuary are highly impacted by anthropogenic pressures, and, at the same time, comprise a very sensitive ecosystem including the UNESCO World heritage Wadden Sea. The port of Hamburg is the third busiest port in Europe and 15th-largest worldwide. In 2014, 9.73 million TEUs (20-foot standard container equivalents) were handled in Hamburg, all ships passing through the German bight and the river Elbe to reach the port located 110 km distance from the North Sea. Between the coast and the open North Sea, the Wadden Sea is the largest unbroken system of intertidal sand and mud flats in the world. It is a large, temperate, relatively flat coastal wetland environment, formed by the intricate interactions between physical and biological factors that have given rise to a multitude of transitional habitats with tidal channels, sandy shoals, sea-grass meadows, mussel beds, sandbars, mudflats, salt marshes, estuaries, beaches and dunes.  
<figure style="text-align: center;">
    <img src="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Flive.staticflickr.com%2F3802%2F9258706817_01e726225f_b.jpg&f=1&nofb=1&ipt=846927c6a822795c906b4aad99b1bbb9b15ec16d45ebe6fe1dfaf851c6edb64d&ipo=images" width="600"
         alt=" " 
         style="display: block; margin: 0 auto;">
    <figcaption>
     Elbe, Elbsandsteingebirge. Credits: Polybert49 on Flickr
    </figcaption>
</figure>

The German Bight is heavily used for shipping, fisheries, and recently for wind energy: 19 wind parks are already in operation, and another 10 are under construction or planned. In such a heavily used area, marine spatial planning and monitoring of environmental status is of critical importance.



## Elbe  <!--{ as="eox-map" mode="tour" }-->


### <!--{ layers='[{"type":"Tile","properties":{"id":"Overlay labels"},"source":{"type":"XYZ","urls":["//s2maps-tiles.eu/wmts/1.0.0/overlay_base_bright_3857/default/g/{z}/{y}/{x}.jpg"]}},{"type":"Tile","properties":{"id":"N3a2_chl_concentration_tri_esa-2024-10-19T00:00:00Z"},"source":{"type":"TileWMS","urls":["https://services.sentinel-hub.com/ogc/wms/0635c213-17a1-48ee-aef7-9d1731695a54"],"params":{"layers":"AWS_N3_CUSTOM_TRILATERAL","styles":"","format":"image/png","time":"2024-10-19T00:00:00Z"}}},{"type":"Tile","properties":{"id":"Terrain light"},"source":{"type":"XYZ","urls":["//s2maps-tiles.eu/wmts/1.0.0/terrain-light_3857/default/g/{z}/{y}/{x}.jpg"]}}]' zoom="7.645364571374312" center=[8.099967956542969,53.73836436832687] animationOptions={duration:500}}-->
#### Ocean Colour Algorithm
Weekly Chlorophyll (CHL) and Total Suspended Matter (TSM) concentrations rely on Sentinel3-OLCI (A and B) full spatial resolution observations (300 m). 

<center>
<img src="https://ioccg.org/wp-content/uploads/2016/02/sentinel-3.jpg" >
	    <figcaption>
      Copernicus Sentinel-3 satellite.
    </figcaption>
</center>
Daily time series of both OC (i.e., CHL and TSM) products are turned into weekly time series by averaging on a pixel-by-pixel basis. For each pixel the average and standard deviation is computed from a data cube of 3 pixels x 3 pixels x 7 days. This averaging reduces the impact of possible noise, common at these small scales, and increases spatial coverage mined by lack of data mostly due to clouds. Finally, we consider the difference between the “present” weekly observations and the weekly climatology at the scale of the pixel. This difference was judged against the climatology in order to obtain a relative, dimensionless value.




### <!--{ layers='[{"type":"Tile","properties":{"id":"Overlay labels"},"source":{"type":"XYZ","urls":["//s2maps-tiles.eu/wmts/1.0.0/overlay_base_bright_3857/default/g/{z}/{y}/{x}.jpg"]}},{"type":"Tile","properties":{"id":"N3a2_chl_concentration_tri_esa-2024-10-19T00:00:00Z"},"source":{"type":"TileWMS","urls":["https://services.sentinel-hub.com/ogc/wms/0635c213-17a1-48ee-aef7-9d1731695a54"],"params":{"layers":"AWS_N3_CUSTOM_TRILATERAL","styles":"","format":"image/png","time":"2024-10-19T00:00:00Z"}}},{"type":"Tile","properties":{"id":"Terrain light"},"source":{"type":"XYZ","urls":["//s2maps-tiles.eu/wmts/1.0.0/terrain-light_3857/default/g/{z}/{y}/{x}.jpg"]}}]' zoom="8.645364571374312" center=[8.099967956542969,53.73836436832687] animationOptions={duration:500}}-->
#### Weekly Chlorophyll (CHL) concentration maps
Full time series  (from May 2016 – to present date) of weekly Chlorophyll (CHL) concentration maps are collected  of Sentinel3-OLCI data from the Copernicus Marine Service:
[OCEANCOLOUR_ATL_BGC_L3_MY_009_113](https://doi.org/10.48670/moi-00286).

<!-- UNCOMMNET
### <!--{ layers='[{"type":"Tile","properties":{"id":"Overlay labels"},"source":{"type":"XYZ","urls":["//s2maps-tiles.eu/wmts/1.0.0/overlay_base_bright_3857/default/g/{z}/{y}/{x}.jpg"]}},{"type":"Tile","properties":{"id":"N3a2_chl_concentration_tri_esa-2024-10-19T00:00:00Z"},"source":{"type":"TileWMS","urls":["https://services.sentinel-hub.com/ogc/wms/0635c213-17a1-48ee-aef7-9d1731695a54"],"params":{"layers":"AWS_N3_CUSTOM_TRILATERAL","styles":"","format":"image/png","time":"2024-10-19T00:00:00Z"}}},{"type":"Tile","properties":{"id":"Terrain light"},"source":{"type":"XYZ","urls":["//s2maps-tiles.eu/wmts/1.0.0/terrain-light_3857/default/g/{z}/{y}/{x}.jpg"]}}]' zoom="8.945364571374312" center=[8.099967956542969,53.73836436832687] animationOptions={duration:500}}-->
<!-- UNCOMMNET
#### Total Suspended Matter (TSM) concentrations maps
TSM data are specifically produced by [CNR-ISMAR-GOS](https://www.ismar.cnr.it/web-content/) for the ESA-RACE Dashboard starting from Sentinel3-OLCI L2 data distributed by ([EUMETSAT](https://data.eumetsat.int))
OLCI data from 2016 concur with the production of the weekly climatology, which is then used as reference for the analysis.  
-->

### <!--{ layers='[{"type":"Tile","properties":{"id":"Overlay labels"},"source":{"type":"XYZ","urls":["//s2maps-tiles.eu/wmts/1.0.0/overlay_base_bright_3857/default/g/{z}/{y}/{x}.jpg"]}},{"type":"Tile","properties":{"id":"sea_surface_temperature_maps-2024-10-19T00:00:00Z"},"source":{"type":"TileWMS","urls":["https://services.sentinel-hub.com/ogc/wms/0635c213-17a1-48ee-aef7-9d1731695a54"],"params":{"layers":"AWS_VIS_SST_MAPS","styles":"","format":"image/png","time":"2024-10-19T00:00:00Z"}}},{"type":"Tile","properties":{"id":"Terrain light"},"source":{"type":"XYZ","urls":["//s2maps-tiles.eu/wmts/1.0.0/terrain-light_3857/default/g/{z}/{y}/{x}.jpg"]}}]' zoom="8.275536869577046" center=[8.100013732910156,53.79376139840804] animationOptions={duration:500}}-->
#### Sea surface temperature algorithm
The Copernicus Marine [MED-NRT-L4 product](https://data.marine.copernicus.eu/product/SST_MED_SST_L4_NRT_OBSERVATIONS_010_004/description) is operationally produced in near-real time by the CNR-ISMAR-GOS (Italian National Research Council – Institute of Marine Sciences – Group of Satellite Oceanography). 
These products are based on the nighttime images collected by different satellite infrared sensors, currently including e.g. SLSTR-3A/3B on board Sentinel-3, AVHRR on board Metop-B, and VIIRS on board the NOAA-20 and SUOMI satellites. 
1. The first module (M1) downloads the L2 data from external data providers (e.g., EUMETSAT and NASA), 
2. While the second one (M2) performs a remapping over the MED and BS grids and applies specific quality control (QC) procedures. QC is an essential pre-processing step to select the highest quality SST values and remove residual cloudy pixels. 
3. The third module (M3) performs a blending of the selected L2 data providing a daily merged multi-sensor SST field (L3S). The merging is based on a bias adjustment procedure, which currently uses SLSTR-3A as reference sensor, and it is needed to reduce the differences in SST coming from the different types of sensors. 
4. Finally, the fourth module (M4) performs a classical optimal interpolation (OI) method that allows to obtain (from the L3S image) the gap-free (L4) product.
The SST L4 is then obtained at 1/16° resolution as a linear combination of the observations, weighted directly with their correlation to the interpolation point and inversely with their cross-correlation and measurement error. For the ultra-high resolution product, the lower resolution L4 map, properly rebinned on the UHR grid (through a simple bilinear algorithm), is used as first guess for a second interpolation step, where the SST anomalies, estimated now at 1 km, only contain the small scale signals.


### <!--{ layers='[{"type":"Tile","properties":{"id":"Overlay labels"},"source":{"type":"XYZ","urls":["//s2maps-tiles.eu/wmts/1.0.0/overlay_base_bright_3857/default/g/{z}/{y}/{x}.jpg"]}},{"type":"Tile","properties":{"id":"sea_surface_temperature_maps-2024-10-19T00:00:00Z"},"source":{"type":"TileWMS","urls":["https://services.sentinel-hub.com/ogc/wms/0635c213-17a1-48ee-aef7-9d1731695a54"],"params":{"layers":"AWS_VIS_SST_MAPS","styles":"","format":"image/png","time":"2024-10-19T00:00:00Z"}}},{"type":"Tile","properties":{"id":"Terrain light"},"source":{"type":"XYZ","urls":["//s2maps-tiles.eu/wmts/1.0.0/terrain-light_3857/default/g/{z}/{y}/{x}.jpg"]}}]' zoom="9.275536869577046" center=[8.100013732910156,53.79376139840804] animationOptions={duration:500}}-->
#### Sea surface temperature algorithm development
The climatology was built by using the Copernicus MED reprocessed (REP) products: [Mediterranean Sea - High Resolution L4 Sea Surface Temperature Reprocessed](https://doi.org/10.48670/moi-00173) and [Black Sea - High Resolution L4 Sea Surface Temperature Reprocessed](https://data.marine.copernicus.eu/product/SST_BS_SST_L4_REP_OBSERVATIONS_010_022/description), respectively). 

These products provide long-term (1982-present), stable and consistent daily gap-free SST datasets at about 5 km grid resolution, particularly useful for climate applications. Specifically, MED REP SST products are built by optimal interpolation of the lower-level (merged single-sensor, L3C) SST climate data record provided by the [ESA Climate Change Initiative (CCI)](https://climate.esa.int/en/) and the [Copernicus Climate Change Service (C3S](https://climate.copernicus.eu/)) initiatives. 

In order to obtain a consistent dataset with the NRT products, the reprocessed datasets were properly remapped through a bilinear interpolation over a 0.01° regular grid and then cropped to match the four selected areas. RMSD and mean bias for the reprocessed products have been quantified in 0.456 ± 0.001 K and 0.036 ± 0.001 K.

Daily time series of both SST products are turned into weekly time series by averaging on a pixel-by-pixel basis. For each pixel the average and standard deviation is computed from a data cube of 3 pixels x 3 pixels x 7 days. This averaging reduces the impact of possible noise, common at these small scales, and increases spatial coverage mined by lack of data mostly due to clouds. Finally, it was considered the difference between the “present” weekly observations and the weekly climatology at the scale of the pixel. This difference was judged against the climatology in order to obtain a relative, dimensionless value.










## Water quality time series
Chlorophyll-a (CHL) concentration is an indicator of algae abundance which fluctuates naturally over space and time, as a result of combined atmospheric and oceanic effects (e.g., marine currents and upwelling). In coastal areas, strongly influenced by river inputs and human activities, high CHL concentration can result from the discharge of urban sewage, industrial runoffs, and fertilizers from agriculture activities over watersheds. In particular, nutrient inputs of anthropogenic origin affect the natural amount of phytoplankton in marine and inland waters, representing a continuous threat to biodiversity and leading to undesirable modifications of phytoplankton concentration (i.e., eutrophication).

The time series shows weekly CHL concentration offshore the **Elbe Estuary, at the Helgoland** monitoring site (54°09′06″N, 7°53′30″E) as calculated from Sentinel-3 full resolution (250m) data:
* **Green dots** show weekly values lower than the climatological mean (in black), indicating good water quality.
* **Blue dots** show weekly values greater than the climatological mean but still inside the climatological variability, indicating regular water quality.
* **Red dots** stand for values beyond the climatological variability, indicating poorer water quality.

<iframe class="item" src="https://race.esa.int/iframe?poi=DE29-N3" width="800px" height="500px" frameBorder="0" scroll="no" style="overflow:hidden"></iframe>



## Sea surface temperature (SST) Time series
Sea surface temperature (SST) is a key ocean monitoring indicator that allows to track the health of our marine environment. This essential variable is indeed at the base of many physical and bio-geochemical processes: it modulates the flow of heat in and out the upper ocean, contributes in regulating marine ecosystems and responds to climate variability and change. Monitoring of long-term modifications in SST (i.e., trends) is crucial for evaluating the present state of the oceans and to correctly assess the impact of climate change at regional scales. Also, routinely SST observation is increasingly needed to identify anomalously seawater warm events, known as marine heatwaves, that have been intensifying during recent years and can have profound impact on marine ecosystems. 

Here, SST data are derived from the Copernicus Marine Service Atlantic (ATL) near real-time (NRT) SST products, which provides daily optimally interpolated gap-free (level-4, L4) estimates of the foundation SST (the temperature free, or nearly-free, of any diurnal cycle) with a horizontal resolution of 0.02°.
The time series shows weekly SST offshore the **Elbe Estuary, at the Helgoland monitoring site** (54°09′06″N, 7°53′30″E):
* 	**Green dots** show weekly values lower than the climatological mean (in black), indicating cold sea water.
* 	**Blue dots** show weekly values greater than the climatological mean but still inside the climatological variability, indicating regular sea water temperature.
* **Red dots** stand for values beyond the climatological variability, indicating warm sea water.

<iframe class="item" src="https://race.esa.int/iframe?poi=DE29-SST" width="800px" height="500px" frameBorder="0" scroll="no" style="overflow:hidden"></iframe>
