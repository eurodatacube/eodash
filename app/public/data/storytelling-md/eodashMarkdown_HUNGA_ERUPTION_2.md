## Tracking aerosol plumes from Hunga eruption in 2022
######  [This story is based on results from the [3RD EARTH SYSTEM SCIENCE CHALLENGE ]( https://sciencehub.esa.int/2024/05/09/3rd-earth-system-science-challenge/). The notebook can be acceed at GitHub.]

The eruption of the Hunga submarine volcano on January 15, 2022, stands out as a significant event in recent volcanic history. At 4:15 UTC, the powerful explosion propelled a plume to an exceptional height of 58 kilometers within just 30 minutes (Carr et al., 2022). The majority of the plume remained between 26 and 34 kilometers as it drifted towards western longitudes, releasing approximately 0.4 to 0.5 teragrams of sulfur dioxide into the atmosphere (Carn et al., 2022). This eruption also caused an unprecedented increase in stratospheric water vapor content, adding an instantaneous 10% (Millán et al., 2022). The focus of ongoing research, done it the context of the [European's Space Agency Earth System Science Challenge ]( https://sciencehub.esa.int/2024/05/09/3rd-earth-system-science-challenge/) was to precisely track the movement and impact of this remarkable aerosol plume.


## Simple Image Example <!--{as="img" src="https://www.emergency-live.com/it/wp-content/uploads/2022/01/Isola-Tonga-Pacifico-vulcano-croce-rossa-IFRC.jpg" style="width: 100%; height: 600px;"}-->

Monitoring the evolution of volcanic plumes and their optical characteristics is crucial for understanding their impact on the Earth's radiative balance. This data can be used in radiative transfer models to calculate the radiative effects during such events. Extreme volcanic events, like the 1991 eruption of Mount Pinatubo, can significantly influence global temperatures, as evidenced by the subsequent 0.6°C drop in average global temperature over the following 15 months (Parker et al., 1996). In the case of the Hunga eruption, observations revealed a net warming of the climate system at the top of the atmosphere 15 days after the eruption, attributed to the water vapor in the plume (Sellitto et al., 2022).

For the Hunga event, the monitoring period of interest spans from January 13, 2022, to April 30, 2022. The plume evolved within latitudes ranging from -40° to 40°, encircling the globe several times during the four months following the eruption. Understanding and accurately monitoring these extreme events are essential for comprehending their profound radiative impact on a planetary scale.

## Map Example <!--{as="eox-map" style="width: 100%; height: 500px;" layers='[{"type":"Tile","properties":{"id":"Overlay labels"},"source":{"type":"XYZ","urls":["//s2maps-tiles.eu/wmts/1.0.0/overlay_base_bright_3857/default/g/{z}/{y}/{x}.jpg"]}},{"type":"Tile","properties":{"id":"CO_3_daily-2022-01-19"},"source":{"type":"TileWMS","urls":["https://services.sentinel-hub.com/ogc/wms/0635c213-17a1-48ee-aef7-9d1731695a54"],"params":{"layers":"AWS_VIS_CO_3DAILY_DATA","styles":"","format":"image/png","time":"2022-01-19"}}},{"type":"Tile","properties":{"id":"Terrain light"},"source":{"type":"XYZ","urls":["//s2maps-tiles.eu/wmts/1.0.0/terrain-light_3857/default/g/{z}/{y}/{x}.jpg"]}}]' zoom="4" center=[160,9] }-->

## Data: 
To monitor the Hunga eruption's impact, sulfate aerosol data produced by the Rutherford Appleton Laboratory (RAL) is utilized, in conjunction with co-located satellite data from the Infrared Atmospheric Sounding Interferometer (IASI), Advanced Microwave Sounding Unit (AMSU), and Microwave Humidity Sounder (MHS) (Siddans et al., 2022) on board the Eumetsat Metop satellites. 

## Simple Image Example <!--{as="img" src="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fwww.eoportal.org%2Fapi%2Fcms%2Fdocuments%2F163813%2F4622822%2FMetOp_Auto30.jpeg&f=1&nofb=1&ipt=7a0b41b27b19485ec43265033f4b5704a46bedd22eedca69709c8c2ae6f9aecc&ipo=images" style="width: 50%; height: 300px;"}-->


The focus is on the optical properties of the plume components, particularly the sulfate aerosols optical depth (SAOD). The sulfur dioxide (SO2) injected during the eruption was quickly converted into sulfate aerosols due to the abundant presence of water vapor in the stratosphere (Legras et al., 2022).

## Simple Image Example <!--{as="img" src="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fwww.sciencekids.co.nz%2Fimages%2Fpictures%2Fnature%2Fvolcanicgases.jpg&f=1&nofb=1&ipt=00a2d46d611e0400e75ad8f21ff621f3a5d93920b6585998daf865935151b157&ipo=images" style="width: 100%; height: 600px;"}-->


Measuring SAOD helps in determining the plume's location and movement, making it possible to track the sulfate aerosols within the plume. RAL employs an optimal estimation spectral fitting procedure to retrieve atmospheric parameters from the co-located measurements by IASI, AMSU, and MHS (Siddans et al., 2022). The forward radiative transfer model RTTOV-12 is used for the quantitative retrieval of volcanic-specific aerosols, such as sulfate aerosols. This includes the retrieval of sulfate aerosols optical depth at 8.5 µm, enabling detailed analysis and tracking of the plume's evolution.







## Methods
The overall approach was a time serie interpolation techniques. This approach had 4 main steps:
1. First it was selected from the data, consecutive time series. One pixel located on the plue was selected under the condition of no gaps in the time series. Then time serie from a random pixel in the plume was retrieved.
2. Upon selecting consecutive times sereis data, temporal gaps were introduced by removing from the data random points (1 gap or 2 gap). 
3. Then an interpolation method was introduced (linear regression and second degree polynomial regression were tested), in order to predict for 1 gap (i.e. random point and dates)
4. Finally, the interpolation method was adapted to the data, originating this an interpolated time serie 

Afterwards both methods were compared, the data was adapted to the interpolation method and new maps were computed after the interpolation.

## Results
Visualization of video form the team


## Key findings
The key findings indicate that relevant interpolation is achievable with linear regression, which enhances the precision of evaluating the radiative impact of sulfates, particularly for satellite tracks. This precision is crucial because aerosols play a key role in the Earth's radiative budget. The results of this study could be instrumental in researching geoengineering strategies, such as stratospheric aerosol injections.

To further improve these findings, implementing a second-degree interpolation with more points could significantly reduce error margins. Additionally, developing the function to handle three consecutive gaps and incorporating a shift to account for the plume's horizontal velocity would enhance the model's robustness and accuracy.



## Further info
Since the volcanic eruption occurred outside Japan, JAXA has been conducting emergency observation by ALOS-2 and providing observation information in cooperation with a local organization of the Pacific Community, a member of Sentinel Asia. Sentinel Asia is an international collaboration framework for disaster prevention using space technology and JAXA takes a role of its secretariat.

Sentinel Asia: Volcano eruption in Tonga on 15 January, 2022
https://sentinel-asia.org/EO/2022/article20220115TO.html

JAXA also conducted emergency observation by the Synthetic Aperture Radar, “PALSAR-2” onboard ALOS-2, which can obtain images even under clouds and plumes. Figure 1-1 shows the observation image overlaid on map when ALOS-2 performed emergency observation with wide-area mode around 23:00 on January 17, 2022 (UTC, around 8:00 on January 18, 2022 (JST))

## Simple Image Example <!--{as="img" src="https://earth.jaxa.jp/en/wp-content/uploads/sites/2/2022/02/tp220120_03.png" style="width: 100%; height: 600px;"}-->
Figure 1-2 Change of the Hunga-Tonga-Hunga-Ha’apai volcano observed by ALOS-2
(Left) December 14, 2019, (Right) January 17, 2022




