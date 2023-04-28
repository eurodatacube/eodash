## About the Sulfur Dioxide observed by Sentinel-5p TROPOMI Indicator

Sulphur dioxide (SO2) enters the Earth’s atmosphere through both natural and anthropogenic processes. It plays a role in chemistry on a local and global scale and its impact ranges from short-term pollution to effects on climate. Only about 30% of the emitted SO2 comes from natural sources; the majority is of anthropogenic origin. SO2 emissions adversely affect human health and air quality. SO2 has an effect on climate through radiative forcing, via the formation of sulphate aerosols. 

Volcanic SO2 emissions can also pose a threat to aviation, along with volcanic ash. S5P/TROPOMI samples the Earth’s surface with a revisit time of one day with an unprecedented spatial resolution of 3.5 x 5.5 km which allows the resolution of fine details including the detection of much smaller SO2 plumes. Source [1].

The sulfur dioxide map is measured by the Tropomi instrument on the Sentinel 5 Precursor satellite. More information on the Tropomi SO2 measurements and quality assessment can be found in the [Product Readme file] [TROPOMI website](http://www.tropomi.eu/data-products/sulphur-dioxide).

### How is it generated
The Copernicus [Sentinel-5P SO2 measurements](https://sentinel.esa.int/web/sentinel/data-products/-/asset_publisher/fp37fc19FN8F/content/sentinel-5-precursor-level-2-sulphur-dioxide) are those retrieved assuming SO2 at an altitude of 7km and explicitly filtering for pixels where a volcanic source is most likely (sulfurdioxide_detection_flag > 0) and where the solar zenith angle is within limits (SZA < 70°). The measurements are then mapped on a fixed latitude-longitude grid of 8193 x 16385 pixels. The grid is turned into an EPSG:4326 geotiff file using the appropriate color scale, which is again turned into an EPSG:3857 tile map.


#### Access this data from the STAC API of Sentinel-5P Product Algorithm Laboratory (S5P-PAL) 

https://data-portal.s5p-pal.com/cat-doc


### References
[1 Sulfure Dioxide](http://www.tropomi.eu/data-products/sulphur-dioxide)
