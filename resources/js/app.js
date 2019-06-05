
import Prism from 'prismjs'
import 'prismjs/plugins/toolbar/prism-toolbar.js'

import 'prismjs/components/prism-bash.min.js'
import './modules/copyToClipboard.js'
import './modules/showLanguage.js'


import Turbolinks from 'turbolinks';

Turbolinks.start();

document.addEventListener('turbolinks:load', () => {

    Prism.highlightAll();

});








