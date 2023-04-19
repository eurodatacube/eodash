## About the Relative humidity 1000HPA (C3S) Indicator
Relative humidity is relevant for scientists as it plays a role in various meteorological and environmental processes, and for the general public as it impacts human comfort, health, and indoor environments. Understanding relative humidity is important for making informed decisions related to weather, climate, air quality, and indoor comfort. Data Source can be found in [1]

## How is the indicator generated
Relative Humidity: The temperature to which the air, at 2 metres above the surface of the Earth, would have to be cooled for saturation to occur is a measure of the humidity of the air. Combined with temperature and pressure, it can be used to calculate the relative humidity.Temperature is measured at 2 meters above the surface of land, sea, or inland waters, and is calculated by interpolating between the lowest model level and the Earth's surface, taking into account atmospheric conditions. It is reported in kelvin (K), but can be converted to degrees Celsius (°C) by subtracting 273.15. Relative humidity is a measure of the humidity of the air and is calculated based on the temperature to which the air would have to be cooled for saturation to occur, combined with temperature and pressure.
For temperatures over 0°C (273.15 K) it is calculated for saturation over water. At temperatures below -23°C it is calculated for saturation over ice. Between -23°C and 0°C this parameter is calculated by interpolating between the ice and water values using a quadratic function. [1,2]

### References
[[1] Data Source](https://cds.climate.copernicus.eu/cdsapp#!/dataset/reanalysis-era5-pressure-levels-monthly-means?tab=overview)
[[2] Data Documentation](https://confluence.ecmwf.int/display/CKB/ERA5%3A+data+documentation)
