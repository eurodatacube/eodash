## Nitrogen Dioxide observed by Sentinel-5p TROPOMI

Earth observing satellites like the **TROPOMI** instrument on the [Copernicus Sentinel-5P](https://www.esa.int/Applications/Observing_the_Earth/Copernicus/Sentinel-5P) are being used to map air pollution worldwide. One of the variables that it can provide information is on **tropospheric nitrogen dioxide (NO2)** which is linked to pollutant sectors such as traffic and industrial activities. The nitrogen dioxide concentrations vary from day to day due to changes in the weather (such as wind speed, cloudiness, etc) and **conclusions cannot be drawn based on just one day of data alone**. By combining data for a specific period of time (e.g. averaging over 14 days) the meteorological variability partially averages out and impact of changes due to human activity become more clearly visible.

## How it is generated

The nitrogen dioxide map shown here is measured by the Tropomi instrument on the Sentinel 5 Precursor satellite. The Tropomi measurements are performed in the visible part of the spectrum. Because Tropomi cannot see through thick clouds, the concentrations near the surface can only be measured under cloud-free or partly cloudy conditions. More information on the Tropomi NO2 measurements and quality assessment can be found in the [Product Readme file](https://sentinels.copernicus.eu/documents/247904/3541451/Sentinel-5P-Nitrogen-Dioxide-Level-2-Product-Readme-File).

Nitrogen dioxide concentrations in our atmosphere, as well as the cloud cover, vary widely from day to day owing to the fluctuations of emissions, as well as variations in weather conditions. In order to visualise longer-term variations in NO2, for instance the impact of COVID-19 lockdown measures on the NO2 concentrations, the maps show the concentration averaged over a period of two weeks (14 days), in steps of one week. Note that even after averaging over two weeks there are still remaining signatures of persistent weather situations. The quantification of changes in nitrogen oxide emissions requires more detailed analyses, combining the measurements with models that describe the day-to-day variability of air pollution.

The Copernicus [Sentinel-5P NO2 measurements](https://sentinel.esa.int/web/sentinel/data-products/-/asset_publisher/fp37fc19FN8F/content/sentinel-5-precursor-level-2-sulphur-dioxide) were first filtered for clouds according to the recommendation in the Product Readme file (only data with a qa_value > 0.75 was used). Then the two weeks of measurements are mapped on a fixed latitude-longitude grid of 8193 x 16385 pixels. The grid is turned into an EPSG:4326 geotiff file using the appropriate color scale, which is again turned into an EPSG:3857 tile map.

#### Work with this data on Euro Data Cube 

[![Jupyter Notebook](https://img.shields.io/badge/jupyter-%23FA0F00.svg?style=for-the-badge&logo=jupyter&logoColor=white)](https://eurodatacube.com/notebooks/contributions/NO2_Analysis_Covid19_Lockdowns.ipynb)

#### Access this data from the STAC API of Sentinel-5P Product Algorithm Laboratory [S5P-PAL Data Portal](https://data-portal.s5p-pal.com/products/no2.html)

https://data-portal.s5p-pal.com/cat-doc



