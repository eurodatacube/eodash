## About the Moving Trucks Indicator
Truck traffic is an important mode of cargo logistics in Europe, and the amount of roaming trucks may indicate how the economy of a country is performing. A new detection approach now facilitates extracting moving trucks from optical satellite imagery. 

The truck indicator shows if there has been an unnormal low or high number of trucks on primary roads and trucks within the respective region of interest. Truck detections are performed over non-cloudy areas, using all the available Copernicus Sentinel-2 acquisitions over the EU area between January 2020 and December 2021. 

## How is it generated
This indicator is based on a method that enables to detect trucks on a large scale using Sentinel-2 data. Sentinel-2 does not see a moving truck once but three times in the red-blue-green wavelengths. As the truck keeps traveling during this short time offset, it appears spectrally disassembled. This pattern may be used for detecting roaming trucks on roads. Although visual inspection cannot confirm that the objects are trucks, this is implied by the ratio between size of different vehicles and a Sentinel-2 pixel. However, a confusion with moving vehicles of similar size such as buses may occur. In order to generally reduce false detections the computation is constrained to road data from Open Street Maps (OSM). 
