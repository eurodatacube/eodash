## Mapping floodings
Throughout much of 2024, numerous European countries were affected by severe floods caused by prolonged heavy rains. Several were catastrophic, causing deaths and widespread damage due to overflowing river basins and landslides.
In response to the floods, the [Copernicus Emergency Management Service](https://mapping.emergency.copernicus.eu/) has been activated to produce detailed maps of the affected areas across several countries, including Poland, Germany, Slovakia, Austria, Germany and Italy.

<figure style="text-align: center;">
    <img src="https://www.esa.int/var/esa/storage/images/esa_multimedia/images/2024/10/valencia_flood_disaster/26405663-2-eng-GB/Valencia_flood_disaster_pillars.jpg" 
         alt="  " 
         style="display: block; margin: 0 auto;"
         width="700">
       US Landsat-8 satellite from 8 October and 30 October showing the dramatic transformation of the landscape.Credit: 
        <a href="https://www.esa.int/ESA_Multimedia/Images/2024/10/Valencia_flood_disaster" target="_blank">
             USGS, processed by ESA
        </a>.
    </figcaption>
</figure>

## Earth observations of floods
Earth observation (EO) techniques offer the opportunity to monitor and map to catastrophic events, providing support which would be impossible to achieve through ground-based observations alone, especially in inaccessible areas after the disaster occure. Different EO sensors onboard satellite missions allow to retrieve different but completemntary information. Optical satellites, such as Copernicus-Sentinel-2, Landsat and  MODIS, allow to capture multispectral imagery clearly distinguishing water from land, given the unique spectral signature of water (since it strongly absorbs radiation in the near-infrared and shorwave infrared bands). 
On the other hand, radar missions with syntethic aperture radar aboard such as Copernicus Sentinel-1, RADARSAT, and TerraSAR-X, are unlike optical sensors independent of the conditions of illumination or cloud cover, allowing to monitor the surface in the aftermath of flooding events, becoming and indispensable tool for flood monitoring.  

### The WASDI Platform: streamlining flood analysis
The [WASDI platform](https://www.wasdi.cloud/) represents a significant advancement in Earth observation data processing for flood monitoring. WASDI is a cloud-based workspace designed to simplify the access, processing, and analysis of satellite data for environmental applications, including flood management. The method used to produce flood maps over open area is integrated in an app named [SAR Flood Archive Generator 3.3.4](https://wasdi.readthedocs.io/en/latest/WasdiApplications/SARArchiveGenerator.html). 
It is an automated application designed to process the [Sentinel-1 GRD](https://dataspace.copernicus.eu/explore-data/data-collections/sentinel-data/sentinel-1) archive for a specified Area of Interest (AoI), compiling historical flood maps in open areas. The dataset can be acquired via the [Network of Resources (NoR)](https://nor-discover.org/en/news/) request. 

NoR provides a unique environment for both commercial and non-commercial users to discover via the NoR Portfolio a list European cloud services and estimates of the associated costs to make full use of Earth Observation data. [ESA offers sponsorship](https://nor-discover.org/en/sponsorship/) to eligible entities to cover the costs of trying out the various services. 

##  Flooding datasets <!--{ as="eox-map" mode="tour" }-->
### <!--{ layers='[{"type":"Tile","properties":{"id":"Overlay labels"},"source":{"type":"XYZ","urls":["//s2maps-tiles.eu/wmts/1.0.0/overlay_base_bright_3857/default/g/{z}/{y}/{x}.jpg"]}},{"type":"Tile","properties":{"id":"WASDI_FLOOD-2024-11-30T00:00:00Z"},"source":{"type":"TileWMS","urls":["https://services.sentinel-hub.com/ogc/wms/0635c213-17a1-48ee-aef7-9d1731695a54"],"params":{"layers":"WASDI_FLOOD","styles":"","format":"image/png","time":"2024-11-30T00:00:00Z"}}},{"type":"Tile","properties":{"id":"Terrain light"},"source":{"type":"XYZ","urls":["//s2maps-tiles.eu/wmts/1.0.0/terrain-light_3857/default/g/{z}/{y}/{x}.jpg"]}}]' zoom="11.709821919636315" center=[-0.3296633376550024,39.310304807645764] animationOptions={duration:500}}-->
#### Valencia, Spain 
On 29 October 2024, torrential rain caused by an isolated low-pressure area at high levels brought over a year's worth of precipitation to several areas in eastern Spain, including the Valencian Community, Castilla–La Mancha, and Andalusia.

According to Spain’s national weather agency, [Aemet](https://www.aemet.es/en/portada), on 29 October 2024, Valencia received a year’s worth of rain in just eight hours. This deluge caused devastating flash floods, turning streets into rivers, destroying homes, and sweeping away vehicles. The resulting floodwaters caused the deaths of about 232 people, with three more missing[1] and substantial property damage [2][3]. It is one of the deadliest natural disasters in Spanish history [4].

<figure style="text-align: center;">
    <img src="https://scx2.b-cdn.net/gfx/news/hires/2024/valencia-floods-our-wa.jpg" 
         alt=" " 
         style="display: block; margin: 0 auto;"
         width="500">
    <figcaption>
         Rain and floods caused by the DANA in Valencia on 29 October 2024. Credit:
        <a href="https://x.com/VOSTcvalenciana/status/1851265104735580259" target="_blank">
             VOST Comunitat Valenciana
        </a>.
    </figcaption>
</figure>

**Flood Monitoring in Open Areas**:  The method used to produce flood maps over open area is integrated in the  [SAR Flood Archive Generator 3.3.4](https://wasdi.readthedocs.io/en/latest/WasdiApplications/SARArchiveGenerator.html). This automated application processed the Sentinel-1 GRD archive for the specific area, compiling historical flood maps. The application generates maps for every day for which a Sentinel-1 GRD image is available over the AoI.  Flood detection was performed by analysing intensity values and the output showes flooded (red) and permanent water (blue).

### <!--{ layers='[{"type":"Tile","properties":{"id":"Overlay labels"},"source":{"type":"XYZ","urls":["//s2maps-tiles.eu/wmts/1.0.0/overlay_base_bright_3857/default/g/{z}/{y}/{x}.jpg"]}},{"type":"Tile","properties":{"id":"WASDI_FLOOD-2024-11-30T00:00:00Z"},"source":{"type":"TileWMS","urls":["https://services.sentinel-hub.com/ogc/wms/0635c213-17a1-48ee-aef7-9d1731695a54"],"params":{"layers":"WASDI_FLOOD","styles":"","format":"image/png","time":"2024-11-30T00:00:00Z"}}},{"type":"Tile","properties":{"id":"Terrain light"},"source":{"type":"XYZ","urls":["//s2maps-tiles.eu/wmts/1.0.0/terrain-light_3857/default/g/{z}/{y}/{x}.jpg"]}}]' zoom="11.602153687126457" center=[16.0058194604704,48.33099126051039] animationOptions={duration:500}}-->
#### St Pölten, Austria
During September 2024, a large weather event affected multiple Central European countries, with Austria's eastern region, including St. Pölten (located in Lower Austria) and Vienna taking a particularly hard hit. The water level of the Wien Riever, in the western part of Vienna rose from 50 centimeters to 2.26 metetrs in the course of a day, leading to the flooding of trails, restaurants, streets and river banks. Electricity was cut off in some districts and subway lines were partially closed as result [5](https://www.dw.com/en/europe-floods-parts-of-vienna-without-power-as-river-rises/live-70220078).

The Austrian province surrounding Vienna has been declared a disaster area, with its leaders speaking of "an unprecedented extreme situation". The province which surrounds Vienna, in Austria, has been declared a disaster area by authorities [6](https://www.bbc.com/news/live/cdrjjl3mmy8t).

<figure style="text-align: center;">
    <img src="https://ichef.bbci.co.uk/ace/standard/800/cpsprodpb/vivo/live/images/2024/9/15/1d9752ba-15c7-46f8-b0a8-34facf64ba0e.jpg.webp" 
         alt=" " 
         style="display: block; margin: 0 auto;"
         width="500">
    <figcaption>
         The flooded Wienfluss river in Vienna. Credit:
        <a href="https://www.bbc.com/news/live/cdrjjl3mmy8t" target="_blank">
             BBC News
        </a>.
    </figcaption>
</figure>

**Urban Flood Mapping**: Concerning urban area, a different method was applied. It relies on the information contained in the phase, rather than the intensity used for open area. Flood is detected analyzing the difference of coherence between a pair of 2 pre-event Sentinel-1 SLC images and a pair of 1 pre-event Sentinel-1 SLC image and 1 post-event Sentinel-1 SLC image. This application, named Urban Flood, available in the WASDI platform, needs as a prerequisite the availability of a building map, to constrain the areas where to look for differences of coherence.


## Open Science
#### Explore Flooding extensions Jupyter Notebooks 
You can further explore an example of WASDI dataset relative to the last example,  the floods over St Pölten, Austria, and gather a further insight over this particular area and event, interacting directly with the dataset though the [notebook below](https://github.com/eurodatacube/notebooks/tree/master/notebooks/curated). 
In this example, the notebook allows to overlay flood data on optical imagery (from Copernicus Sentinel-2) allowing fro a more intuituve interpretation of the extents and impacts of the floods. It also calculates affected areas over time, estimating flooded areas and finally it creates an GIF animation of the sequence of flood over time. 


<figure style="text-align: center;">
    <img src="https://github.com/eurodatacube/eodash-assets/blob/AparicioSF-patch-5/stories/Nightlights/nightime_notebook_image.jpg?raw=true" 
         alt=" " 
         style="display: block; margin: 0 auto;"
         width="500">
    <figcaption>
         Jupyter Notebook. Access at:
        <a href="https://github.com/eurodatacube/notebooks/tree/master/notebooks/curated" target="_blank">
             EOdashboard GitHub page
        </a>.
    </figcaption>
</figure>

Besides [acceessing  the notebook](https://github.com/eurodatacube/notebooks/tree/master/notebooks/curated) to analyze flooding extension and area estimation, you can also crosscompare multiyear data over particular locations impacted by floods in 2024 exploring the [Flood mapping indicator](https://race.esa.int/?indicator=WASDI_FLOOD&x=1782387.13181&y=6165318.97613&z=8.18089) available at RACE.ESA.INT.



#### References

*  "Actualización de datos del Gobierno de España" [Spanish Government data update]. La Moncloa (in Spanish). 4 January 2025. Retrieved 4 January 2025.
*  Evans, Holly; Cobham, Tara; Croft, Alex (2 November 2024). "Spain floods latest: 5,000 more soldiers deployed as satellite photos show extent of devastation". The Independent. Retrieved 2 November 2024.
*  Jones, Sam (2 November 2024). "Spain floods: 10,000 troops and police drafted in to deal with disaster". The Guardian. Retrieved 2 November 2024.
*  Mates, James (1 November 2024). "Spain's deadliest floods in decades: Death toll reaches 205 as temporary morgue opens". ITVX. Retrieved 1 November 2024.
* Chini, M., Pelich, R., Pulvirenti, L., Pierdicca, N., Hostache, R., Matgen, P., 2019. Sentinel-1 InSAR coherence to detect floodwater in urban areas: Houston and Hurricane Harvey as a test case. Remote Sensing, 11(2), p.107.
* [WASDI platform](https://www.wasdi.cloud/)
* [Copernicus Emergency Management Service](https://mapping.emergency.copernicus.eu/)  
*  [SAR Flood Archive Generator 3.3.4](https://wasdi.readthedocs.io/en/latest/WasdiApplications/SARArchiveGenerator.html)


#### Contributors
