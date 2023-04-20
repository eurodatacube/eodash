## About Ships in Port Indicator
This indicator  based on tracking cargo and shipping vessels in industrial areas, which are the primary transport vehicle for most commodities and which can be directly observed and categorised with Sentinel imagery and very high resolution data. 

The changes in vessel dynamics within industrial piers in several european harbours can be used as a proxy for changes in industrial activities and related vessels traffic. This was in fact noticeable during the COVID-19 pandemic. Global commodity markets have been strongly affected, with sharp declines in prices as a result of reduced demand of some products. As a consequence of drastic reduced demands, tanker vessels carrying crude oil for instance, where reported to be anchored around the main oil refineries in Europe, unable to discharge their cargo due to a lack of storage capacity in refineries and storage tanks. Other goods, such as natural rubber, platinum or metal experienced large price declines but even many activities related to trasnsportation of goood in containers were affeccted.

## How it is generated

The ship detections are computed with an AI based object detection application based on the Faster R-CNN which uses the Sentinel-2 RGB bands as input, and is currently running within ESA Euro Data Cube (EDC) infrastructure. The model has been trained on more than 500 Sentinel 2 training datasets covering 30 airports and 7 ports. Additional details are provided in [1].

## References

[1] ORCS for RACE - [Object Recognition and Classification from Satellite, A. Cavallini, Living Planet Symposium 2022](./eodash-data/stories/demo-mode/egu2023/ORCS_for_RACE_LPS_2022.pdf)
