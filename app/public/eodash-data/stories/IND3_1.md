**Spatial coverage**: Global          
**Temporal coverage**: Daily prediction starting from year 2024           
**Spatial resolution**: 9 km           



Includes the following layer:


- **Suitable ecosystem for locust breeding** : in context of early warning of the
desert locust crisis, a machine learning model was developed in order to forecast
suitable area for locust breeding. The model was trained using FAO Locust Watch
dataset[1] on hoppers location from 2000 to 2021 as reference and temporal
sequence of 50 days containing climatic information about soil water content,
vegetation (leaf area index), precipitation and temperature all collected from
ERA-5 Land dataset[2] . The model architecture is a Maxent model where at its core
an LSTM with logistic output. Prediction is done one week in advance, it
correspond to a level of confidence of ecosystem suitability for locust (from 0 to
1), higher the confidence is higher the probability of locust presence is.

**Reference**              
[1] https://locust-hub-hqfao.hub.arcgis.com/      
[2] https://cds.climate.copernicus.eu/cdsapp#!/dataset/reanalysis-era5-land?tab=overview
