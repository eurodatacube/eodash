<template>
  <v-row class="d-flex">
    <v-col cols="12" class="justify-center align-center">
      <ul v-if="getCurrentNarratives">
        <li v-for="narrative in getCurrentNarratives.narratives"
         :key="narrative.routeName"
         @click="$router.push({name: narrative.routeName})">
          <p class="pa-1">
            <div class="dot"></div>
            {{ narrative.name }}
         </p>
        </li>
      </ul>
      <p v-else>Choose a domain</p>
    </v-col>
    </v-row>
</template>

<script>
export default {
  computed: {
    getDomainSlug() {
      return this.$store.state.gtif.currentDomain;
    },
    getCurrentNarratives() {
      return this.$store.state.gtif.domains.find((domain) => domain.slug === this.getDomainSlug);
    },
  },
};
</script>
<style scoped>
ul {
  list-style: none; /* Remove default bullets */
}
ul li{
  cursor: pointer;
}

.dot {
  height: 1rem;
  width: 1rem;
  border-radius: 50%;
  background-color: #00ae9d;
  display: inline-block;
}
</style>
