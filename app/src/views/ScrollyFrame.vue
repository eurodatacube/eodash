<template>
  <div
    class="fill-height scrollContainer"
    :style="`margin-top: ${$vuetify.application.top}px !important;`"
  >
    <div
      class="fill-height"
    >
      <global-header />

      <iframe
        id="resizableIframe"
        @load="onLoaded"
        v-resize="onResize"
        width="100%"
        style="height: calc((var(--vh), 1vh) * 100) !important;"
        src="./scrolly.html"
        frameborder="0"
      ></iframe>
      <global-footer />
    </div>
  </div>
</template>

<script>
import {
  mapState,
} from 'vuex';

import axios from 'axios';
import iFrameResize from 'iframe-resizer/js/iframeResizer';
import GlobalFooter from '@/components/GlobalFooter.vue';
import GlobalHeader from '@/components/GlobalHeader.vue';

export default {
  components: {
    GlobalHeader,
    GlobalFooter,
  },
  metaInfo() {
    const { appConfig } = this.$store.state.config;
    return {
      title: appConfig ? appConfig.branding.appName : 'eodash',
    };
  },
  computed: {
    ...mapState('config', ['appConfig']),
  },
  methods: {
    async onLoaded() {
      try {
        const response = await axios
          .get(`https://${process.env.NODE_ENV !== 'production'
            ? 'dev-'
            : ''}eodash-dashboard-api.f77a4d8a-acde-4ddd-b1cd-b2b6afe83d7a.hub.eox.at/get?id=${
            this.$route.query.id || '9dd9f2b6743c9746' // fallback default TODO remove
            // /dashboard?id=9dd9f2b6743c9746&editKey=0017ee8a3e16f9b8
          }`)
        const arr = [
          [
            {
              "width": 4,
              "text": "<style>\n.heroButton {\nbackground: #e8e8e4;\npadding: 5px;\nmargin: 2rem 1rem;\n}\n</style>\n<div style=\"display: flex; align-items: center; justify-content: center; height: 100%; background: #00ae9d; padding: 200px 0\">\n<div style=\"text-align: center\">\n<h1 style=\"color:white\">GTIF</h1>\n<h2 style=\"color:white\">Green Transition Information Factory</h2>\n<br />\n<p style=\"color:white\">Here's where you can find actionable tools for your Green Transition based on Earth Observation data, information and services</p>\n<div style=\"display: flex; justify-content: center\">\n<button class=\"heroButton\">EU TARGETS</button>\n<button class=\"heroButton\">EXPLORE TOOLS</button>\n<button class=\"heroButton\">DOMAINS</button>\n</div>\n</div>\n</div>",
              "id": "Intro-1664191617486",
              "title": "Intro",
              "__generatedText__": "&lt;style&gt;\n.heroButton {\nbackground: #e8e8e4;\npadding: 5px;\nmargin: 2rem 1rem;\n}\n&lt;/style&gt;\n<div>\n<div>\n<h1>GTIF</h1>\n<h2>Green Transition Information Factory</h2>\n<br />\n<p>Here's where you can find actionable tools for your Green Transition based on Earth Observation data, information and services</p>\n<div>\n&lt;button class=\"heroButton\"&gt;EU TARGETS&lt;/button&gt;\n&lt;button class=\"heroButton\"&gt;EXPLORE TOOLS&lt;/button&gt;\n&lt;button class=\"heroButton\"&gt;DOMAINS&lt;/button&gt;\n</div>\n</div>\n</div>"
            },
          ],
          [
            {
              "width": 1,
              "text": "By combining and correlating human presence with air pollutants, you can analyze human mobility.\n\nHere you can see data in Austria from January 2019 to July 2022.\n\nThis is some **markdown text**. This is a [link](#).\n\nLorem ipsum dolor sit amet, consectetur adipiscing elit. Cras accumsan aliquam consequat. Vivamus aliquam orci augue, eu feugiat ante venenatis et. Pellentesque ut massa vitae odio efficitur vestibulum. Vivamus ultricies quam non sapien vehicula molestie. Ut nisl neque, facilisis a commodo id, aliquam at libero. Suspendisse dapibus sodales dui, et aliquam lectus porttitor non. Quisque volutpat ante a sapien tempor, a faucibus lectus faucibus.",
              "id": "Text 1-1663569453921",
              "title": "Text 1",
              "__generatedText__": "<p>By combining and correlating human presence with air pollutants, you can analyze human mobility.</p>\n<p>Here you can see data in Austria from January 2019 to July 2022.</p>\n<p>This is some <strong>markdown text</strong>. This is a <a href=\"#\">link</a>.</p>\n<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras accumsan aliquam consequat. Vivamus aliquam orci augue, eu feugiat ante venenatis et. Pellentesque ut massa vitae odio efficitur vestibulum. Vivamus ultricies quam non sapien vehicula molestie. Ut nisl neque, facilisis a commodo id, aliquam at libero. Suspendisse dapibus sodales dui, et aliquam lectus porttitor non. Quisque volutpat ante a sapien tempor, a faucibus lectus faucibus.</p>\n"
            },
            {
              "width": 3,
              "text": "<--IMG-->./img/gtif/pollution.gif<--IMG-->",
              "id": "Pollution-1663569442878",
              "title": "Pollution"
            },
            {
              "width": 1,
              "text": "The Xingu River, which flows within the Amazon Basin of central-eastern Brazil, is shown in this Envisat image, which highlights the contrast between the rainforest and sprawling urbanisation.\n\nUrbanisation has increased all over the world with people moving away from rural areas to towns and cities. Brazil has a relatively high level of urbanisation with an estimated 8 out of 10 people living in cities – roughly 144 million out of 180 million.\n\nThis growth needs to be monitored to ensure it proceeds on a sustainable basis, does not damage environmental resources and does not worsen the quality and life and safety of urban dwellers.\n\nEarth Observation-derived maps of land use change show how cities expand over time. In the field of risk management, satellite imagery can characterise urban environments to a degree of accuracy simply not available on the ground.\n",
              "id": "Text 2-1663569557710",
              "title": "Text 2",
              "__generatedText__": "<p>The Xingu River, which flows within the Amazon Basin of central-eastern Brazil, is shown in this Envisat image, which highlights the contrast between the rainforest and sprawling urbanisation.</p>\n<p>Urbanisation has increased all over the world with people moving away from rural areas to towns and cities. Brazil has a relatively high level of urbanisation with an estimated 8 out of 10 people living in cities – roughly 144 million out of 180 million.</p>\n<p>This growth needs to be monitored to ensure it proceeds on a sustainable basis, does not damage environmental resources and does not worsen the quality and life and safety of urban dwellers.</p>\n<p>Earth Observation-derived maps of land use change show how cities expand over time. In the field of risk management, satellite imagery can characterise urban environments to a degree of accuracy simply not available on the ground.</p>\n"
            },
            {
              "width": 3,
              "text": "<--IMG-->https://www.esa.int/var/esa/storage/images/esa_multimedia/images/2010/03/climate_change_deforestation_brazil/10092063-2-eng-GB/Climate_change_deforestation_Brazil_pillars.jpg<--IMG-->",
              "id": "Image 2-1663579366065",
              "title": "Image 2",
              "__generatedText__": "<p>&lt;--IMG--&gt;<a href=\"https://www.esa.int/var/esa/storage/images/esa_multimedia/images/2010/03/climate_change_deforestation_brazil/10092063-2-eng-GB/Climate_change_deforestation_Brazil_pillars.jpg\">https://www.esa.int/var/esa/storage/images/esa_multimedia/images/2010/03/climate_change_deforestation_brazil/10092063-2-eng-GB/Climate_change_deforestation_Brazil_pillars.jpg</a>&lt;--IMG--&gt;</p>\n"
            },
          ],
          [
            {
              "width": 4,
              "text": "This is a full width text block. Phasellus iaculis enim eleifend magna dapibus sagittis. Nam rutrum orci diam, id vehicula nibh molestie vel. Vestibulum eget lacus in nibh sagittis ultricies a ac velit. Vestibulum nec commodo tortor, quis aliquam orci. Quisque eleifend augue vitae tincidunt gravida. Donec id tristique ex. Suspendisse lacinia vehicula euismod. Suspendisse ornare sagittis turpis, id placerat nulla tincidunt quis. Vivamus ultricies condimentum mollis.",
              "id": "Title-1664288983701",
              "title": "Title",
              "__generatedText__": "<p>This is a full width text block. Phasellus iaculis enim eleifend magna dapibus sagittis. Nam rutrum orci diam, id vehicula nibh molestie vel. Vestibulum eget lacus in nibh sagittis ultricies a ac velit. Vestibulum nec commodo tortor, quis aliquam orci. Quisque eleifend augue vitae tincidunt gravida. Donec id tristique ex. Suspendisse lacinia vehicula euismod. Suspendisse ornare sagittis turpis, id placerat nulla tincidunt quis. Vivamus ultricies condimentum mollis.</p>\n"
            },
          ],
          [
            {
              "width": 1,
              "text": "\n\nLorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris vel dui vitae nulla consequat varius. Duis fermentum condimentum urna eu placerat. Mauris nec tortor orci. Aenean pellentesque rhoncus mauris accumsan pellentesque. Maecenas iaculis in felis in laoreet. Proin ex justo, egestas at accumsan eget, lobortis non odio. Aenean consequat fermentum felis, a cursus nibh fermentum at. Fusce congue odio eget nunc molestie varius. Integer ut erat suscipit, imperdiet leo non, volutpat diam.\n\nPhasellus dolor nunc, facilisis eget accumsan eget, fermentum et justo. Nullam non diam leo. Sed at consectetur nisl, id tempor justo. Quisque pulvinar tincidunt aliquam. Donec consequat sem id nibh commodo aliquam. Integer bibendum enim turpis, vitae tincidunt turpis porta id. In eget est eget ipsum efficitur porta quis eu odio.\n\nVestibulum ipsum diam, porta nec massa quis, tincidunt aliquet sem. Praesent facilisis dignissim risus non suscipit. Morbi vitae sollicitudin sapien. Ut vel ex sed velit hendrerit dapibus at at metus. Vestibulum sit amet purus turpis. Etiam pharetra massa sed lorem suscipit, euismod hendrerit felis ornare. Maecenas a tristique odio, vel volutpat orci. Sed iaculis vitae turpis vitae porta. Aenean id fermentum sapien. Fusce eget tristique urna, eu eleifend enim.\n\nNulla sodales porttitor urna, vel fringilla velit aliquet vel. Sed fringilla massa odio, sit amet feugiat arcu fermentum imperdiet. Donec in nibh eget nisi porta tincidunt et vel est. Vivamus dapibus, mi ut facilisis hendrerit, risus augue vehicula risus, non fringilla quam nulla eget dolor. Cras nulla nulla, mollis ut placerat ac, hendrerit ac elit. Morbi eleifend magna non dui condimentum fermentum. Quisque sit amet mi eu lacus viverra varius. Sed a mauris dictum, ullamcorper nulla ut, rutrum metus. Nullam eros quam, rhoncus vel mattis ut, rutrum at dui. Mauris placerat scelerisque neque a semper. Nunc sodales aliquet eleifend. Sed sit amet metus sed tortor consequat tempor ut sit amet diam.\n\nMauris congue ultrices libero, non faucibus tortor. Aliquam porta lorem ut rutrum lobortis. Nam porta venenatis gravida. In aliquet dapibus metus, eget dapibus turpis euismod sit amet. Mauris quis feugiat arcu. Mauris tempus lorem at velit imperdiet porta. Sed mollis pulvinar justo, vel porta purus maximus quis. Aliquam vehicula, dolor vel posuere eleifend, leo ante rhoncus orci, a vulputate orci erat id nulla. Aliquam eget tellus posuere, efficitur sem quis, sodales dolor. Quisque est nibh, aliquet in viverra id, lacinia ac orci. Nunc enim velit, mollis vitae ante in, venenatis tincidunt mauris. ",
              "id": "Text 3-1663589436733",
              "title": "Text 3",
              "__generatedText__": "<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris vel dui vitae nulla consequat varius. Duis fermentum condimentum urna eu placerat. Mauris nec tortor orci. Aenean pellentesque rhoncus mauris accumsan pellentesque. Maecenas iaculis in felis in laoreet. Proin ex justo, egestas at accumsan eget, lobortis non odio. Aenean consequat fermentum felis, a cursus nibh fermentum at. Fusce congue odio eget nunc molestie varius. Integer ut erat suscipit, imperdiet leo non, volutpat diam.</p>\n<p>Phasellus dolor nunc, facilisis eget accumsan eget, fermentum et justo. Nullam non diam leo. Sed at consectetur nisl, id tempor justo. Quisque pulvinar tincidunt aliquam. Donec consequat sem id nibh commodo aliquam. Integer bibendum enim turpis, vitae tincidunt turpis porta id. In eget est eget ipsum efficitur porta quis eu odio.</p>\n<p>Vestibulum ipsum diam, porta nec massa quis, tincidunt aliquet sem. Praesent facilisis dignissim risus non suscipit. Morbi vitae sollicitudin sapien. Ut vel ex sed velit hendrerit dapibus at at metus. Vestibulum sit amet purus turpis. Etiam pharetra massa sed lorem suscipit, euismod hendrerit felis ornare. Maecenas a tristique odio, vel volutpat orci. Sed iaculis vitae turpis vitae porta. Aenean id fermentum sapien. Fusce eget tristique urna, eu eleifend enim.</p>\n<p>Nulla sodales porttitor urna, vel fringilla velit aliquet vel. Sed fringilla massa odio, sit amet feugiat arcu fermentum imperdiet. Donec in nibh eget nisi porta tincidunt et vel est. Vivamus dapibus, mi ut facilisis hendrerit, risus augue vehicula risus, non fringilla quam nulla eget dolor. Cras nulla nulla, mollis ut placerat ac, hendrerit ac elit. Morbi eleifend magna non dui condimentum fermentum. Quisque sit amet mi eu lacus viverra varius. Sed a mauris dictum, ullamcorper nulla ut, rutrum metus. Nullam eros quam, rhoncus vel mattis ut, rutrum at dui. Mauris placerat scelerisque neque a semper. Nunc sodales aliquet eleifend. Sed sit amet metus sed tortor consequat tempor ut sit amet diam.</p>\n<p>Mauris congue ultrices libero, non faucibus tortor. Aliquam porta lorem ut rutrum lobortis. Nam porta venenatis gravida. In aliquet dapibus metus, eget dapibus turpis euismod sit amet. Mauris quis feugiat arcu. Mauris tempus lorem at velit imperdiet porta. Sed mollis pulvinar justo, vel porta purus maximus quis. Aliquam vehicula, dolor vel posuere eleifend, leo ante rhoncus orci, a vulputate orci erat id nulla. Aliquam eget tellus posuere, efficitur sem quis, sodales dolor. Quisque est nibh, aliquet in viverra id, lacinia ac orci. Nunc enim velit, mollis vitae ante in, venenatis tincidunt mauris. </p>\n"
            },
            {
              "width": 3,
              "title": "Sullom Voe, Crude Oil Storage Index",
              "id": "100058-OX@1663590403552"
            },
          ],
          [
            {
              "width": 4,
              "text": "This is another full width text block. Phasellus iaculis enim eleifend magna dapibus sagittis. Nam rutrum orci diam, id vehicula nibh molestie vel. Vestibulum eget lacus in nibh sagittis ultricies a ac velit. Vestibulum nec commodo tortor, quis aliquam orci. Quisque eleifend augue vitae tincidunt gravida. Donec id tristique ex. Suspendisse lacinia vehicula euismod. Suspendisse ornare sagittis turpis, id placerat nulla tincidunt quis. Vivamus ultricies condimentum mollis.",
              "id": "Title-1664289032770",
              "title": "Title",
              "__generatedText__": "<p>This is another full width text block. Phasellus iaculis enim eleifend magna dapibus sagittis. Nam rutrum orci diam, id vehicula nibh molestie vel. Vestibulum eget lacus in nibh sagittis ultricies a ac velit. Vestibulum nec commodo tortor, quis aliquam orci. Quisque eleifend augue vitae tincidunt gravida. Donec id tristique ex. Suspendisse lacinia vehicula euismod. Suspendisse ornare sagittis turpis, id placerat nulla tincidunt quis. Vivamus ultricies condimentum mollis.</p>\n"
            },
            {
              "width": 4,
              "text": "And another. Phasellus iaculis enim eleifend magna dapibus sagittis. Nam rutrum orci diam, id vehicula nibh molestie vel. Vestibulum eget lacus in nibh sagittis ultricies a ac velit. Vestibulum nec commodo tortor, quis aliquam orci. Quisque eleifend augue vitae tincidunt gravida. Donec id tristique ex. Suspendisse lacinia vehicula euismod. Suspendisse ornare sagittis turpis, id placerat nulla tincidunt quis. Vivamus ultricies condimentum mollis.",
              "id": "Title-1664289064489",
              "title": "Title",
              "__generatedText__": "<p>And another. Phasellus iaculis enim eleifend magna dapibus sagittis. Nam rutrum orci diam, id vehicula nibh molestie vel. Vestibulum eget lacus in nibh sagittis ultricies a ac velit. Vestibulum nec commodo tortor, quis aliquam orci. Quisque eleifend augue vitae tincidunt gravida. Donec id tristique ex. Suspendisse lacinia vehicula euismod. Suspendisse ornare sagittis turpis, id placerat nulla tincidunt quis. Vivamus ultricies condimentum mollis.</p>\n"
            },
          ],
          [
            {
              "width": 1,
              "text": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris vel dui vitae nulla consequat varius. Duis fermentum condimentum urna eu placerat. Mauris nec tortor orci. Aenean pellentesque rhoncus mauris accumsan pellentesque. Maecenas iaculis in felis in laoreet. Proin ex justo, egestas at accumsan eget, lobortis non odio. Aenean consequat fermentum felis, a cursus nibh fermentum at. Fusce congue odio eget nunc molestie varius. Integer ut erat suscipit, imperdiet leo non, volutpat diam.\n\nPhasellus dolor nunc, facilisis eget accumsan eget, fermentum et justo. Nullam non diam leo. Sed at consectetur nisl, id tempor justo. Quisque pulvinar tincidunt aliquam. Donec consequat sem id nibh commodo aliquam. Integer bibendum enim turpis, vitae tincidunt turpis porta id. In eget est eget ipsum efficitur porta quis eu odio.\n\nVestibulum ipsum diam, porta nec massa quis, tincidunt aliquet sem. Praesent facilisis dignissim risus non suscipit. Morbi vitae sollicitudin sapien. Ut vel ex sed velit hendrerit dapibus at at metus. Vestibulum sit amet purus turpis. Etiam pharetra massa sed lorem suscipit, euismod hendrerit felis ornare. Maecenas a tristique odio, vel volutpat orci. Sed iaculis vitae turpis vitae porta. Aenean id fermentum sapien. Fusce eget tristique urna, eu eleifend enim.\n\nNulla sodales porttitor urna, vel fringilla velit aliquet vel. Sed fringilla massa odio, sit amet feugiat arcu fermentum imperdiet. Donec in nibh eget nisi porta tincidunt et vel est. Vivamus dapibus, mi ut facilisis hendrerit, risus augue vehicula risus, non fringilla quam nulla eget dolor. Cras nulla nulla, mollis ut placerat ac, hendrerit ac elit. Morbi eleifend magna non dui condimentum fermentum. Quisque sit amet mi eu lacus viverra varius. Sed a mauris dictum, ullamcorper nulla ut, rutrum metus. Nullam eros quam, rhoncus vel mattis ut, rutrum at dui. Mauris placerat scelerisque neque a semper. Nunc sodales aliquet eleifend. Sed sit amet metus sed tortor consequat tempor ut sit amet diam.\n\nMauris congue ultrices libero, non faucibus tortor. Aliquam porta lorem ut rutrum lobortis. Nam porta venenatis gravida. In aliquet dapibus metus, eget dapibus turpis euismod sit amet. Mauris quis feugiat arcu. Mauris tempus lorem at velit imperdiet porta. Sed mollis pulvinar justo, vel porta purus maximus quis. Aliquam vehicula, dolor vel posuere eleifend, leo ante rhoncus orci, a vulputate orci erat id nulla. Aliquam eget tellus posuere, efficitur sem quis, sodales dolor. Quisque est nibh, aliquet in viverra id, lacinia ac orci. Nunc enim velit, mollis vitae ante in, venenatis tincidunt mauris.",
              "id": "Text 4-1663592346571",
              "title": "Text 4",
              "__generatedText__": "<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris vel dui vitae nulla consequat varius. Duis fermentum condimentum urna eu placerat. Mauris nec tortor orci. Aenean pellentesque rhoncus mauris accumsan pellentesque. Maecenas iaculis in felis in laoreet. Proin ex justo, egestas at accumsan eget, lobortis non odio. Aenean consequat fermentum felis, a cursus nibh fermentum at. Fusce congue odio eget nunc molestie varius. Integer ut erat suscipit, imperdiet leo non, volutpat diam.</p>\n<p>Phasellus dolor nunc, facilisis eget accumsan eget, fermentum et justo. Nullam non diam leo. Sed at consectetur nisl, id tempor justo. Quisque pulvinar tincidunt aliquam. Donec consequat sem id nibh commodo aliquam. Integer bibendum enim turpis, vitae tincidunt turpis porta id. In eget est eget ipsum efficitur porta quis eu odio.</p>\n<p>Vestibulum ipsum diam, porta nec massa quis, tincidunt aliquet sem. Praesent facilisis dignissim risus non suscipit. Morbi vitae sollicitudin sapien. Ut vel ex sed velit hendrerit dapibus at at metus. Vestibulum sit amet purus turpis. Etiam pharetra massa sed lorem suscipit, euismod hendrerit felis ornare. Maecenas a tristique odio, vel volutpat orci. Sed iaculis vitae turpis vitae porta. Aenean id fermentum sapien. Fusce eget tristique urna, eu eleifend enim.</p>\n<p>Nulla sodales porttitor urna, vel fringilla velit aliquet vel. Sed fringilla massa odio, sit amet feugiat arcu fermentum imperdiet. Donec in nibh eget nisi porta tincidunt et vel est. Vivamus dapibus, mi ut facilisis hendrerit, risus augue vehicula risus, non fringilla quam nulla eget dolor. Cras nulla nulla, mollis ut placerat ac, hendrerit ac elit. Morbi eleifend magna non dui condimentum fermentum. Quisque sit amet mi eu lacus viverra varius. Sed a mauris dictum, ullamcorper nulla ut, rutrum metus. Nullam eros quam, rhoncus vel mattis ut, rutrum at dui. Mauris placerat scelerisque neque a semper. Nunc sodales aliquet eleifend. Sed sit amet metus sed tortor consequat tempor ut sit amet diam.</p>\n<p>Mauris congue ultrices libero, non faucibus tortor. Aliquam porta lorem ut rutrum lobortis. Nam porta venenatis gravida. In aliquet dapibus metus, eget dapibus turpis euismod sit amet. Mauris quis feugiat arcu. Mauris tempus lorem at velit imperdiet porta. Sed mollis pulvinar justo, vel porta purus maximus quis. Aliquam vehicula, dolor vel posuere eleifend, leo ante rhoncus orci, a vulputate orci erat id nulla. Aliquam eget tellus posuere, efficitur sem quis, sodales dolor. Quisque est nibh, aliquet in viverra id, lacinia ac orci. Nunc enim velit, mollis vitae ante in, venenatis tincidunt mauris.</p>\n"
            },
            {
              "width": 3,
              "text": "<--VID-->https://dlmultimedia.esa.int/download/public/videos/2018/01/004/1801_004_AR_EN.mp4<--VID-->",
              "id": "Video-1663589449242",
              "title": "Video",
              "__generatedText__": "<p>&lt;--VID--&gt;<a href=\"https://dlmultimedia.esa.int/download/public/videos/2018/01/004/1801_004_AR_EN.mp4\">https://dlmultimedia.esa.int/download/public/videos/2018/01/004/1801_004_AR_EN.mp4</a>&lt;--VID--&gt;</p>\n"
            },
            {
              "width": 1,
              "text": "Another markdown **text**",
              "id": "Text 5-1663593765531",
              "title": "Text 5",
              "__generatedText__": "<p>Another markdown <strong>text</strong></p>\n"
            },
            {
              "width": 3,
              "mapInfo": {
                "zoom": 9.168942566694195,
                "compareLayerTime": null,
                "center": {
                  "lng": 11.876817453443905,
                  "lat": 45.150501557193735
                }
              },
              "id": "NorthAdriatic-N3a2@1663593802984",
              "title": "North Adriatic - Chlorophyll-a concentration, Water Quality Regional Maps"
            },
          ],
          [
            {
              "width": 4,
              "text": "Last full width text block. Phasellus iaculis enim eleifend magna dapibus sagittis. Nam rutrum orci diam, id vehicula nibh molestie vel. Vestibulum eget lacus in nibh sagittis ultricies a ac velit. Vestibulum nec commodo tortor, quis aliquam orci. Quisque eleifend augue vitae tincidunt gravida. Donec id tristique ex. Suspendisse lacinia vehicula euismod. Suspendisse ornare sagittis turpis, id placerat nulla tincidunt quis. Vivamus ultricies condimentum mollis.",
              "id": "Title-1664289102305",
              "title": "Title",
              "__generatedText__": "<p>Last full width text block. Phasellus iaculis enim eleifend magna dapibus sagittis. Nam rutrum orci diam, id vehicula nibh molestie vel. Vestibulum eget lacus in nibh sagittis ultricies a ac velit. Vestibulum nec commodo tortor, quis aliquam orci. Quisque eleifend augue vitae tincidunt gravida. Donec id tristique ex. Suspendisse lacinia vehicula euismod. Suspendisse ornare sagittis turpis, id placerat nulla tincidunt quis. Vivamus ultricies condimentum mollis.</p>\n"
            }
          ],
        ];

        document.querySelector('iframe').contentWindow.postMessage(arr);
      } catch (error) {
        console.error(`Error loading dashboard data: ${error}`);
      }
    },
    onResize() {
      iFrameResize({
        // log: true,
        checkOrigin: false,
        inPageLinks: false,
        sizeHeight: false,
        scrolling: true,
        minHeight: this.minHeight || 700,
      }, '#resizableIframe');
    },
  },
};
</script>

<style lang="scss" scoped>
.header__logo {
    height: 32px;
}

#content {
  width: 1px;
  min-width: 100%;
  height: 100%;
  border: none;
}
</style>
