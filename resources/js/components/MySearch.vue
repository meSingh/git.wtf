<template>
  <ais-instant-search :search-client="searchClient" index-name="posts" :routing="routing">
    <ais-configure
      :hitsPerPage="5"
      :attributesToSnippet="['summary_short_formated']"
      :analytics="true"
      :clickAnalytics="true"
    ></ais-configure>
    <ais-autocomplete :class-names="{ 'ais-Autocomplete': 'relative' }">
      <template slot-scope="{ currentRefinement, indices, refine }">
        <ais-search-box
          placeholder="Search for git tips here"
          :show-loading-indicator="true"
          :class-names="{
            'ais-SearchBox-input': 'transition text-base focus:outline-none rounded bg-gray-400 py-3 pl-10 pr-4 px-6 border-0 w-full appearance-none',
            'ais-SearchBox-submitIcon': 'hidden',
            'ais-SearchBox-reset': 'mr-2'
          }"
        />
        <ais-hits
          v-if="currentRefinement"
          :class-names="{'ais-Hits': 'absolute z-20 pt-2 w-full'}"
        >
          <ul
            slot-scope="{ items }"
            class="shadow-xl rounded list-none pl-0 my-0 bg-white"
            v-if="items.length > 0"
          >
            <li class="bg-gray-400 rounded rounded-b-none py-3 px-4 text-sm">
              <!-- Press
              <strong>enter</strong> to select,
              <strong>↑↓</strong> to
              navigate,
              <strong>esc</strong> to dismiss -->
            </li>
            <li
              v-for="(hit, index) in items"
              :key="hit.objectID"
              class="pt-6 px-5 hover:bg-gray-200"
              :tabindex="index+1"
            >
              <a :href="hit.slug" class="no-underline block">
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
      routing: {
        router,
        // router: historyRouter(),
        stateMapping: simpleMapping()
      },
      searchClient: algoliasearch(
        process.env.MIX_ALGOLIA_APP_ID,
        process.env.MIX_ALGOLIA_SEARCH
      )
    };
  },
  methods: {

  }
};
</script>
