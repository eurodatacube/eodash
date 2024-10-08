## About Sea Surface Temperature (SST) Indicator
Sea surface temperature (SST) is a key ocean monitoring indicator that allows to track the health of our marine environment. This essential variable is indeed at the base of many physical and bio-geochemical processes: it modulates the flow of heat in and out the upper ocean, contributes in regulating marine ecosystems and responds to climate variability and change. Monitoring of long-term modifications in SST (i.e., trends) is crucial for evaluating the present state of the oceans and to correctly assess the impact of climate change at regional scales.

## How is it generated
SST data are derived from the Copernicus Marine Service Mediterranean Sea (MED) and Black Sea (BS) near real-time (NRT) SST products ([1] and [2], respectively). Both these products provide daily optimally interpolated gap-free (level-4, L4) estimates of the foundation SST (the temperature free, or nearly-free, of any diurnal cycle) over the Mediterranean Sea and Black Sea at ultra-high grid resolution, covering the period from 2008 to present (1 day before real time), and representative of nighttime SST values (centered at 00:00 UTC). Four modules are used for processing, including data download, remapping, quality control, and blending of data from different sensors. Optimal interpolation is applied to obtain a gap-free sea surface temperature (SST) product at 1/16° resolution. Daily time series of both SST products are turned into weekly time series by averaging on a pixel-by-pixel basis using a data cube of 3 pixels x 3 pixels x 7 days. This averaging reduces noise and increases spatial coverage. The difference between the weekly observations and the weekly climatology is then calculated at the pixel scale to obtain a relative, dimensionless value for further analysis.

### References
[[1] Copernicus MED NERT SST Product](https://doi.org/10.48670/moi-00173 )

[[2] Copernicus BS NRT STT Product ]( https://doi.org/10.48670/moi-00160)
 
