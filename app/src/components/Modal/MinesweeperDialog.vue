<template>
  <div v-if="isEnabled" class="modal-success">
    <v-dialog v-model="isEnabled" width="500">
      <!-- Activator Slot -->
      <template v-slot:activator="{ on, attrs }">
        <v-btn v-bind="attrs" v-on="on">
          <span>
            💣 Open game dialog
          </span>
        </v-btn>
      </template>

      <!-- Default Slot for Dialog Content -->
      <v-card v-show="mode === 'start'">
        <v-card-title style="text-align: center" class="py-6">
          💣 Hexagonal Minesweeper Game
        </v-card-title>
        <v-card-text>
          <p>
            Welcome to the Minesweeper game mode! For more information look at the Description in the Information panel!
          </p>
          <p>
            <b>Quick overview:</b><br/>
            <ul>
              <li>The goal of the game is to <b>UNCOVER (left-click)</b> most tiles possible that do not have a 'mine', or in other words, tiles corresponding to areas with high <span v-if="indicatorObject.indicator === 'IND1_1_minesweeper'">health risks</span><span v-else-if="indicatorObject.indicator === 'IND2_1_minesweeper'">biodiversity</span>. Your <b>score</b> is based on <b>the percentage of uncovered area and time spent</b> at the end of the game.</li>
              <li>You can <b>FLAG (right-click)</b> the tiles with 'mines' (i.e. areas with very high health risk) to indicate they have a 'mine'.</li>
              <li><b>Hint:</b> Use visible layers to guide your exploration and uncover new tiles (left-click).</li>
            </ul>
            <p>
            A new location is available <b>daily</b> — come back tomorrow to explore more!
            </p>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn class="green white--text" text @click="start()">Start Game</v-btn>
        </v-card-actions>
      </v-card>

      <v-card v-show="mode === 'gameover'">
        <v-card-title style="text-align: center" class="py-6">Oh no!</v-card-title>
        <v-card-text>
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
            <div v-if="enableSpeciesDisplay">
              <h1 class="pa-2" v-if="mode === 'gameover'">Species Info</h1>
              <SpeciesList v-if="mode === 'gameover'" :species="sortedSpecies" />
            </div>

            <v-btn style="font-weight: bold;" ref="copy-btn" color="secondary"
              text @click="copyStatsToClipboard()">COPY RESULTS</v-btn>
              <p>
                Share your score on social media!
              </p>
              <p>
                <b>Come back tomorrow</b> for a new challenge and explore a fresh location!
              </p>
          </div>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text @click="newGame()">Restart Game</v-btn>
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
            <div v-if="enableSpeciesDisplay">
              <h2 style="margin-top: 24px; margin-bottom: 18px;">Discovered species:</h2>

              <SpeciesList v-if="mode === 'win'" :species="sortedSpecies" />
            </div>
            <v-btn style="font-weight: bold;" ref="copy-btn" color="secondary"
              text @click="copyStatsToClipboard()">Copy to Clipboard</v-btn>
          </div>
          <p>
            Share your score on social media!
          </p>
          <p>
            <b>Come back tomorrow</b> for a new challenge and explore a fresh location!
          </p>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text @click="newGame()">Restart Game</v-btn>
          <v-btn class="primary" text @click="close()">Continue</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { getSpeciesList } from '@/plugins/minesweeper/utils';
import SpeciesList from '../SpeciesList.vue';

export default {
  components: {
    SpeciesList,
  },
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
    bbox: {
      type: Array,
      default: () => [],
    },
    enableSpeciesDisplay: {
      type: Boolean,
      default: false,
    },
    indicatorObject: Object,
  },
  async mounted() {
    this.populateSpeciesList();
  },
  watch: {
    bbox() {
      this.populateSpeciesList();
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
    newGame() {
      document.dispatchEvent(new Event('minesweeper:restart'));
      this.close();
    },
    async populateSpeciesList() {
      if (!this.enableSpeciesDisplay) {
        return;
      }
      if (this.bbox.length !== 4) {
        console.error('Bounding box must be in format [minLong, minLat, maxLong, maxLat]!');
        return;
      }
      const sortedSpecies = await getSpeciesList(this.bbox);
      this.sortedSpecies = sortedSpecies;
    },
    copyStatsToClipboard() {
      const date = new Date();

      let string;

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
      if (this.enableSpeciesDisplay) {
        string += '\n\nDiscovered species:\n';
        string += this.sortedSpecies.reduce((accumulator, s) => `${accumulator}${s.species}${s.common_name === 'Unknown' ? '' : ` - ${s.common_name}`}\n`, '');
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
