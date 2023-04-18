## About the Vessel Density Indicator
A vessel density map is a data product that shows the distribution of ships, based on
the instantaneous number of vessels per unit area  in the major EU ports using satellite radar data.

Vessel density indicator is computed based on Copernicus Sentinel-1 observations and complements the EMODNET Vessel Density which is based on Automatic Identification System (AIS) data, collected by coastal stations and satellites which is free and includes classification into 14 different ship categories. The use of Synthetic Aperture Radar (SAR) Copernicus Sentinel-1 satellites provide the opportunity for more frequent observations, overcoming EMODNET Vessel Density tow main limitations: its density maps processing and dissemination occurr after many months and refers only to European waters. Copernicus Sentinel-1 satellites high revisit provide this way the opportunity for more frequent observations.

## How is it generated
Vessel detection is one of the primary applications of SAR systems, which measure the roughness of the sea surface and display features that stand out against the background (vessels appear as bright spots). To produce a vessel density map, a script was used to derive derive, for each 1 km2 pixel of the masked image of the selected area, an indicator given by the ratio: 

*density_vessels= 1000 * number_vessels / number_observations*. This ratio corresponds to the intersection of all the satellite footprints of the selected month.
