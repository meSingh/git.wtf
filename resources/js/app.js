
import Prism from 'prismjs'
import 'prismjs/components/prism-bash.min.js'


import Turbolinks from 'turbolinks';

Turbolinks.start();

document.addEventListener('turbolinks:load', () => {

    Prism.highlightAll();

});
