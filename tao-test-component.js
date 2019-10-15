const embedStyles = `<link rel="stylesheet" type="text/css" href="tao-test-component.css"/>`;


class TaoTestComponent extends HTMLElement {

    /**
     * specify observed attributes so that attributeChangedCallback will work
     * @returns {string[]}
     */
    static get observedAttributes() {
        return [
            'src',
        ];
    }

    /**
     * initialize component: creating shadow DOM, prepare component state
     */
    constructor() {
        super();

        // load templates
        const templates = window.document;
        this.tpls = {
            component:  templates.getElementsByClassName('tpl-component')[0].innerHTML,
            styles:     templates.getElementsByClassName('tpl-styles')[0].innerHTML,
            table:      templates.getElementsByClassName('tpl-table')[0].innerHTML,
            headCell:   templates.getElementsByClassName('tpl-header-cell')[0].innerHTML,
            dataRow:    templates.getElementsByClassName('tpl-data-row')[0].innerHTML,
            dataCell:   templates.getElementsByClassName('tpl-data-cell')[0].innerHTML,
            handledSelector:   templates.getElementsByClassName('tpl-selector')[0].innerHTML,
        }

        // initialize state
        this.data = [];
        this.shadow = this.attachShadow({mode: 'open'});

        this.resetSorting();
        this.parseEmbedSource();
    }

    /**
     * add to DOM hook: add handlers-initialize-add features
     */
    connectedCallback() {
        //
    }

    /**
     * remove from DOM hook: cleanup-unsubscribe-remove-destroy-armageddon
     */
    disconnectedCallback() {
        //
    }

    /**
     * change HTML element attributes hook
     */
    attributeChangedCallback($name, $prevValue, $nextValue) {
        switch ($name) {
            case 'src':
                this.load($nextValue);
                break;
        }
    }

    /**
     * helper for bulk replace placeholders in templates
     * @param $tpl string tpl with {{PLACEHOLDERS}}
     * @param $placeholders plain object with placeholders
     * @returns {string} parsed template
     */
    placehold($tpl, $placeholders) {
        // why use weird syntax like a "<!--TEMPLATEVARIABLE-->"? it prevent creation of not-valid HTML code
        // in templates, where need to insert placeholders in places where text nodes is not permitted
        // for example insertion of rows in TABLE: <table><!--DATAROWS--></table>
        // it looks like XML-comments and acceptably in any place
        return $tpl.replace( /<!--(.*?)-->/g , (match, property) => $placeholders[property] );
    }

    /**
     * render new component content from templates after change data, sorting, loading, etc.
     */
    render() {
        var content = '<div>data not provided</div><hr/>'; // default view for data-less component
        const isDataAvailable = (this.data.length >= 1);

        // build html code from templates and row data
        if (isDataAvailable) {
            const keys = Object.keys(this.data[0]);
            const STYLES = this.tpls.styles;
            const HEAD = keys.map(n => this.placehold(this.tpls.headCell, {
                TEXT: n,
                CLASSES: n===this.sortBy ? `sort${this.sortDir < 0 ? ' rev':''}`:'',
            })).join('');
            const DATA = this.data.map(r => this.placehold(this.tpls.dataRow, {
                ROWDATA: keys.map( n => this.placehold(this.tpls.dataCell, {
                    CELLDATA: r[n]
                }) ).join('')
            }) ).join('');
            const TABLE = this.placehold(this.tpls.table, {
                DATA,
                HEAD,
            });
            content = this.placehold(this.tpls.component, {
                TABLE,
                STYLES,
            });
        }

        this.shadow.innerHTML = content;

        // add click columns (header cells) click handlers to sort rows
        if (isDataAvailable) {
            const keys = Object.keys(this.data[0]);
            keys.map(n => {
                var handledElement = this.shadow.querySelector(this.placehold(this.tpls.handledSelector, {FIELDSELECTOR: n}));
                handledElement.addEventListener("click", () => {
                    if (n === this.sortBy) {
                        this.sortDir = -this.sortDir;
                    } else {
                        this.sortBy = n;
                        this.sortDir = 1;
                    }
                    this.sortData();
                    this.render();
                });
            });
        }
    }

    /**
     * load new data to table from $url (e.g. data url)
     * @param $url
     */
    load($url) {
        const me = this;
        var request = new XMLHttpRequest();

        request.open('GET', $url, true);
        request.send(null);
        request.onreadystatechange = function () {
            if (request.readyState === 4 && request.status === 200) {
                try {
                    me.data = JSON.parse(request.responseText);
                    me.resetSorting();
                    me.render();
                } catch (err) {
                    // TODO: process error
                }
            }
        }
    }

    /**
     * sort data before update component view
     * used in header cells click handler
     */
    sortData() {
        this.data.sort(($val1, $val2 ) => {
            const a = JSON.stringify($val1[this.sortBy]);
            const b = JSON.stringify($val2[this.sortBy]);
            if ( a < b ){
                return -this.sortDir;
            }
            if ( a > b ){
                return this.sortDir;
            }
            return 0;
        });
    }

    /**
     * reset table sorting after component instance creation or after update data
     */
    resetSorting() {
        this.sortBy = undefined;
        this.sortDir = 0;
    }

    /**
     * parse embed data, used if you insert JSON data directly instead of point it via "src" attribute
     */
    parseEmbedSource() {
        if (!this.getAttribute('src')) {
            try {
                this.data = JSON.parse(this.innerHTML);
            } catch (err) {
                this.data = []; // no value
            }
            this.render();
        }
    }

}

/**
 * initialize module: register custom element in CustomElementRegistry
 */
(function initialize() {

    const tplUrl = './tao-test-component.html';

    // initialization: add html template
    fetch(tplUrl).then(async response => {

        if (response.ok) {
            document.head.innerHTML += await response.text();
        } else {
            //alert("HTTP error : " + response.status);
        }

        const run = () => {
            try {
                customElements.define("tao-test-component", TaoTestComponent);
            } catch (e) {
                // already defined
            }
        };

        if (document.readyState === 'complete') {
            run()
        } else {
            window.addEventListener('load', run);
        }
    });

})();


/**
 *
 * @param $src optional: url of displayed data
 * @returns {HTMLElement} custom HTML element contained table with loaded data
 */
export function factory($src) {
    const el = document.createElement('tao-test-component');
    if ($src) {
        el.setAttribute('src', $src);
    }
    return el;
}
