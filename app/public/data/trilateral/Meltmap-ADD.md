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
    
Additionally, based on the melt maps, value added melt map products are generated, indicating on a pixel-by-pixel basis:     

* melt onset
* end of melt season
* melt duration      
    
Melt onset refers to the first time that there are three consecutive days of melt in a year, thereby indicating the beginning of the
snowmelt season. Similarly the melt ending is marked by three consecutive days of stable winter (reference) conditions after the last refreezing event
of the year. The total melt duration refers to the duration from the melt onset to the end date of melt. 

![](/data/story-images/Melt_end.png)

*Figure 2. End of melt season for 2020-2021*


The folder animation contains animated gifs of the melt maps for each year and for the entire period. All products are provided in GeoTiff format at a grid spacing of 4.45 km x 4.45 km in the projection WGS 84 / NSIDC Sea Ice Polar Stereographic South (EPSG:3976). 

------------------------------------------------
[1] The SIR product is processed by the Microwave Earth Remote Sensing Laboratory (MERS) at Brigham Young University (BYU) and based on the full resolution (SZF) ASCAT C-Band Scatterometer data. It provides an enhanced resolution of 4.45 km by combining multiple pass, irregularly spaced data into higher-resolution gridded images. The SIR product used combines all data acquired within a single 24-hr period (msfa). 

### Reference: 
Lindsley, R. D. and Long, D. G. 2010. Standard BYU ASCAT land/ice image products. Microwave Earth Remote Sensing Laboratory, 3.

### Data Access:
ESA Open Science Data Catalogue https://opensciencedata.esa.int/projects/4d-antarctica 

### 4D Antarctica Project Page
https://4d-antarctica.org/ 
