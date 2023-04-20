## About the Carbon Monoxide observed by Sentinel-5p TROPOMI Indicator

Carbon monoxide (CO) is an important atmospheric trace gas for our understanding of tropospheric chemistry. In certain urban areas, it is a major atmospheric pollutant. Main sources of CO are combustion of fossil fuels, biomass burning, and atmospheric oxidation of methane and other hydrocarbons. Whereas fossil fuel combustion is the main source of CO at Northern mid-latitudes, the oxidation of isoprene and biomass burning play an important role in the tropics. 

TROPOMI on ESA's [Sentinel 5 Precursor (S5P) satellite](https://sentinel.esa.int/web/sentinel/missions/sentinel-5p) observes the CO global abundance exploiting clear-sky and cloudy-sky Earth radiance measurements in the 2.3 µm spectral range of the shortwave infrared (SWIR) part of the solar spectrum. 

TROPOMI clear sky observations provide CO total columns with sensitivity to the tropospheric boundary layer. For cloudy atmospheres, the column sensitivity changes according to the light path.

## How it is generated
The carbon monoxide map shown here is measured by the Tropomi instrument on the Sentinel 5 Precursor satellite. More information on the Tropomi CO measurements and quality assessment can be found in the [Product Readme file](https://sentinels.copernicus.eu/documents/247904/3541451/Sentinel-5P-Carbon-Monoxide-Level-2-Product-Readme-File)
The Copernicus Sentinel-5P CO measurements were first filtered according to the recommendation in the Product Readme file (only data with a qa_value >; 0.50 was used). Then the measurements are mapped on a fixed latitude-longitude grid of 4096 x 8192 pixels. The grid is turned into an EPSG:4326 geotiff file using the appropriate color scale, which is again turned into an EPSG:3857 tile map.


#### Work with this data on Euro Data Cube 

[![Jupyter Notebook](https://img.shields.io/badge/jupyter-%23FA0F00.svg?style=for-the-badge&logo=jupyter&logoColor=white)](https://eurodatacube.com/notebooks/contributions/IGARSS2022/IGARSS-22_Australian_Bushfires.ipynb)

#### Access this data from the STAC API of Sentinel-5P Product Algorithm Laboratory (S5P-PAL) 

https://data-portal.s5p-pal.com/cat-doc

