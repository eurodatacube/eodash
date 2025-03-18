## Nighlights

At night, the surface of our planet, can have multiple sources of illumination, which include streetlights, buildings and ships. When seen from space, nighttime lights (NTL) are a reliable proxy for measruing the scope and intensity of human activity.  
NTL can be applied across a wide range of studies, from analyzing human activities and urbanization trends—such as tracking urban expansion and estimating population distribution—to geopolitical and economic research, including assessing electrification in remote areas or monitoring regions affected by conflict. They are also valuable in socio-environmental studies, helping to detect power outages after natural disasters or understand the impact of artificial lighting on nature.

<figure style="text-align: center;">
    <img src="https://www.hdwallpapers.in/thumbs/2021/mount_fuji_japan_city_view_nighttime_hd_travel-t2.jpg" 
         alt=" Sea ice concentration in May 2023. " 
         style="display: block; margin: 0 auto;"
         width="800
								">
    <figcaption>
         Mount Fuji at night. Source:
        <a href="" target="_blank">
             HD
        </a>.
    </figcaption>
</figure>

## Earth observations of nighttime lights
One source of nightime light imagery is the Visible Infrared Imaging Radiometer Suite (VIIRS) aboard the  [Suomi National Polar-orbiting Partnership (Suomi NPP)](https://eospso.nasa.gov/missions/suomi-national-polar-orbiting-partnership), a joint mission of the National Oceanic and Atmospheric Administration ([NOAA](https://www.noaa.gov/)) and [NASA](https://www.nasa.gov/). This satellite acquire global daily measurmenets of nocturnal visible and near-infrared (NIR) ligght that can be used for Earth sistem sciene and applictions, allowing to observe signals such as citiy lights, gas flares and wildfires.  

The Nightlights data is processed and made available through [NASA's Black Marble](https://blackmarble.gsfc.nasa.gov/) product suite, which provides consistent, high-quality images of nighttime lights across the globe. These data are essential for analyzing human activity, urbanization patterns, energy consumption, and even socio-economic trends.

<figure style="text-align: center;">
    <img src="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Flive.staticflickr.com%2F3692%2F13026085045_d86f42769c.jpg&f=1&nofb=1&ipt=9c3e47af727dd5418d96fb7cd15d4fe8eaab0ce1577d035876a07de6977ad196&ipo=images" 
         alt="  " 
         style="display: block; margin: 0 auto;"
         width="800">
    <figcaption>
         Southern United States | Panorama of Suomi NPP Viirs images. Credit:
             Stuart Rankin
        </a>.
    </figcaption>
</figure>


## Urban and Rural Nighttime lights dataset
The High Definition Nightlights dataset is designed to eliminate interference from natural sources such as moonlight and cloud cover, ensuring a clear representation of human-made light sources. The dataset uses varying shades of color to represent different intensities of light; darker shades indicate areas with less artificial light (e.g., rural or undeveloped regions), while lighter shades of yellow signify regions with higher concentrations of light (e.g., cities and industrial zones).

The dataset was developed by JAXA to support global research on rural development, infrastructure expansion, and socio-economic impacts in less urbanized areas. The data from VIIRS, onboard the Suomi NPP satellite, provides consistent, high-quality nighttime light data for urban and rural regions worldwide, and is often referenced in scientific and public health research. One use case, the study on the "[Comparison of night light (VIIRS) and solar radiation (SGLI) and domestic COVID-19 epidemic](https://doi.org/10.11487/oukan.2021.0_B-4-4)" allowed to analyz the relationship between nighttime light intensity and public health factors.

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
<center>
<img src="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse1.mm.bing.net%2Fth%3Fid%3DOIP.KqBpeRXDQW9ZyUDAKL9lrQHaFS%26pid%3DApi&f=1&ipt=3320da1b11123a2767c570e82025bc70dbad7dd8e62eb82ffa9be9d94f76499a&ipo=images" width="400">
	
<span style="font-size:15px;">Timesquare, New York</span>
</center>

This dataset metrics, are **'nighttime radiance values'** (measured in nanowatts per square centimeter per steradian, nW/cm²/sr), which represent the **brightness of artificial lighting in urban areas**. From this, the Nighttime Light Intensity (NTLI) can be generated, a composite of observations reflecting the overall intensity of visible nighttime lights in urban landscapes.

### <!--{ layers='[{"type":"Tile","properties":{"id":"Overlay labels"},"source":{"type":"XYZ","urls":["//s2maps-tiles.eu/wmts/1.0.0/overlay_base_bright_3857/default/g/{z}/{y}/{x}.jpg"]}},{"type":"Tile","properties":{"id":"JAXA_Nighttimelevel_Rural"},"source":{"type":"TileWMS","urls":["https://services.sentinel-hub.com/ogc/wms/0635c213-17a1-48ee-aef7-9d1731695a54"],"params":{"layers":"JAXA-NIGHTTIMELEVEL-RURAL","styles":"","format":"image/png","time":"2019-01-01T00:00:00Z"}}},{"type":"Tile","properties":{"id":"Terrain light"},"source":{"type":"XYZ","urls":["//s2maps-tiles.eu/wmts/1.0.0/terrain-light_3857/default/g/{z}/{y}/{x}.jpg"]}}]' zoom="9.351542873898163" center=[2.8882348682431447,44.576074219821635] animationOptions={duration:500}}-->
#### Nighttime Light Rural (NTLR)
This dataset, **NTLR (Nighttime Light Rural)**, also derived from Suomi NPPM provides a comprehensive global spatial representation of nighttime light levels in **rural areas**. This dataset is valuable for studying the distribution of artificial lighting in **rural regions**, offering insights into human activity, **infrastructure development**, and **rural electrification**. 
<center>
<img src="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Flive.staticflickr.com%2F1666%2F25171090361_f674a3dc36_b.jpg&f=1&nofb=1&ipt=a9e227546fcfb6ab481a62edeadf968bd1c1adcf1b1762a713ccc42c605a4c09&ipo=images" width="400">
	
<span style="font-size:15px;">Nightime rural area</span>
</center>

The dataset uses varying shades of color to represent different intensities of light; **darker shades** indicate areas with **less artificial light** (e.g., rural or undeveloped regions), while lighter **shades of yellow** signify regions with higher concentrations of light (e.g., cities and industrial zones).

Like NTLU (Nighttime Light Urban), the temporal coverage includes multi-year data, enabling trend analysis in rural electrification, infrastructure changes, and energy use patterns over time.






## Open Science
#### Explore Nighttime Light Data with Jupyter Notebooks 

If you would like to have a better insight over a particular area, or a depper understanding on how cities have grown and their to economy shift, you can explore these changes since VIIRS satellite nightime ligh data are open access. The [notebook below](https://github.com/eurodatacube/notebooks/tree/master/notebooks/curated), allows to visualize urban expansion, infrastrucutre development using addtivie color blending - i.e. assigning different year to RBD channels allowing to reveal where artificial increased (which could be linked to economic growth) or decreased (suggesting reduced activity).

<figure style="text-align: center;">
    <img src="https://github.com/eurodatacube/eodash-assets/blob/AparicioSF-patch-5/stories/Nightlights/nightime_notebook_image.jpg?raw=true" 
         alt=" Sea ice concentration in May 2023. " 
         style="display: block; margin: 0 auto;"
         width="500">
    <figcaption>
         Jupyter Notebook: Nightime Lights with SUOMI NPP. Access at:
        <a href="https://github.com/eurodatacube/notebooks/tree/master/notebooks/curated" target="_blank">
             EOdashboard GitHub page
        </a>.
    </figcaption>
</figure>

[Acceess the notebook](https://github.com/eurodatacube/notebooks/tree/master/notebooks/curated) to analyze trends, and uncover patterns of human activity on a location of your choice. 
You can also crosscompare mulyear data over particular cities in Europe, exploring the [Nighlights from SUOMI-NPP indicator](https://eodashboard.org/explore?x=5442409.90488&y=525133.72922&z=2.81378&clusterOpen=1&indicator=N5), or accessing [NASA's Black Marble](https://blackmarble.gsfc.nasa.gov/), which offers popular nighttime data through a suite of products.



#### References
* [Suomi National Polar-orbiting Partnership (Suomi NPP)](https://eospso.nasa.gov/missions/suomi-national-polar-orbiting-partnership)
* Li, X., Zhou, Y., Zhao, M. et al. A harmonized global nighttime light dataset 1992–2018. Sci Data 7, 168 (2020). DOI: [doi.org/10.1038/s41597-020-0510-y](https://doi.org/10.1038/s41597-020-0510-y)
* Chen, X., Wang, Z., Zhang, F. et al. A global annual simulated VIIRS nighttime light dataset from 1992 to 2023. Sci Data 11, 1380 (2024). DOI: [doi.org/10.1038/s41597-024-04228-6](https://doi.org/10.1038/s41597-024-04228-6)
* Tojo, B. Application of earth observation data to public health. Proceedings of the Conference of Transdisciplinary Federation of Science and Technology 2021, B-4-4 (2021). DOI: [10.11487/oukan.2021.0_B-4-4](https://10.11487/oukan.2021.0_B-4-4)
* [NASA's Black Marble](https://blackmarble.gsfc.nasa.gov/)


#### Contributors

