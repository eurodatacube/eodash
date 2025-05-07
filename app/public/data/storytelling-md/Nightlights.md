## Nighlights

At night, the surface of our planet, can have multiple sources of illumination, which include streetlights, buildings and ships. When seen from space, nighttime lights (NTL) are a reliable proxy for measuring the scope and intensity of human activity.  
NTL can be applied across a wide range of studies, from analyzing human activities and urbanization trends—such as tracking urban expansion and estimating population distribution—to geopolitical and economic research, including assessing electrification in remote areas or monitoring regions affected by conflict. They are also valuable in socio-environmental studies, helping to detect power outages after natural disasters or understand the impact of artificial lighting on nature.

<figure style="text-align: center;">
    <img src="https://www.esa.int/var/esa/storage/images/esa_multimedia/images/2013/10/night_lights/13355175-1-eng-GB/Night_lights_pillars.jpg" 
         alt=" Photograph taken from onboard the International Space Station showing a nighttime Paris and London. . " 
         style="display: block; margin: 0 auto;"
         width="800
								">
    <figcaption>
         Photograph taken from onboard the International Space Station showing a nighttime Paris and London. Credit: 
        <a href="https://www.esa.int/ESA_Multimedia/Search?SearchText=nighttime+lights&result_type=images" target="_blank">
             ESA/NASA
        </a>.
    </figcaption>
</figure>

## Earth observations of nighttime lights
One source of nighttime light imagery is the Visible Infrared Imaging Radiometer Suite (VIIRS) aboard the  [Suomi National Polar-orbiting Partnership (Suomi NPP)](https://eospso.nasa.gov/missions/suomi-national-polar-orbiting-partnership), a joint mission of the National Oceanic and Atmospheric Administration ([NOAA](https://www.noaa.gov/)) and [NASA](https://www.nasa.gov/). This satellite acquire global daily measurements of nocturnal visible and near-infrared (NIR) light that can be used for Earth system science and applications, allowing to observe signals such as city lights, gas flares, fishing vessels, aurora, gravity waves and wildfires.  

The NTL data is processed and made available through [NASA's Black Marble](https://blackmarble.gsfc.nasa.gov/) product suite, which provides consistent, high-quality images of nighttime lights across the globe. These data are essential for analyzing human activity, urbanization patterns, energy consumption, and even socio-economic trends.

###  Urban and Rural Nighttime lights dataset
The data from VIIRS, onboard the Suomi NPP, provides consistent, high-quality nighttime light data for urban and rural regions worldwide, and is often referenced in scientific and public health research.  One notable use case, is the study "[Comparison of night light (VIIRS) and solar radiation (SGLI) and domestic COVID-19 epidemic](https://doi.org/10.11487/oukan.2021.0_B-4-4)" which analyzed the relationship between nighttime light intensity and public health factors.

This dataset, produced by Bumpei Tojo, (Associate Professor at the Graduate School of Global Studies, Tokyo University of Foreign Studies), was created to observe the impact of the COVID-19 pandemic on socio-economic activities by analyzing variations in nighttime light levels from 2019 to 2022. It was designed to eliminate interference from natural sources such as moonlight and cloud cover, ensuring a clear representation of human-made light sources. 

The daily nighttime satellite data (Suomi NPP/VIIRS VNP46A2) has been aggregated, and median images for each half-year and 10-degree lat/lon grid h-v tile has been prepared globally. The dataset uses varying shades of color to represent different intensities of light; darker shades indicate areas with less artificial light (e.g., rural or undeveloped regions), while lighter shades of yellow signify regions with higher concentrations of light (e.g., cities and industrial zones).


##  Urban and Rural NTL <!--{ as="eox-map" mode="tour" }-->
### <!--{ layers='[{"type":"Tile","properties":{"id":"Overlay labels"},"source":{"type":"XYZ","urls":["//s2maps-tiles.eu/wmts/1.0.0/overlay_base_bright_3857/default/g/{z}/{y}/{x}.jpg"]}},{"type":"Tile","properties":{"id":"JAXA_Nighttimelevel_Urban"},"source":{"type":"TileWMS","urls":["https://services.sentinel-hub.com/ogc/wms/0635c213-17a1-48ee-aef7-9d1731695a54"],"params":{"layers":"JAXA-NIGHTTIMELEVEL-URBAN","styles":"","format":"image/png","time":"2019-01-01T00:00:00Z"}}},{"type":"Tile","properties":{"id":"Terrain light"},"source":{"type":"XYZ","urls":["//s2maps-tiles.eu/wmts/1.0.0/terrain-light_3857/default/g/{z}/{y}/{x}.jpg"]}}]' zoom="7.568167497148919" center=[-81.69190982357188,36.13000317868601] animationOptions={duration:500}}-->
#### NTLU (Nighttime Light Urban)
The **NTLU** provides a comprehensive global spatial representation of nighttime light levels in urban areas. It is derived from satellite observations from the Suomi NPP satellite. This dataset is valuable for studying the **distribution of artificial lighting in urban regions**, offering insights into urban growth, infrastructure development, and socio-economic activity. 
<figure style="text-align: center;">
    <img src="https://eospso.nasa.gov/sites/default/files/sat/Suomi-NPP.jpg" 
         alt=" Sea ice concentration in May 2023. " 
         style="display: block; margin: 0 auto;"
         width="500">
    <figcaption>
         SUOMI-NPP Satellite. Source:
        <a href="https://eospso.nasa.gov/missions/suomi-national-polar-orbiting-partnership" target="_blank">
             NASA
        </a>.
    </figcaption>
</figure>


### <!--{ layers='[{"type":"Tile","properties":{"id":"Overlay labels"},"source":{"type":"XYZ","urls":["//s2maps-tiles.eu/wmts/1.0.0/overlay_base_bright_3857/default/g/{z}/{y}/{x}.jpg"]}},{"type":"Tile","properties":{"id":"JAXA_Nighttimelevel_Urban"},"source":{"type":"TileWMS","urls":["https://services.sentinel-hub.com/ogc/wms/0635c213-17a1-48ee-aef7-9d1731695a54"],"params":{"layers":"JAXA-NIGHTTIMELEVEL-URBAN","styles":"","format":"image/png","time":"2019-01-01T00:00:00Z"}}},{"type":"Tile","properties":{"id":"Terrain light"},"source":{"type":"XYZ","urls":["//s2maps-tiles.eu/wmts/1.0.0/terrain-light_3857/default/g/{z}/{y}/{x}.jpg"]}}]' zoom="9.823650315180059" center=[-73.99550312972447,40.83001718614142] animationOptions={duration:500}}-->
#### 
The dataset covers urban areas globally, highlighting nighttime light levels to analyze urbanization, energy use, and economic activities.
<figure style="text-align: center;">
    <img src="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Flive.staticflickr.com%2F8745%2F16384318544_178f2f5482_b.jpg&f=1&nofb=1&ipt=25829b7e1b15806e923ac37a1f3283fca53fcec2090012dc5cd4fa2d91cceaa7&ipo=images" 
         alt=" " 
         style="display: block; margin: 0 auto;"
         width="800
								">
    <figcaption>
        Times Square at night, New York. Credit: 
        <a href="https://www.flickr.com/photos/106447493@N05/16384318544" target="_blank">
             Leon Yaakkov
        </a>
    </figcaption>
</figure>

This dataset metrics, are **'nighttime radiance values'** (measured in nanowatts per square centimeter per steradian, nW/cm²/sr), which represent the **brightness of artificial lighting in urban areas**. From this, the Nighttime Light Intensity (NTLI) can be generated, a composite of observations reflecting the overall intensity of visible nighttime lights in urban landscapes.

### <!--{ layers='[{"type":"Tile","properties":{"id":"Overlay labels"},"source":{"type":"XYZ","urls":["//s2maps-tiles.eu/wmts/1.0.0/overlay_base_bright_3857/default/g/{z}/{y}/{x}.jpg"]}},{"type":"Tile","properties":{"id":"JAXA_Nighttimelevel_Rural"},"source":{"type":"TileWMS","urls":["https://services.sentinel-hub.com/ogc/wms/0635c213-17a1-48ee-aef7-9d1731695a54"],"params":{"layers":"JAXA-NIGHTTIMELEVEL-RURAL","styles":"","format":"image/png","time":"2019-01-01T00:00:00Z"}}},{"type":"Tile","properties":{"id":"Terrain light"},"source":{"type":"XYZ","urls":["//s2maps-tiles.eu/wmts/1.0.0/terrain-light_3857/default/g/{z}/{y}/{x}.jpg"]}}]' zoom="9.351542873898163" center=[2.8882348682431447,44.576074219821635] animationOptions={duration:500}}-->
#### Nighttime Light Rural (NTLR)
This dataset, **NTLR (Nighttime Light Rural)**, also derived from Suomi NPPM provides a comprehensive global spatial representation of nighttime light levels in **rural areas**. This dataset is valuable for studying the distribution of artificial lighting in **rural regions**, offering insights into human activity, **infrastructure development**, and **rural electrification**. 
<figure style="text-align: center;">
    <img src=https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Flive.staticflickr.com%2F3235%2F2878685617_eeff89373a_z.jpg&f=1&nofb=1&ipt=6f0925220b598c383594d4fe09dd64cf085f3474e27ddb90ccdb727f5d1e627e&ipo=images" 
         alt=" " 
         style="display: block; margin: 0 auto;"
         width="800
								">
    <figcaption>
       Rural area at night. Credit: 
        <a href="https://www.flickr.com/photos/bcm_photo/2878685617" target="_blank">
             Ben Murray
        </a>
    </figcaption>
</figure>

The dataset uses varying shades of color to represent different intensities of light; **darker shades** indicate areas with **less artificial light** (e.g., rural or undeveloped regions), while lighter **shades of yellow** signify regions with higher concentrations of light (e.g., cities and industrial zones).

Like NTLU (Nighttime Light Urban), the temporal coverage includes multi-year data, enabling trend analysis in rural electrification, infrastructure changes, and energy use patterns over time.


## Open Science
### Explore Nighttime Light Data with Jupyter Notebooks 

If you would like to have a better insight over a particular area, or a depper understanding on how cities have grown and their to economy shift, you can explore these changes since VIIRS satellite nightime ligh data are open access. The [notebook below](https://hub.eox.at/services/eoxhub-gateway/eurodatacube/notebook-view/notebooks/contributions/NightLights/Night_Lights_Blending.ipynb), allows to visualize urban expansion, infrastrucutre development using addtivie color blending - i.e. assigning different year to RBD channels allowing to reveal where artificial increased (which could be linked to economic growth) or decreased (suggesting reduced activity).

<figure style="text-align: center;">
    <img src="https://github.com/eurodatacube/eodash-assets/blob/main/stories/Nightlights/nightime_notebook_image.jpg?raw=true" 
         alt=" . " 
         style="display: block; margin: 0 auto;"
         width="500">
    <figcaption>
         Jupyter Notebook: Nightime Lights with SUOMI NPP.
        <a href="https://hub.eox.at/services/eoxhub-gateway/eurodatacube/notebook-view/notebooks/contributions/NightLights/Night_Lights_Blending.ipynb" target="_blank">
             Access the Notebook
        </a>.
    </figcaption>
</figure>

[Access the notebook](https://hub.eox.at/services/eoxhub-gateway/eurodatacube/notebook-view/notebooks/contributions/NightLights/Night_Lights_Blending.ipynb) to analyze trends, and uncover patterns of human activity on a location of your choice. 

### Explore Nighttime Light Data on different dashboards and portals

* **NASA-ESA-JAXA Earth observing Dashboard**

The [NASA-ESA-JAXA Earth observing Dashboard](https://eodashboard.org/explore?x=5442409.90488&y=525133.72922&z=2.81378&clusterOpen=1&indicator=N5) allows to crosscompare multiyear data over particular cities in Europe, exploring the Nighlights from SUOMI-NPP indicator, in particular the [Night lights in rural areas](https://eodashboard.org/explore?x=-2948638.45321&y=1639002.77598&z=3.45759&indicator=NTLR) and in [urban areas](https://eodashboard.org/explore?x=-2948638.45321&y=1639002.77598&z=3.45759&indicator=NTLU) datasets described in this story. 
* **NASA EarthData VEDA Dashboard**

​The NASA EarthData VEDA Dashboard offers [multiple datasets related to nighttime observations](https://www.earthdata.nasa.gov/dashboard/exploration?datasets=%5B%5D&taxonomy=%7B%7D&search=night), particularly under the [NASA's Black Marble](https://blackmarble.gsfc.nasa.gov/) suite (which offers popular nighttime data through a suite of products).



#### References
* [Suomi National Polar-orbiting Partnership (Suomi NPP)](https://eospso.nasa.gov/missions/suomi-national-polar-orbiting-partnership)
* [NASA's Black Marble](https://blackmarble.gsfc.nasa.gov/)
* Tojo, B. Application of earth observation data to public health. Proceedings of the Conference of Transdisciplinary Federation of Science and Technology 2021, B-4-4 (2021). DOI: [10.11487/oukan.2021.0_B-4-4](https://www.jstage.jst.go.jp/article/oukan/2021/0/2021_B-4-4/_article/-char/en)

#### Contributors
Sara Aparício (Solenix c/o ESA), Bumpei Tojo (Tokyo University of Foreign Studies), Diego Moglioni (Starion c/o ESA), Zhuosen Wang (NASA Goddard Space Flight Center and University of Maryland College Park)
