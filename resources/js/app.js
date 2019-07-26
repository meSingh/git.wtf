
import Prism from 'prismjs'
import 'prismjs/plugins/toolbar/prism-toolbar.js'

import 'prismjs/components/prism-bash.min.js'
import './modules/copyToClipboard.js'
// import './modules/showLanguage.js'


import Turbolinks from 'turbolinks';

Turbolinks.start();

document.addEventListener('turbolinks:load', () => {

    Prism.highlightAll();

});


window.Vue = require('vue');


import VueInstantSearch from 'vue-instantsearch';
Vue.use(VueInstantSearch);

Vue.component('my-search', require('./components/MySearch.vue').default);
Vue.component('frustrations', require('./components/Frustrations.vue').default);


/**
 * The following block of code may be used to automatically register your
 * Vue components. It will recursively scan this directory for the Vue
 * components and automatically register them with their "basename".
 *
 * Eg. ./components/ExampleComponent.vue -> <example-component></example-component>
 */

// const files = require.context('./', true, /\.vue$/i);
// files.keys().map(key => Vue.component(key.split('/').pop().split('.')[0], files(key).default));

// Vue.component('example-component', require('./components/ExampleComponent.vue').default);

/**
 * Next, we will create a fresh Vue application instance and attach it to
 * the page. Then, you may begin adding components to this application
 * or customize the JavaScript scaffolding to fit your unique needs.
 */

new Vue({
    el: '#app',
});
