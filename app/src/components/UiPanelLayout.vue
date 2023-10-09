<template>
  <div class="layout-container" :style="`height: ${$vuetify.breakpoint.smAndUp ? '100%' : 'auto'};
                         ${$vuetify.breakpoint.smAndUp ? 'top : 0'
      : `bottom :${gtif ? $vuetify.application.footer : '0'}px`};`">
    <v-row class=" d-flex justify-space-between fill-height"
     v-if="$vuetify.breakpoint.smAndUp">
      <v-col :cols="3" style="max-height: 100%" >
        <v-expansion-panels>
          <slot name="left"></slot>
        </v-expansion-panels>
      </v-col>
      <v-col :cols="3" style="max-height: 100%" >
        <v-expansion-panels>
          <slot name="right"></slot>
        </v-expansion-panels>
      </v-col>
    </v-row>
    <div v-else class="d-flex align-end">
      <slot name="left"></slot>
      <slot name="right"></slot>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    gtif: {
      type: Boolean,
      default: false,
    },
  },
  data: () => ({

  }),
};
</script>

<style scoped>
.layout-container {
  position: absolute;
  left: 0;
  width: 100%;
  padding: 8px;
  pointer-events: none;
}
</style>
