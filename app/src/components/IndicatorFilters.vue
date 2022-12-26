<template>
  <ais-instant-search
    :search-client="searchClient"
    index-name="eodash"
    style="pointer-events: all"
  >
    <ais-search-box />
    <ais-hits>
      <div slot="item" slot-scope="{ item }">
        <p>{{item.city}}: {{ item.description }}</p>
      </div>
    </ais-hits>
  </ais-instant-search>
</template>

<script>
import countries from '@/assets/countries.json';
import TypesenseInstantSearchAdapter from "typesense-instantsearch-adapter";

const typesenseInstantsearchAdapter = new TypesenseInstantSearchAdapter({
  server: {
    apiKey: "xyz", // Be sure to use an API key that only allows search operations
    nodes: [
      {
        host: "localhost",
        path: '', // Optional. Example: If you have your typesense mounted in localhost:8108/typesense, path should be equal to '/typesense'
        port: "8108",
        protocol: "http",
      },
    ],
    cacheSearchResultsForSeconds: 2 * 60, // Cache search results from server. Defaults to 2 minutes. Set to 0 to disable caching.
  },
  // The following parameters are directly passed to Typesense's search API endpoint.
  //  So you can pass any parameters supported by the search endpoint below.
  //  query_by is required.
  additionalSearchParameters: {
    query_by: "description,indicatorName,country,city,themes,story",
    sort_by: "aoi(48.2, 16.4):asc",
    per_page: 20
  },
});
const searchClient = typesenseInstantsearchAdapter.searchClient;

export default {
  data() {
    return {
      searchClient,
    };
  },
  methods: {
    getStory(i) {
      let story
      try {
        story = require(`../../public${this.$store.state.config.appConfig.storyPath}${this.getLocationCode(i)}.md`);
      } catch {
        try {
          story = require(`../../public${this.$store.state.config.baseConfig.indicatorsDefinition[i.indicator].story}.md`);
        } catch {
          try {
            const indicator = Array.isArray(this.$store.state.features.featureFilters.indicators)
              ? this.$store.state.features.featureFilters.indicators[0]
              : this.$store.state.features.featureFilters.indicators;
            story = require(`../../public${this.$store.state.config.baseConfig.indicatorsDefinition[indicator].story}.md`);
          } catch {
            story = { default: '' };
          }
        }
      }
      return story.default
    },
    getCountry(cS) {
      const found = countries.features.find(c => c.properties.alpha2 === cS)
      return found ? found.properties.name : null
    }
  },
  // mounted() {
  //   setTimeout(() => {
  //     console.log(this.$store.state.features.allFeatures
  //       .map(f => f.properties.indicatorObject)
  //       .map(n => 
  //         {
  //           const f = {...n}
  //           delete f.id
  //           delete f.display
  //           return {
  //             ...f,
  //             aoi: f.aoi ? [f.aoi.lat, f.aoi.lon] : [0, 0],
  //             country: Array.isArray(f.country) ? this.getCountry(f.country[0]) : this.getCountry(f.country),
  //             story: this.getStory(f),
  //             themes: [
  //               ...this.$store.state.config.baseConfig.indicatorsDefinition[
  //                     f.indicator
  //                   ]?.themes
  //             ]
  //           }
  //         }
  //       ))
  //   }, 2000)
  // }
};
</script>