## About the Airport traffic indicator based on flying airplane detection

Air traffic is of particular interest to unveil human and economic activities (e.g., [travel](https://www.iata.org/en/pressroom/pr/2017-10-24-01/), [tourism](https://doi.org/10.1016/j.jairtraman.2005.09.007), [cargo](https://www.iata.org/en/programs/cargo/sustainability/benefits/)) and [track disease spread due to in-flight transmission](https://www.cidrap.umn.edu/news-perspective/2020/09/studies-trace-covid-19-spread-international-flights). This indicator is based on the detection of flying airplanes in images captured by the [Copernicus Sentinel-2](http://www.esa.int/Applications/Observing_the_Earth/Copernicus/Sentinel-2) satellites. We focused our analysis on Areas Of Interest (AOI) around the 30 busiest airports (i.e., airports with the highest number of passengers in 2019) in the EU. The chosen airports cover 26 different cities and 18 different countries. Each AOI is defined as a rectangle with 1.05° of width and 0.7° of height centered at the latitude and longitude coordinates of the target airport. This results in an area of about 6,000 km2 (equivalent to 840,000 soccer fields) per AOI. Airplane counts from satellite images of the same AOI are combined into monthly observations
prepared by Maurício Pamplona Segundo, Rodrigo Minetto, Cole Hill, Allan Pinto, Ricardo Da Silva Torres, and Sudeep Sarkar within the [upscaling part](https://eo4society.esa.int/2020/04/24/from-the-covid-19-custom-script-contest-to-the-euro-data-cube-european-dashboard/) of the [COVID-19 Custom Script Contest](https://www.sentinel-hub.com/contest-covid/).


## How it is generated

The [multispectral instrument design of Sentinel-2 satellites](https://earth.esa.int/documents/247904/685211/Sentinel-2_User_Handbook) makes them observe the earth's surface at different times in each spectral band. As the ground serves as a reference to merging bands, the resulting multispectral images (MSI) present inter-band measurement displacements due to parallax for objects at high altitudes and high-speed movement for objects at any elevation. Figure 2 shows how these displacements create a colored pattern for flying airplanes in the three MSI bands of visible light (red, green and blue) through real examples that allow observing both parallax and object movement effects simultaneously.
We take advantage of the advances driven by deep learning algorithms − bio-inspired neural networks that learn representations with multiple abstraction levels and discover intricate patterns in massive data − to devise an automatic airplane detector. As we are only interested in counting airplanes, information like airplane size, speed and orientation are not relevant to us. So we can simply classify each pixel of the image as being the center of a flying airplane (green dot in Figure 2(c)) or not, which is more than enough to accomplish our task. With this setup, our detection problem can be seen as a segmentation problem, and we can use a [Fully Convolutional Network (FCN)](https://github.com/maups/covid19-custom-script-contest) to carry it out.

### Community Contributed Indicator 
![](https://img.shields.io/badge/eodash-community-blue)
  
This indicator is contributed by the communnity in the context of the of the [ESA COVID-19 Custom Script Contest](https://www.esa.int/Applications/Observing_the_Earth/COVID-19_how_can_satellites_help). The solution, titled ‘A DATASET FOR DETECTING FLYING AIRPLANES ON SATELLITE IMAGES’ was developed by Mauricio Pamplona Segundo (University of South Florida)[1]. 


#### Source code 

[![Repo](https://badgen.net/badge/icon/GitHub?icon=github&label)](https://github.com/maups/covid19-custom-script-contest)


#### Execute code on Euro Data Cube 


### References
[1] [IEEE DataPort, dataset-detecting-flying-airplanes-satellite-images ](https://ieee-dataport.org/open-access/dataset-detecting-flying-airplanes-satellite-images) 
