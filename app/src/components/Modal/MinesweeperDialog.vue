<template>
  <div class="modal-success">
    <v-dialog v-model="isEnabled" width="500">
      <!-- Activator Slot -->
      <template v-slot:activator="{ on, attrs }">
        <v-btn v-bind="attrs" v-on="on">
          <span>
            💣
          </span>
        </v-btn>
      </template>

      <!-- Default Slot for Dialog Content -->
      <v-card v-show="mode === 'start'">
        <v-card-title style="text-align: center" class="py-6">💣 Minesweeper Game</v-card-title>
        <v-card-text>
          Try to uncover all fields while carefully avoiding mines and learn about
          Earth Observation data along the way. The amount of uncovered area at the
          end of the game determines your score!
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn class="green white--text" text @click="close()">Start Game</v-btn>
        </v-card-actions>
      </v-card>

      <v-card v-show="mode === 'gameOver'">
        <v-card-title style="text-align: center" class="py-6">Oh no!</v-card-title>
        <v-card-text>
          You stepped on a mine and lost the game. Try again and beat your high score!
          <div class="game-stats">
            <div class="item">
              <span class="name">🌟 TOTAL UNCOVERED AREA</span>
              <span class="value">37%</span>
            </div>

            <div class="item">
              <span class="name">⬡ NUMBER OF CELLS</span>
              <span class="value">800</span>
            </div>

            <div class="item">
              <span class="name">💣 NUMBER OF MINES</span>
              <span class="value">276</span>
            </div>
          </div>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn class="primary" text @click="close()">Continue</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  props: {
    /**
     * The context in which this modal is used. One of 'dashboard' or 'newsletter'.
     * Changing this parameter changes this modal's title and subtitle as well as
     * the arrangement of its inputs.
     */
    mode: {
      type: String,
      default: 'start',
    },
    isEnabled: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    close() {
      this.$emit('close');
    },
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

.mobile-modal {
  position: fixed;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
}

.game-stats {
  display: flex;
  flex-direction: column;
  align-items: center;

  margin: 20px 0;

  .item {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 16px;

    .name {
      font-weight: 500;
      font-size: 16px;
    }

    .value {
      font-size: 21px;
      font-weight: 600;
      color: #000;
    }
  }
}

.fullwidth {
  left: 0;
  top: 0;
}
</style>
