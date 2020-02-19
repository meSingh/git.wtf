<template>
<div class="pt-4 md:pt-1 md:mr-4 lg:mr-8 md:ml-4 lg:ml-8 transition-transform duration-200 ease-in-out w-full relative">

  <ais-instant-search
    :search-client="searchClient"
    :insights-client="window.aa"
    index-name="posts"
    :routing="routing"
  >
    <ais-configure
      :hitsPerPage="5"
      :attributesToSnippet="['summary_short_formated']"
      :analytics="true"
      :clickAnalytics="true"
    ></ais-configure>
    <ais-autocomplete :class-names="{ 'ais-Autocomplete': 'relative' }">
      <template slot-scope="{ currentRefinement, indices, refine }">
        <ais-search-box
          placeholder='Search (Press  "/" to focus)'
          ref="searchBox"
          class="flex md:justify-end "
          :show-loading-indicator="true"
          :class-names="{
            'ais-SearchBox-input': 'transition text-base focus:outline-none rounded-full border border-gray-500 py-2 pl-10 pr-4 px-6 w-full md:w-80 appearance-none focus:w-full',
            'ais-SearchBox-submitIcon': 'hidden',
            'ais-SearchBox-reset': 'mr-2',
            'ais-SearchBox-form': 'w-full md:w-80 focus-within:w-full'
          }"
        >
            <div slot="submit-icon" class="absolute ml-2 top-0 text-gray-600 z-10" style="margin-top: 2px;"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 13.33 13.33" class="fill-current w-4 text-solstice-blue-opacity-60">
                            <path d="M13.14 12.19l-2.46-2.45a6 6 0 1 0-.94.94l2.45 2.46a.7.7 0 0 0 .48.19.66.66 0 0 0 .47-.19.68.68 0 0 0 0-.95zM1.33 6a4.67 4.67 0 1 1 8 3.29 4.67 4.67 0 0 1-8-3.29z"></path>
                        </svg></div>
        </ais-search-box>
        <ais-hits ref="hitsBox" v-if="currentRefinement" :class-names="{'ais-Hits': 'absolute z-20 pt-2 w-full'}">
          <ul
            slot-scope="{ items }"
            class="shadow-xl rounded list-none pl-0 my-0 bg-white"
            v-if="items.length > 0"
          >
            <li class="bg-gray-300 rounded rounded-b-none py-3 px-4 text-sm" >
              Press
              <strong>enter</strong> to select,
              <strong>↑↓</strong> to
              navigate,
              <strong>esc</strong> to dismiss
            </li>
            <li
              v-for="(hit, index) in items"
              :key="hit.objectID"
              class="pt-6 px-5 hover:bg-gray-200"
              :class="{ 'bg-gray-200' : index == highlightedIndex }"
              :tabindex="index+1"
            >
              <a
                :href="hit.slug"
                class="no-underline block"
                @click="clickedObjectIDs({
                    eventName: 'Result Selected',
                    index: 'posts',
                    objectIDs: [hit.objectID]
                })"
              >
                <ais-highlight
                  attribute="title"
                  :hit="hit"
                  :class-names="{'ais-Highlight': 'text-gray-900 font-medium'}"
                ></ais-highlight>
                <!-- <ais-snippet
                attribute="summary_short_formated"
                :hit="hit"
                :class-names="{'ais-Snippet': 'pb-4 mb-0 border-0 border-b text-sm text-gray-600 border-solid border-gray-300'}"
                ></ais-snippet>-->
                <div
                  v-html="hit.summary_short_formated"
                  class="pb-4 mb-0 mt-0 border-0 border-b text-sm text-gray-600 border-solid border-gray-300"
                ></div>
              </a>
            </li>
          </ul>
          <div v-else class="shadow-lg rounded list-none pl-0 mt-0">
            <div class="bg-gray-400 rounded rounded-b-none py-3 px-4 text-sm">
              There are no results found for:
              <q>{{currentRefinement}}</q>.
            </div>
          </div>
        </ais-hits>
      </template>
    </ais-autocomplete>
  </ais-instant-search>
</div>
</template>

<script>
import algoliasearch from "algoliasearch/lite";

import { history as historyRouter } from "instantsearch.js/es/lib/routers";
import { simple as simpleMapping } from "instantsearch.js/es/lib/stateMappings";
// use the existing router
var router = historyRouter();
var _write = router.write.bind(router);
// override write
router.write = routeState => {
  _write(routeState);
  var page = router.createURL(routeState);
  if (process.env.APP_ENV == "production") {
    // send to Google analytics
    window.ga("send", "pageView", page);
  }
};

export default {
  data() {
    return {
      isFocused: false,
      window: window,
      routing: {
        router,
        // router: historyRouter(),
        stateMapping: simpleMapping()
      },
      searchClient: algoliasearch(
        process.env.MIX_ALGOLIA_APP_ID,
        process.env.MIX_ALGOLIA_SEARCH
      ),
      eventRegistered: false,
      highlightedIndex: 0
    };
  },
  ready: function() {

    },
  created(){
      console.log('event ready')
      if(!this.eventRegistered) {
        window.addEventListener('keyup', event  => {

            switch (event.keyCode) {
                case 191:
                    this.isFocused = !this.isFocused;
                    if (this.isFocused) {
                        this.$refs.searchBox.$el.querySelector('input').focus();
                    } else {
                        this.$refs.searchBox.$el.querySelector('input').blur();
                        this.$refs.searchBox.state.clear();
                    }
                    break;
                case 27:
                    this.$refs.searchBox.$el.querySelector('input').blur();
                    this.$refs.searchBox.state.clear();
                    this.isFocused = !this.isFocused;
                    break;
                case 40:
                    if ((this.highlightedIndex + 1) == this.$refs.hitsBox.items.length) {
                        this.highlightedIndex = 0;
                    } else {
                        this.highlightedIndex++;
                    }
                    break;
                case 38:
                    if (this.highlightedIndex == 0) {
                        this.highlightedIndex = this.$refs.hitsBox.items.length - 1;
                    } else {
                        this.highlightedIndex--;
                    }
                    break;
                case 13:
                    let selectedItem = this.$refs.hitsBox.items[this.highlightedIndex];
                    window.location = selectedItem.slug
                    break;
                default:
                    break;
            }
        });
      }
    // window.eventTarget.addEventListener("keydown", event => {
    //     if (event.isComposing || event.keyCode === 191) {
    //         this.isFocused = !this.isFocused;
    //         return;
    //     }
    //     // do something
    // });
  },
  methods: {
    insights(method, payload) {
      return insights(method, payload);
    },
    clickedObjectIDs(params) {
      window.aa("clickedObjectIDs", params);
    }
  }
};
</script>
