|Product Name| Distance to Settlements (Austrian National Survey Cadaster) |
| --- | --- |
| Spatial resolution | 13m |
| Temporal reference | 2022-10-01 |
| CRS | EPSG:31287 (MGI / Austria Lambert) |
| Spatial coverage | Austria (9.5°, 46.4°, 17.2°, 49.0°) |
| Value range | 0 – 8642 (m) |
| Product description | A distance to settlements layer is a continuous measure of how close a location is from the nearest settlement building. It is of use due to strict legal requirements for minimum proximity to settlement (setback) for certain wind power infrastructure, which is changeable in different municipalities across Austria (ranging from 2000 m to 750 m). This layer is derived from building footprints from the Austrian National Survey cadaster geopackage, maintained by the Bundesamt für Eich- und Vermessungswesen. The cadastral map was created by digitization of analogue cadastral maps dating from 1989-2005, followed by continuous updating using official land register decisions (Grundbuchsbeschlüsse), surveying (Amtshandlungen der Vermessungsämter), remote sensing data analysis (unspecified), and quality control measures (Qualitätsverbessernde Maßnahmen). The temporal reference, CRS, source URL, DOI, input datasets, reported accuracy, licence and WMS in this metadata relate to this geopackage. The distance to settlements layer was derived by rasterising the building footprints polygons at 12.992 m pixel spacing (with gdal_rasterize), creating a raster with distance to those footprints from pixel centroid (with gdal_proximity), finally reprojecting to EPSG: 3857 (Web Mercator) and output in cloud optimized geotiff. |
| Source URL | https://data.bev.gv.at/geonetwork/srv/ger/catalog.search#/metadata/d6d8069b-f734-4c5f-b54e-5b1005fd1521  |
| Source DOI | https://doi.org/10.48677/d6d8069b-f734-4c5f-b54e-5b1005fd1521 |
| Input datasets | Kataster Grafik Grundstücksverzeichnis GPKG (Austrian Cadaster graphics property register) |
| Reported accuracy | relative positional accuracy from <5 to <7 cm, actual positional accuracy within 25 m |
| License | https://creativecommons.org/licenses/by/4.0/ |
| WMS | https://data.bev.gv.at/geoserver/BEVdataKAT/wms?SERVICE=WMS&VERSION=1.3.0&REQUEST=GetCapabilities |