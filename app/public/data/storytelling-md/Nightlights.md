## Nighlights

The Earth observations of nightime light emissions provide a unique perspecitve into human activities and impacts of natural disasters, such as assessing power outages or long term trends as the expansion of urban areas, or the influence of artificial lights on Nature.  These can also be used in estimation of population, support the assessment of remote areas electrification and monitoring regions impacts by disasters and conflicts. 

Nightime illumination sources can vary light emitting objects, such as street light illumination, buildings and ships or moonlight itself.

## Earth observations of nightime lights
One source of nightime light imagery is the Visible Infrared Imaging Radiometer Suite (VIIRS) aboard the joint NASA/NOAA Suomi National Polar-orbiting Partnership (Suomi NPP). This satellite acquire global daily measurmenets of nocturnal visible and near-infrared (NIR) ligght that can be used for Earth sistem sciene and applictions.

Nighttime Light Rural
This dataset, NTLR (Nighttime Light Rural), provides a comprehensive global spatial representation of nighttime light levels in rural areas. It is derived from satellite observations from the Visible Infrared Imaging Radiometer Suite (VIIRS) sensor onboard the Suomi National Polar-orbiting Partnership (Suomi NPP) satellite. This dataset is valuable for studying the distribution of artificial lighting in rural regions, offering insights into human activity, infrastructure development, and rural electrification. The dataset uses varying shades of color to represent different intensities of light; darker shades indicate areas with less artificial light (e.g., rural or undeveloped regions), while lighter shades of yellow signify regions with higher concentrations of light (e.g., cities and industrial zones).

<figure style="text-align: center;">
    <img src="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fwww.astroblogs.nl%2Fwp-content%2Fuploads%2F2017%2F11%2Fimg_press_140106_suomi-npp-1024x819.jpg&f=1&nofb=1&ipt=472ab3f95728f8c5d2bad03441ab67b821aee4473ad70205ef482a8b5707d19f&ipo=images" 
         alt=" Sea ice concentration in May 2023. " 
         style="display: block; margin: 0 auto;"
         width="700">
    <figcaption>
         Sea ice concentration in May 2023. Source:
        <a href="https://osi-saf.eumetsat.int/" target="_blank">
             EUMETSAT OSI SAF data with R&D from ESA CCI
        </a>.
    </figcaption>
</figure>



The Nightlights dataset is collected by the Visible Infrared Radiometer Suite (VIIRS) Day/Night Band (DNB) aboard the Suomi-National Polar-Orbiting Partnership (Suomi-NPP) satellite, a joint mission of the National Oceanic and Atmospheric Administration (NOAA) and NASA. The Nightlights data is processed and made available through NASA's Black Marble product suite, which provides consistent, high-quality images of nighttime lights across the globe. These data are essential for analyzing human activity, urbanization patterns, energy consumption, and even socio-economic trends.

The High Definition Nightlights dataset is designed to eliminate interference from natural sources such as moonlight and cloud cover, ensuring a clear representation of human-made light sources. The dataset uses varying shades of color to represent different intensities of light; darker shades indicate areas with less artificial light (e.g., rural or undeveloped regions), while lighter shades of yellow signify regions with higher concentrations of light (e.g., cities and industrial zones).

## Dataset description
The dataset covers rural areas globally, highlighting nighttime light levels to analyze rural development, access to electricity, and socio-economic activities.
Metric: Nighttime radiance values (measured in nanowatts per square centimeter per steradian, nW/cm²/sr), which represent the brightness of artificial lighting in rural areas. From this can be generated
the Nighttime Light Intensity (NTLI), a composite observations reflecting the overall intensity of visible nighttime lights in rural landscapes.
Temporal coverage includes multi-year data, enabling trend analysis in rural electrification, infrastructure changes, and energy use patterns over time.
The dataset was developed by JAXA to support global research on rural development, infrastructure expansion, and socio-economic impacts in less urbanized areas. The data from VIIRS, onboard the Suomi NPP satellite, provides consistent, high-quality nighttime light data for rural regions worldwide.

The dataset is often referenced in scientific and public health research. For example, Bunpei Tojo (2021) used Nightlights data in the study "Application of Earth observation satellite data to public health: Comparison of night light (VIIRS) and solar radiation (SGLI) and domestic COVID-19 epidemic," presented at the 12th Federation of Science and Technology conference, to analyze the relationship between nighttime light intensity and public health factors. Citation: Bunpei Tojo, "Application of earth observation satellite data to public health: Comparison of night light (VIIRS) and solar radiation (SGLI) and domestic COVID-19 epidemic," Transdisciplinary 12th Federation of Science and Technology conference 2021, https://doi.org/10.11487/oukan.2021.0_B-4-4.

##  Title of map tour  <!--{ as="eox-map" mode="tour" }-->

### <!--{ layers='[{"type":"Tile","properties":{"id":"Overlay labels"},"source":{"type":"XYZ","urls":["//s2maps-tiles.eu/wmts/1.0.0/overlay_base_bright_3857/default/g/{z}/{y}/{x}.jpg"]}},{"type":"Tile","properties":{"id":"JAXA_Nighttimelevel_Rural"},"source":{"type":"TileWMS","urls":["https://services.sentinel-hub.com/ogc/wms/0635c213-17a1-48ee-aef7-9d1731695a54"],"params":{"layers":"JAXA-NIGHTTIMELEVEL-RURAL","styles":"","format":"image/png","time":"2019-01-01T00:00:00Z"}}},{"type":"Tile","properties":{"id":"Terrain light"},"source":{"type":"XYZ","urls":["//s2maps-tiles.eu/wmts/1.0.0/terrain-light_3857/default/g/{z}/{y}/{x}.jpg"]}}]' zoom="9.351542873898163" center=[2.8882348682431447,44.576074219821635] animationOptions={duration:500}}-->
#### Rural Areas
Text describing the current step of the tour and why it is interesting what the map shows currently
<center>
<img src="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Flive.staticflickr.com%2F1666%2F25171090361_f674a3dc36_b.jpg&f=1&nofb=1&ipt=a9e227546fcfb6ab481a62edeadf968bd1c1adcf1b1762a713ccc42c605a4c09&ipo=images" width="400">
	
<span style="font-size:15px;">Nightime rural area</span>
</center>


### <!--{ layers='[{"type":"Tile","properties":{"id":"Overlay labels"},"source":{"type":"XYZ","urls":["//s2maps-tiles.eu/wmts/1.0.0/overlay_base_bright_3857/default/g/{z}/{y}/{x}.jpg"]}},{"type":"Tile","properties":{"id":"JAXA_Nighttimelevel_Urban"},"source":{"type":"TileWMS","urls":["https://services.sentinel-hub.com/ogc/wms/0635c213-17a1-48ee-aef7-9d1731695a54"],"params":{"layers":"JAXA-NIGHTTIMELEVEL-URBAN","styles":"","format":"image/png","time":"2019-01-01T00:00:00Z"}}},{"type":"Tile","properties":{"id":"Terrain light"},"source":{"type":"XYZ","urls":["//s2maps-tiles.eu/wmts/1.0.0/terrain-light_3857/default/g/{z}/{y}/{x}.jpg"]}}]' zoom="7.568167497148919" center=[-81.69190982357188,36.13000317868601] animationOptions={duration:500}}-->
#### Tour step title
Text describing the current step of the tour and why it is interesting what the map shows currently

#### Title
textextex

Textextex
<center>
<img src="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse1.mm.bing.net%2Fth%3Fid%3DOIP.KqBpeRXDQW9ZyUDAKL9lrQHaFS%26pid%3DApi&f=1&ipt=3320da1b11123a2767c570e82025bc70dbad7dd8e62eb82ffa9be9d94f76499a&ipo=images" width="400">
	
<span style="font-size:15px;">Timesquare, New York</span>
</center>

## Open Science
#### Explore yourself Socio-Economic Changes with Nighttime Light Data with Notebook 

If you would like to have a better insight over a particular area, or a depper understanding on how cities have grown and their to economy shift, you can explore these changes since VIIRS satellite nightime ligh data are open access. The notebook below, allows to visualize urban expansion, infrastrucutre development using addtivie color blending - i.e. assigning different year to RBD channels allowing to reveal where artificial increased (which could be linked to economic growth) or decreased (suggesting reduced activity).

Acceess the notebook to analyze trends, and uncover patterns of human activity on a location of your choice. 

#### Other sources
NASA offers of some of its most popular nighttime data through a suite of products called the Black Marble. 
The dataset is a product of NOAA and NASA, and the data can be accessed through NASA's Black Marble suite.

#### References
* Li, X., Zhou, Y., Zhao, M. et al. A harmonized global nighttime light dataset 1992–2018. Sci Data 7, 168 (2020). https://doi.org/10.1038/s41597-020-0510-y
* Chen, X., Wang, Z., Zhang, F. et al. A global annual simulated VIIRS nighttime light dataset from 1992 to 2023. Sci Data 11, 1380 (2024). https://doi.org/10.1038/s41597-024-04228-6



