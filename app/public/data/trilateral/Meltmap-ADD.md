# Antarctica meltmaps 2007 - 2021 
### PROTOTYPE PRODUCT

Author: Enveo IT, Fürstenweg 176, 6020 Innsbruck, Austria

Processing date: 2022-06-09 

The data set contains Antarctic-wide daily melt maps (indicating presence of liquid water) from 2007 until 2021 derived from the ASCAT Enhanced Resolution 
Scatterometer Image Reconstruction (SIR) product [1]. The melting extent/stage maps have a fixed colour palette, where the coding is as follows:  

 0:   No melt/liquid water presence down to signal penetration limit (for C-Band in the order of several metres)
 
 1:   Surface layer melt (increase in depth of wet snow layer
 
 2:   Wet snow layer – saturated signal
 
 3:   Increase of refrozen layer above wet snow
 
 4:   Stationary condition
 
 255: NoData Value
    
    
![](/data/story-images/ASCAT_AA_meltmap_2021.gif)
    
*Figure 1. Antarctica Meltmap for 2021*
    
Based on these melt maps, value added melt map products are generated, indicating the melt onset, the melt duration and the end of the melt season on a pixel-by-pixel basis. 

**Explore these additional value added products on EO Dashboard:**

* [Melt onset](https://eodashboard.org/explore?poi=Onset-ADD) - refers to the first time that there are three consecutive days of melt in a year, thereby indicating the beginning of the snowmelt season.
* [End of melt season](https://eodashboard.org/explore?poi=End-ADD) - the melt ending is marked by three consecutive days of stable winter (reference) conditions after the last refreezing event of the year. 
* [Melt duration](https://eodashboard.org/explore?poi=Days-ADD) - refers to the duration from the melt onset to the end date of melt.      
    

![](/data/story-images/Melt_end.png)

*Figure 2. End of melt season for 2020-2021*


All products are provided in GeoTiff format at a grid spacing of 4.45 km x 4.45 km in the projection WGS 84 / NSIDC Sea Ice Polar Stereographic South (EPSG:3976). 

------------------------------------------------
[1] The SIR product is processed by the Microwave Earth Remote Sensing Laboratory (MERS) at Brigham Young University (BYU) and based on the full resolution (SZF) ASCAT C-Band Scatterometer data. It provides an enhanced resolution of 4.45 km by combining multiple pass, irregularly spaced data into higher-resolution gridded images. The SIR product used combines all data acquired within a single 24-hr period (msfa). 

### Reference: 
Lindsley, R. D. and Long, D. G. 2010. Standard BYU ASCAT land/ice image products. Microwave Earth Remote Sensing Laboratory, 3.

### Data Access:
ESA Open Science Data Catalogue https://opensciencedata.esa.int/projects/4d-antarctica 

### 4D Antarctica Project Page
https://4d-antarctica.org/ 

### Map baselayer and geometries

The Pine Island Glacier and Thwaites Glacier geometries shown on this map are for illustration purposes only. They were produced using [QGIS](http://www.qgis.org) by georeferencing maps made available by [the Polar Geospatial Center](https://data.pgc.umn.edu/maps/antarctica/pgc/19/preview/Thwaites%20Glacier%20Regional.jpg) and  the [Quantarctica/Norwegian Polar Institute](https://www.carbonbrief.org/guest-post-how-close-is-the-west-antarctic-ice-sheet-to-a-tipping-point/).

This map uses the baselayer Antarctic hillshade and bathymetry south of 60°S. Citation: REMA: Howat, I. M., Porter, C., Smith, B. E., Noh, M.-J., and Morin, P.: The Reference Elevation Model of Antarctica, The Cryosphere, 13, 665-674, [external resource], 2019.  GEBCO Compilation Group (2019) GEBCO 2019 Grid (doi:10.5285/836f016a-33be-6ddc-e053-6c86abc0788e) 
