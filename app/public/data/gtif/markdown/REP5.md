### Micro Hydropower

**Product name:** Micro Hydropower

**Coverage:** Austria (9.5°, 46.3°, 17.2°, 49.0°)

**Product description:**

Close to 300 locations for potential run-of-river hydroelectricity
generation plants were identified in Austria by utilizing geospatial techniques to analyze
hydrological data from Terra Climate and terrain data from Copernicus DEM.
The potential power generation capacity for the identified locations ranges from around 5 kW to around 5 mW.

In the first step, flow direction and flow accumulation are calculated from the DEM, which
provides information on the direction of water flow and the amount of water that
accumulates in each cell. Next, streams are derived by selecting cells that have a flow
accumulation of between 5,000 and 1,000,000 upstream cells. This step allows for the
identification of suitable watercourses in the area. The streams are then split into 1 km
sections to allow for more detailed analysis of the flow patterns in each section of the
stream.

As steep gradients are needed to create an adequate head for hydroelectricity generation,
potential pour points (center points of stream segments) are identified by selecting sections
with a slope above 50 m. The potential pour points are then snapped to the highest flow
accumulation cell within a maximum distance of 500 m to ensure that the pour points are in
areas where water flow is concentrated.

To identify the areas that contribute to the flow of water at each pour point, watersheds are
derived from flow direction data. Subsequently, flow rates are calculated by taking zonal
statistics for each watershed area and runoff data from Terra Climate. Finally, hydropower
potential is calculated using flow rate, head on 1 km section, gravity and density of water.

**Limitations:**

The results shown here is a demonstrator of a rapid cost-effective investigation
method for identifying locations showing the greatest micro-hydro potential. However, it is a
first line assessment which require further investigation but it allow planners and decision
makers to quickly focus on areas showing the greatest potential for further investigation.

**License:** Creative Commons CC BY-SA 3.0 IGO

![DHI Logo](data/gtif/images/logos/dhi.png "DHI Logo")
