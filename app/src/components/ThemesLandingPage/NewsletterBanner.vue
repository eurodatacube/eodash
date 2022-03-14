<template>
  <v-card class="eodash-newsletter-banner pa-6">
    <div class="close-button">
      <v-icon>mdi-close</v-icon>
    </div>
    <v-row v-if="$vuetify.breakpoint.smAndDown">
      <v-col>
        <h3>{{ heading }}</h3>

        <p>{{ description }}</p>

        <v-text-field
          label="Email address"
          block
        />

        <v-btn
          color="primary"
          block
        >
          Subscribe
        </v-btn>
      </v-col>
    </v-row>

    <v-row justify="space-between" align-content="center" class="align-center" v-else>
      <v-col class="pr-16">
        <h3>{{ heading }}</h3>

        <p style="margin: 0">{{ description }}</p>
      </v-col>

      <v-text-field
        label="Email address"
        class="mr-8"
      />

      <v-btn
        color="primary"
        class="mr-16"
      >
        Subscribe
      </v-btn>
    </v-row>
  </v-card>
</template>

<script>
import Vue from 'vue';

export default {
  data: () => ({
    heading: 'Subscribe to our newsletter',
    description: 'Get the latest updates to our platform, delivered straight to your inbox.',
  }),
  computed: {
    paddingClasses () {
      switch (this.$vuetify.breakpoint.name) {
        case 'xs': return ['pa-4']
        case 'sm': return ['pa-4']
        case 'md': return ['pa-12']
        case 'lg': return ['pa-12']
        case 'xl': return ['pa-12']
      }
    }
  },
  mounted() {
    
  },
  methods: {
    
  },
};
</script>

<style lang="scss" scoped>
.eodash-newsletter-banner {
  position: relative;

  .close-button {
    position: absolute;
    right: 18px;
    top: 18px;
    width: 32px;
    height: 32px;
    cursor: pointer;
  }
}
</style>
