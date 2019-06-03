// import Highlight from './modules/highlight';
// import hljs from 'highlight.js/lib/highlight';
// import 'highlight.js/styles/github.css';


import Prism from 'prismjs'
// import 'prismjs/themes/prism.css'
import 'prismjs/components/prism-bash.min.js'


import Turbolinks from 'turbolinks';

Turbolinks.start();

document.addEventListener('turbolinks:load', () => {
    // Highlight.start();

    Prism.highlightAll();

    // hljs.configure({ useBR: true });

    // document.querySelectorAll('pre code').forEach((block) => {
    //     hljs.highlightBlock(block);
    // });

    // hljs.initHighlightingOnLoad();
    // document.querySelectorAll('pre code').forEach((block) => {
    //     console.log(block)
    //     hljs.highlightBlock(block);

    //     console.log(hljs)
    // });

});
