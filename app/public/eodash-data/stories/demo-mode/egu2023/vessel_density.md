## About the Vessel Density Indicator
A vessel density map is a data product that shows the distribution of ships, based on
the instantaneous number of vessels per unit area  in the major EU ports using satellite radar data.

Vessel density indicator is computed based on Copernicus Sentinel-1 observations and complements the EMODNET Vessel Density indicator [1] which is based on Automatic Identification System (AIS) data[1], collected by coastal stations and satellites which is free and includes classification into 14 different ship categories. The use of Synthetic Aperture Radar (SAR) Copernicus Sentinel-1 satellites [2] provide the opportunity for more frequent observations, overcoming EMODNET Vessel Density tow main limitations: its density maps processing and dissemination occurr after many months and refers only to European waters. Copernicus Sentinel-1 satellites high revisit provide this way the opportunity for more frequent observations.

## How is it generated
Vessel detection is one of the primary applications of SAR systems, which measure the roughness of the sea surface and display features that stand out against the background (vessels appear as bright spots). To produce a vessel density map, a script was used to derive derive, for each 1 km2 pixel of the masked image of the selected area, an indicator given by the ratio: 

*density_vessels= 1000 * number_vessels / number_observations*. This ratio corresponds to the intersection of all the satellite footprints of the selected month.

### Community Contributed Indicator 
![](https://img.shields.io/badge/eodash-community-blue)
  
This indicator is contributed by the communnity in the context of the of the [ESA COVID-19 Custom Script Contest](https://www.esa.int/Applications/Observing_the_Earth/COVID-19_how_can_satellites_help). The solution, titled ‘Vessel Density based on Copernicus Sentinel-1’ was developed by Alessandro Cimbelli. 

### References
[1] [EMODnet - European Marine Observation and Data Network] (https://emodnet.ec.europa.eu/geonetwork/srv/eng/catalog.search#/metadata/0f2f3ff1-30ef-49e1-96e7-8ca78d58a07c)

[2] [ Automatic Identification System (AIS) data] (https://www.imo.org/en/OurWork/Safety/Pages/AIS.aspx)
[3] [Copernicus Sentinel-1] (https://sentinels.copernicus.eu/web/sentinel/missions/sentinel-1)

