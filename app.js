import {factory as taoTesetComponentFactory} from "./tao-test-component.js";

// examples
window.addEventListener('load', (event) => {

    const el = taoTesetComponentFactory("./data/sampledata3.json");
    document.getElementById('test-placeholder').appendChild(el);

    setTimeout(() => {
        document.getElementById('test-load').setAttribute('src', './data/sampledata4.json');
    }, 5e3);

});