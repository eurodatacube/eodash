# HydroPower

The hydro power (reservoir) module is used to present reservoir surface area, level and storage changes. First, we analyze individual reservoirs extracting water area from pre-processed optical and SAR satellite imageries using a machine learning algorithm. After outlier filtering and post-process, the timeseries graph are constructed for each individual reservoir. Where there is a cross-section with Sentinel 3A/B orbits the reservoir water levels are directly obtained from satellite altimetry. Where only SWE time series exist the storage level is estimated based on the nominal change in surface water area.

![DHI Logo](data/gtif/images/logos/dhi.png "DHI Logo")
