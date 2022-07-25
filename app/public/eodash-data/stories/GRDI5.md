### Global Gridded Relative Deprivation Index (GRDI) VIIRS Night Lights (VNL) Constituent raster

This dataset is one component of the Global Gridded Relative Deprivation Index (GRDI), Version 1 (GRDIv1) data set which characterizes the relative levels of multidimensional deprivation and poverty in each 30 arc-second (~1 km) pixel, where a value of 100 represents the highest level of deprivation and a value of 0 the lowest. GRDIv1 is built from sociodemographic and satellite data inputs that were spatially harmonized, indexed, and weighted into six main components to produce the final index raster. Inputs were selected from the best-available data that either continuously vary across space or have at least administrative level 1 (provincial/state) resolution, and which have global spatial coverage. 


GRDIv1 has six input components, or dimensions, that are combined to determine the degree of relative deprivation:

- **The child dependency ratio (CDR)** defined as the ratio between the population of children (ages 0 to 14) to the working-age population (age 15 to 64), where a higher ratio implies a higher dependency on the working population (UN DESA 2006). We interpret the CDR as a dimension where higher dependency ratios, generally associated with younger age structures, imply higher relative deprivation. 
- **Infant mortality rates (IMRs)** defined as the number of deaths in children under 1 year of age per 1,000 live births in the same year, are a common indicator of population health (Reidpath & Allotey, 2003; Schell et al., 2007). Higher IMRs imply higher deprivation.
-  **The Subnational Human Development Index (SHDI)** attempts to assess human well-being through a combination of “three dimensions: education, health, and standard of living (Smits & Permanyer, 2019)”. Lower SHDIs imply higher deprivation. 
-  Global rural populations are more likely to experience a higher degree of multidimensional poverty when compared to urban populations, other things being equal (Castañeda et al., 2018; Laborde Debucquet & Martin, 2018; Lee & Kind, 2021; UN DESA, 2021; UNDP & OPHI, 2020). Therefore, we consider **the ratio of built-up area to non-built up area (BUILT)** as a dimension where low values imply higher deprivation. 
-  **Intensity of nighttime lights**, closely associated with anthropogenic activities, economic output, and infrastructure development (Elvidge et al., 2007; Ghosh et al., 2013; Lu et al., 2021; Small et al., 2013). We interpret the average intensity of nighttime lights for the year 2020 (VIIRS Night Lights (VNL) 2020) as a dimension where lower values imply higher deprivation. 
-  For the sixth component we calculated a **linear regression from annual VNL data between 2012 and 2020 (VNL slope) and considered the slope as a dimension where higher values (increasing brightness)** imply decreasing deprivation and lower values (decreasing brightness) imply increasing deprivation.

**Cite this dataset**: 

Center for International Earth Science Information Network - CIESIN - Columbia University. 2022. Global Gridded Relative Deprivation Index (GRDI), v1. Palisades, NY: NASA Socioeconomic Data and Applications Center (SEDAC). https://doi.org/10.7927/3xxe-ap97.  Accessed 29 June 2022.

**Data Access** 

The data are available as GEOTiff raster format for the Global Gridded Relative Deprivation Index (GRDI), v1 from the web page: https://alpha.sedac.ciesin.columbia.edu/data/set/povmap-grdi-v1

**Dataset Description and documentation accessible at**: Center for International Earth Science Information Network - CIESIN - Columbia University. 2022. Documentation for the Global Gridded Relative Deprivation Index (GRDI), v1. Palisades, NY: NASA Socioeconomic Data and Applications Center (SEDAC). https://doi.org/10.7927/xwf1-k532. Accessed 29 June 2022.


**References:**

Cardona, O.-D., van Aalst, M. K., Birkmann, J., Fordham, M., McGregor, G., Perez, R., Pulwarty, R. S., Schipper, E. L. F., Sinh, B. T., Décamps, H., Keim, M., Davis, I., Ebi, K. L., Lavell, A., Mechler, R., Murray, V., Pelling, M., Pohl, J., Smith, A.-O., & Thomalla, F. (2012). Determinants of Risk: Exposure and Vulnerability. In C. B. Field, V. Barros, T. F. Stocker, & Q. Dahe (Eds.), Managing the Risks of Extreme Events and Disasters to Advance Climate Change Adaptation (pp. 65–108). Cambridge University Press. https://doi.org/10.1017/CBO9781139177245.005

Castañeda, A., Doan, D., Newhouse, D., Nguyen, M. C., Uematsu, H., & Azevedo, J. P. (2018). A New Profile of the Global Poor. World Development, 101(C), 250–267.

Center For International Earth Science Information Network-CIESIN-Columbia University. (2015). A Step-by-Step Guide to Vulnerability Hotspots Mapping: Implementing the Spatial Index Approach. http://ciesin.columbia.edu/documents/vmapping_guide_final.pdf

Center For International Earth Science Information Network-CIESIN-Columbia University. (2018a). Documentation for the Gridded Population of the World, Version 4 (GPWv4), Revision 11 Data Sets. https://doi.org/10.7927/H45Q4T5F

Center For International Earth Science Information Network-CIESIN-Columbia University. (2018b). Gridded Population of the World, Version 4 (GPWv4): Basic Demographic Characteristics, Revision 11 [Data set]. Palisades, NY: NASA Socioeconomic Data and Applications Center (SEDAC). https://doi.org/10.7927/H46M34XX

Center For International Earth Science Information Network-CIESIN-Columbia University. (2018c). Gridded Population of the World, Version 4 (GPWv4): National Identifier Grid, Revision 11 [Data set]. Palisades, NY: NASA Socioeconomic Data and Applications Center (SEDAC). https://doi.org/10.7927/H4TD9VDP

Center For International Earth Science Information Network-CIESIN-Columbia University. (2021). Global Subnational Infant Mortality Rates, Version 2.01 (2015) [Data set]. Palisades, NY: NASA Socioeconomic Data and Applications Center (SEDAC). https://doi.org/10.7927/0GDN-6Y33

Chen, X., & Nordhaus, W. (2015). A Test of the New VIIRS Lights Data Set: Population and Economic Output in Africa. Remote Sensing, 7(4), 4937–4947. https://doi.org/10.3390/rs70404937

Dooley, C., Leasure, D., Boo, G., & Tatem, A. (2021). Gridded maps of building patterns throughout sub-Saharan Africa, version 2.0 [Data set]. University of Southampton. Southampton, UK. Source of building footprints “Ecopia Vector Maps Powered by Maxar Satellite Imagery”© 2020/2021. https://doi.org/10.5258/SOTON/WP00712

Elvidge, C. D., Safran, J., Tuttle, B., Sutton, P., Cinzano, P., Pettit, D., Arvesen, J., & Small, C. (2007). Potential for global mapping of development via a nightsat mission. GeoJournal, 69(1), 45–53. https://doi.org/10.1007/s10708-007-9104-x

Elvidge, C. D., Zhizhin, M., Ghosh, T., Hsu, F.-C., & Taneja, J. (2021). Annual Time Series of Global VIIRS Nighttime Lights Derived from Monthly Averages: 2012 to 2019. Remote Sensing, 13(5), 922. https://doi.org/10.3390/rs13050922

Facebook Connectivity Lab, & Center for International Earth Science Information Network - CIESIN - Columbia University. (2016). High Resolution Settlement Layer (HRSL). https://www.ciesin.columbia.edu/data/hrsl/

Geofabrik. (2018). OpenStreetMap Data Extracts. http://download.geofabrik.de/

Ghosh, T., Anderson, S. J., Elvidge, C. D., & Sutton, P. C. (2013). Using Nighttime Satellite Imagery as a Proxy Measure of Human Well-Being. Sustainability, 5(12), 4988–5019. https://doi.org/10.3390/su5124988

Global Data Lab. (2020, March). GDL Code & Shapefiles. Human Development Indices. https://globaldatalab.org/shdi/shapefiles/

Kummu, M., Taka, M., & Guillaume, J. H. A. (2018). Gridded global datasets for Gross Domestic Product and Human Development Index over 1990–2015. Scientific Data, 5(1), 180004. https://doi.org/10.1038/sdata.2018.4

Kummu, M., Taka, M., & Guillaume, J. H. A. (2020). Data from: Gridded global datasets for Gross Domestic Product and Human Development Index over 1990-2015 (Version 2, p. 481877286 bytes) [Data set]. Dryad. https://doi.org/10.5061/DRYAD.DK1J0

Laborde Debucquet, D., & Martin, W. (2018). Implications of the global growth slowdown for rural poverty. Agricultural Economics, 49(3), 325–338. https://doi.org/10.1111/agec.12419

Lee, Y. F., & Kind, M. (2021). Reducing poverty and inequality in rural areas: Key to inclusive development. https://www.un.org/development/desa/dspd/2021/05/reducing-poverty/

Lu, D., Wang, Y., Yang, Q., Su, K., Zhang, H., & Li, Y. (2021). Modeling Spatiotemporal Population Changes by Integrating DMSP-OLS and NPP-VIIRS Nighttime Light Data in Chongqing, China. Remote Sensing, 13(2), 284. https://doi.org/10.3390/rs13020284

Microsoft. (2019). CanadianBuildingFootprints (1.1) [Computer software]. Microsoft. https://github.com/microsoft/CanadianBuildingFootprints

OPHI. (2015a). Global Multidimensional Poverty Index. https://ophi.org.uk/multidimensional-poverty-index/

OPHI. (2015b). Policy – A Multidimensional Approach. https://ophi.org.uk/policy/multidimensional-poverty-index/

Ravallion, M., Chen, S., & Sangraula, P. (2007). New Evidence on the Urbanization of Global Poverty. Population and Development Review, 33(4), 667–701.

Reidpath, D., & Allotey, P. (2003). Infant mortality rate as an indicator of population health. Journal of Epidemiology and Community Health, 57(5), 344–346. https://doi.org/10.1136/jech.57.5.344

Rignall, K., & Atia, M. (2017). The global rural: Relational geographies of poverty and uneven development. Geography Compass, 11(7), e12322. https://doi.org/10.1111/gec3.12322

Schell, C. O., Reilly, M., Rosling, H., Peterson, S., & Ekstrӧm, A. M. (2007). Socioeconomic determinants of infant mortality: A worldwide study of 152 low-, middle-, and high-income countries. Scandinavian Journal of Public Health, 35(3), 288–297.

Small, C., Elvidge, C. D., & Baugh, K. (2013). Mapping urban structure and spatial connectivity with VIIRS and OLS night light imagery. Joint Urban Remote Sensing Event 2013, 230–233. https://doi.org/10.1109/JURSE.2013.6550707

Smits, J., & Permanyer, I. (2019). The Subnational Human Development Database. Scientific Data, 6(1), 190038. https://doi.org/10.1038/sdata.2019.38

Smits, J., & Steendijk, R. (2015). The International Wealth Index (IWI). Social Indicators Research, 122(1), 65–85. https://doi.org/10.1007/s11205-014-0683-x

UN Department of Economic and Social Affairs (DESA). (2006). Dependency Ratio. https://www.un.org/esa/sustdev/natlinfo/indicators/methodology_sheets/demographics/dependency_ratio.pdf

UN Department of Economic and Social Affairs (DESA). (2021). World Social Report 2021: Reconsidering Rural Development.

UN Development Programme (UNDP). (2018). What Does it Mean to Leave No One Behind: A UNDP Discussion Paper and Framework for Implementation (p. 29). Bureau for Policy and Programme Support. https://www.undp.org/publications/what-does-it-mean-leave-no-one-behind

UN Development Programme (UNDP). (2020). Human Development Report 2020. Human Development Report 2020 | UNDP HDR. http://report.hdr.undp.org

UN Development Programme (UNDP) & OPHI. (2020). Global Multidimensional Poverty Index 2020—Charting pathways out of multidimensional poverty: Achieving the SDGs.

UN General Assembly (UNGA). (2015). Transforming our world: The 2030 Agenda for Sustainable Development (A/RES/70/1). http://www.un.org/ga/search/view_doc.asp?symbol=A/RES/70/1&Lang=E

World Bank. (2020). Poverty and Shared Prosperity 2020: Reversals of Fortune – Frequently Asked Questions. World Bank. https://www.worldbank.org/en/research/brief/poverty-and-shared-prosperity-2020-reversals-of-fortune-frequently-asked-questions