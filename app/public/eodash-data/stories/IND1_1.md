# Air pollution Indicator

V0 - 2024/01/09

- **Spatial coverage:** Occitanie region
- **Temporal coverage:** 3 years (2021 – 2023)
- **Spatial resolution:** 300m
- **Format:** COG product
**Location:** https://eox-ideas.s3.eu-central-1.amazonaws.com/ideas_data/air_pollution_v0_hopi_occitanie.tif

Includes the following layers:

- vulnerable_population : number of people of age < 5 or > 60. This indicator is an
extraction from HDX data and gives information about the number of elderly or
children in an area.
- health_infrastructures : number of hospitals or clinics. This indicator is an extraction
from OpenStreetMap data.
- access_to_healthcare : distance to nearest hospital or clinic (km). This indicator is
computed from the Healthcare Infrastructures indicator with bird's-eye distances.
- air_pollution : number of days where air pollution exceeded the WHO threshold
between 2021 and 2023. The indicator takes into account PM2.5, PM10, Ozone and
NO2 from CAMS. If one of the pollutants exceeds the daily threshold, it is considered
a polluted day.
- hopi : Health-Oriented Pollution Index (combination of the layers above). This
indicator is the sum of the normalized healthcare access, air pollution and vulnerable
population indicators. The score goes from 0 for a non existing risk to 3 for a high risk.
