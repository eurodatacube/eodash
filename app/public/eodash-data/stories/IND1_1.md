# Air pollution Indicator

V1 - 2024/04/12

- **Spatial coverage:** Occitanie region
- **Temporal coverage:** 3 years (2021 – 2023)
- **Spatial resolution:** 300m
- **Temporal resolution** : seasonally
- **Format:** COG product


Includes the following layers
- **vulnerable_population** : number of people of age < 5 or > 60. This indicator is an
extraction from HDX data and gives information about the number of elderly or
children in an area.
- **healthcare_access** : distance to nearest hospital or clinic (km). This indicator is
computed from the Healthcare Infrastructures indicator with bird's-eye distances.
- **air_pollution** : maximum number of days per season where air pollution exceeded the
WHO threshold between 2021 and 2023. The indicator takes into account PM2.5,
PM10, Ozone and NO2 from CAMS. If one of the pollutants exceeds the daily
threshold, it is considered a polluted day.
- **lst**: maximum monthly-average land surface temperature per season between 2019
and 2023. We consider that there is a risk for human health above an average 25°C.
- **houhpi** : Health-Oriented Urban Heat and Pollution Index (combination of the layers
above). This indicator is the sum of the normalized healthcare access and vulnerable
population indicators multiplied by the risk factor. The risk factor is computed using
the following knowledge [1] :
    - Air Pollution Risk (APR): Increment of 5% mortality risk when air pollution
exceeds WHO thresholds.
    - Urban Heat Risk (UHR): Increment of 6% mortality risk with LST (Land Surface
Temperature) above 25°C.
    - Combined Risk (CR): Increment of 21% mortality risk when both conditions are
met.
The score goes from 0 for a non existing risk to 2 for a high risk.

[1] https://www.eea.europa.eu/en/newsroom/editorial/combined-effects-of-air-pollution-and-heat-exposure#:~:text=Another%20recent%20study%20identified%20that,exposure%20to%20either%20factor%20on
