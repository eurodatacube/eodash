<template>
  <div v-if="isEnabled" class="modal-success">
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
          <v-btn class="green white--text" text @click="start()">Start Game</v-btn>
        </v-card-actions>
      </v-card>

      <v-card v-show="mode === 'gameover'">
        <v-card-title style="text-align: center" class="py-6">Oh no!</v-card-title>
        <v-card-text>
          You stepped on a mine and lost the game. Try again and beat your high score!
          <div class="game-stats">
            <div class="item">
              <span class="name">🌟 TOTAL UNCOVERED AREA</span>
              <span class="value">
                {{ Math.round(game.game.getUncoveredAreaPercent() * 100) }}%
              </span>
            </div>

            <div class="item">
              <span class="name">⬡ NUMBER OF CELLS</span>
              <span class="value">{{ game.game.fieldCount }}</span>
            </div>

            <div class="item">
              <span class="name">💣 NUMBER OF MINES</span>
              <span class="value">{{ game.game.mineCount }}</span>
            </div>

            <v-btn style="font-weight: bold;" ref="copy-btn" color="secondary" text @click="copyStatsToClipboard()">Copy to Clipboard</v-btn>
          </div>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn class="primary" text @click="close()">Continue</v-btn>
        </v-card-actions>
      </v-card>

      <v-card v-show="mode === 'win'">
        <v-card-title style="text-align: center" class="py-6">Woo-hoo! 🎉</v-card-title>
        <v-card-text>
          Congratulations, you uncovered all fields without stepping on a mine!
          <div class="game-stats">
            <div class="item">
              <span class="name">🌟 TOTAL ELAPSED TIME</span>
              <span class="value">{{ elapsedSeconds }}s</span>
            </div>

            <div class="item">
              <span class="name">⬡ NUMBER OF CELLS</span>
              <span class="value">{{ game.game.fieldCount }}</span>
            </div>

            <div class="item">
              <span class="name">💣 NUMBER OF MINES</span>
              <span class="value">{{ game.game.mineCount }}</span>
            </div>

            <v-btn style="font-weight: bold;" ref="copy-btn" color="secondary" text @click="copyStatsToClipboard()">Copy to Clipboard</v-btn>
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
    game: {
      type: Object,
      required: true,
    },
    elapsedSeconds: {
      type: Number,
      required: true,
    },
  },
  methods: {
    close() {
      this.$emit('close');
    },
    start() {
      document.dispatchEvent(new Event('minesweeper:start'));
      this.close();
    },
    copyStatsToClipboard() {
      const date = new Date();

      var string;

      if (this.mode === 'win') {
        string = `✨ #EOxMinesweeper Challenge ${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()}

🌟  TOTAL ELAPSED TIME: ${this.elapsedSeconds} seconds
🔳  NUMBER OF CELLS:    ${this.game.game.fieldCount}
💣  NUMBER OF MINES:    ${this.game.game.mineCount}`;
      } else if (this.mode === 'gameover') {
        string = `✨ #EOxMinesweeper Challenge ${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()}

🌟  TOTAL UNCOVERED AREA: ${Math.round(this.game.game.getUncoveredAreaPercent() * 100)}%
🔳  NUMBER OF CELLS:      ${this.game.game.fieldCount}
💣  NUMBER OF MINES:      ${this.game.game.mineCount}`;
      }

      navigator.clipboard.writeText(string);

      this.$refs['copy-btn'].$el.innerText = 'Copied!';
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
      font-size: 24px;
      margin-top: 8px;
      font-weight: 600;
      //color: #000;
    }
  }
}

.fullwidth {
  left: 0;
  top: 0;
}
</style>
