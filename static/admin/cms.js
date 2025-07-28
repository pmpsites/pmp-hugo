CMS.registerEditorComponent({
    id: "figure",
    label: "Figure",
    fields: [{
            name: "title",
            label: "Figure Title",
            widget: "string"
        },
        {
            name: "src",
            label: "Figure SRC",
            widget: "string"
        },
    ],
    pattern: /^<figure><img src=\"(.*?)\" alt=\"(.*?)\"\/> <figcaption>(.*?)<\/figcaption><\/figure>$/ms,
    fromBlock: function(match) {
        return {
            title: match[1],
            src: match[2],
        };
    },
    toBlock: function(data) {
        return `<figure><img src=${data.src} alt=${data.title}><figcaption>${data.title}</figcaption></figure>`;
    },
    toPreview: function(data) {
        return `<figure><img src=${data.src} alt=${data.title}><figcaption>${data.title}</figcaption></figure>`;
    },
});

CMS.registerEditorComponent({
  // Internal id of the component
  id: "collapsible-note",
  // Visible label
  label: "Collapsible Note",
  // Fields the user need to fill out when adding an instance of the component
  fields: [
    {
      name: 'summary',
      label: 'Summary',
      widget: 'string'
    },
    {
      name: 'contents',
      label: 'Contents',
      widget: 'markdown'
    }
  ],
  // Regex pattern used to search for instances of this block in the markdown document.
  // Patterns are run in a multiline environment (against the entire markdown document),
  // and so generally should make use of the multiline flag (`m`). If you need to capture
  // newlines in your capturing groups, you can either use something like
  // `([\S\s]*)`, or you can additionally enable the "dot all" flag (`s`),
  // which will cause `(.*)` to match newlines as well.
  //
  // Additionally, it's recommended that you use non-greedy capturing groups (e.g.
  // `(.*?)` vs `(.*)`), especially if matching against newline characters.
  pattern: /^<details><summary>(.*?)<\/summary>(.*?)<\/details>$/ms,
  // Given a RegExp Match object
  // (https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/match#return_value),
  // return an object with one property for each field defined in `fields`.
  //
  // This is used to populate the custom widget in the markdown editor in the CMS.
  fromBlock: function(match) {
    return {
      summary: match[1],
      contents: match[2]
    };
  },
  // Given an object with one property for each field defined in `fields`,
  // return the string you wish to be inserted into your markdown.
  //
  // This is used to serialize the data from the custom widget to the
  // markdown document
  toBlock: function(data) {
    return `<details><summary>${data.summary}</summary>${data.contents}</details>`;
  },
  // Preview output for this component. Can either be a string or a React component
  // (component gives better render performance)
  toPreview: function(data) {
    return `
<details>
  <summary>${data.summary}</summary>

  ${data.contents}

</details>
`;
  }
});


const AboutPreview = createClass({
  render: function() {
    const entry = this.props.entry;
    const hero = entry.getIn(['data', 'hero']);
    const partners = entry.getIn(['data', 'partners']);
    const expertise = entry.getIn(['data', 'expertise']);
    const cta = entry.getIn(['data', 'cta']);

    return h('div', {className: 'container about'},
      // Hero Section
      h('div', { className: 'text-image in-hero' },
        h('div', { className: 'in-heroimg' }, h('img', { src: hero && hero.get('image') ? this.props.getAsset(hero.get('image')).toString() : '' })),
        h('div', { className: 'in-herocard bg-blue' },
          h('h2', { className: 'in-hero-heading' }, hero ? hero.get('heading') : ''),
          h('p', { className: 'in-heroetext white' }, hero ? hero.get('text') : '')
        )
      ),

      // Partners Section
      h('section', { id: 'challenge', className: 'challenge' },
        h('div', { className: 'text-image' },
          h('div', { className: 'text-image-right-img' }, h('img', { src: 'https://res.cloudinary.com/pmpartner/image/upload/w_900,h_600,f_auto,q_auto:low/diamond-su' })),
          h('div', { className: 'text-image-card right' },
            h('div', { className: 'text-image-card-content' },
              h('h3', { className: 'text-image-card-head' }, partners ? partners.get('heading') : ''),
              h('p', {}, partners ? partners.get('text') : ''),
              (partners ? partners.get('partner') : []).map((partner, index) =>
                h('div', { className: 'drawer' },
                  h('input', { type: 'checkbox', id: `partner-${index + 1}`, className: 'toggle-checkbox' }),
                  h('label', { htmlFor: `partner-${index + 1}`, className: 'link' },
                    h('div', { className: 'arrow' }, h('svg', { width: '14', height: '14', viewBox: '0 0 14 14', fill: '#522926', xmlns: 'http://www.w3.org/2000/svg' }, h('path', { d: 'M6 14V8H0V6H6V0H8V6H14V8H8V14H6Z', fill: '#522926' }))),
                    h('div', {}, partner.get('name'))
                  ),
                  h('div', { className: 'solutiontext' }, partner.get('text'))
                )
              )
            )
          )
        )
      ),

      // Expertise Section
      h('section', { id: 'expertise', className: 'expertise' },
        h('div', { className: 'text-image' },
          h('div', { className: 'text-image-left-img' }, h('img', { src: 'https://res.cloudinary.com/pmpartner/image/upload/h_600,f_auto,q_auto:low/metalboxformbuilding' })),
          h('div', { className: 'text-image-card left' },
            h('div', { className: 'text-image-card-content' },
              h('h3', { className: 'text-image-card-head' }, expertise ? expertise.get('heading') : ''),
              h('p', {}, expertise ? expertise.get('text') : ''),
              h('p', { className: 'large-p' }, expertise ? expertise.get('note') : ''),
              h('a', { href: '/contact' }, h('button', { className: 'btnCTA btn-orange' }, expertise ? expertise.get('buttontext') : ''))
            )
          )
        )
      ),


    );
  }
});

CMS.registerPreviewTemplate("about", AboutPreview);

const HomePreview = createClass({
  render: function() {
    const entry = this.props.entry;
    const hero = entry.getIn(['data', 'hero']);
    const challenge = entry.getIn(['data', 'challenge']);
    const approach = entry.getIn(['data', 'approach']);
    const solution = entry.getIn(['data', 'solution']);
    const process = entry.getIn(['data', 'process']);
    const results = entry.getIn(['data', 'results']);
    const cta = entry.getIn(['data', 'cta']);

    return h('div', {className: 'container'},
      // Hero Section
      h('div', { className: 'hero' },
        h('div', { className: 'heroimg' }, h('img', { src: hero && hero.get('image') ? this.props.getAsset(hero.get('image')).toString() : '' })),
        h('div', { className: 'herocard' },
          h('img', { className: 'slogan', src: '/images/title.svg' }),
          h('p', { className: 'herotext' }, hero ? hero.get('blurb') : ''),
          h('a', { href: '#challenge' }, h('img', { className: 'hero-down', src: 'https://res.cloudinary.com/pmpartner/image/upload/salmon-down-arrow.svg' }))
        )
      ),

      // Challenge Section
      h('section', { id: 'challenge', className: 'challenge darkgrey-bg' },
        h('div', { className: 'text-image' },
          h('div', { className: 'text-image-right-img' }, h('img', { src: challenge && challenge.get('image') ? this.props.getAsset(challenge.get('image')).toString() : '' })),
          h('div', { className: 'text-image-card right' },
            h('div', { className: 'text-image-card-content' },
              h('h3', { className: 'text-image-card-head' }, challenge ? challenge.get('heading') : ''),
              (challenge ? challenge.get('copy') : []).map(item => h('p', {}, item.get('paragraph'))),
              h('a', { href: '/consultation' }, h('button', { className: 'btnCTA btn-orange' }, challenge ? challenge.get('buttontext') : ''))
            )
          )
        )
      ),

      // Approach Section
      h('section', { id: 'approach', className: 'approach lightgrey-bg' },
        h('div', { className: 'text-image' },
          h('div', { className: 'text-image-left-img' }, h('img', { src: approach && approach.get('image') ? this.props.getAsset(approach.get('image')).toString() : '' })),
          h('div', { className: 'text-image-card left' },
            h('div', { className: 'text-image-card-content' },
              h('h3', { className: 'text-image-card-head' }, approach ? approach.get('heading') : ''),
              (approach ? approach.get('copy') : []).map(item => h('p', {}, item.get('paragraph'))),
              h('a', { href: '/consultation' }, h('button', { className: 'btnCTA btn-orange' }, approach ? approach.get('buttontext') : ''))
            )
          )
        )
      ),

      // Solution Section
      h('section', { id: 'solution', className: 'solution darkgrey-bg' },
        h('div', { className: 'text-image' },
          h('div', { className: 'text-image-right-img' }, h('img', { src: solution && solution.get('image') ? this.props.getAsset(solution.get('image')).toString() : '' })),
          h('div', { className: 'text-image-card right' },
            h('div', { className: 'text-image-card-content' },
              h('h3', { className: 'text-image-card-head' }, solution ? solution.get('heading') : ''),
              (solution ? solution.get('copy') : []).map(item => h('p', {}, item.get('paragraph'))),
              h('a', { href: '/consultation' }, h('button', { className: 'btnCTA btn-orange' }, solution ? solution.get('buttontext') : ''))
            )
          )
        )
      ),

      // Process Section
      h('section', { className: 'text-image process-section' },
        h('div', { className: 'process' }),
        h('div', { className: 'intro' },
          h('h3', { className: 'heading brown' }, process ? process.get('heading') : ''),
          h('p', {}, process ? process.get('copy') : '')
        ),
        h('div', { className: 'content' },
          h('div', { className: 'unstyled-cards' },
            (process ? process.get('cards') : []).map(card =>
              h('div', { className: 'card' },
                h('div', { className: 'card-content' },
                  h('h4', {}, card.get('heading')),
                  h('p', {}, card.get('copy'))
                )
              )
            )
          ),
          h('a', { href: '/consultation' }, h('button', { className: 'btnCTA btn-orange' }, process ? process.get('buttontext') : ''))
        )
      ),

      // Results Section
      h('section', { id: 'results', className: 'three-cards text-image' },
        h('div', { className: 'case-studies' }),
        h('div', { className: 'intro' },
          h('h3', { className: 'heading brown' }, results ? results.get('heading') : ''),
          h('p', {}, results ? results.get('copy') : '')
        ),
        h('div', { className: 'content' },
          h('div', { className: 'cards' },
            (results ? results.get('cards') : []).map((card, index) =>
              h('div', { className: 'card' },
                h('input', { type: 'checkbox', id: `toggle-${index + 1}`, className: 'toggle-checkbox' }),
                h('div', { className: 'card-content' },
                  h('img', { src: card.get('image') ? this.props.getAsset(card.get('image')).toString() : '' }),
                  h('h4', {}, card.get('heading')),
                  h('p', {}, card.get('challenge')),
                  h('label', { htmlFor: `toggle-${index + 1}`, className: 'link' }, 'Our Solution', h('span', { className: 'arrow' }, h('svg', { width: '14', height: '14', viewBox: '0 0 14 14', fill: '#522926', xmlns: 'http://www.w3.org/2000/svg' }, h('path', { d: 'M6 14V8H0V6H6V0H8V6H14V8H8V14H6Z', fill: '#2d4149' })))),
                  h('div', { className: 'solutiontext' },
                    h('p', {}, card.get('solution'))
                  )
                )
              )
            )
          )
        )
      ),

      // CTA Section
      h('section', { className: 'cta-section text-image' },
        h('div', { className: 'ctabg' }),
        h('div', { className: 'intro' },
          h('h2', { className: 'heading white' },
            (cta ? cta.get('heading') : []).map(item =>
              h('span', { style: { color: item.get('color') } }, item.get('text'), h('br'))
            )
          )
        ),
        h('div', { className: 'action' },
          h('p', {}, cta ? cta.get('copy') : ''),
          h('ul', { className: 'reasons' },
            (cta ? cta.get('reasons') : []).map(reason => h('li', {}, reason.get('text')))
          ),
          h('a', { href: '/consultation' }, h('button', { className: 'btnCTA btn-orange' }, cta ? cta.get('button-text') : ''))
        )
      )
    );
  }
});

CMS.registerPreviewTemplate("home", HomePreview);

const InsightPreview = createClass({
  render: function() {
    const entry = this.props.entry;
    const title = entry.getIn(['data', 'title']);
    const image = entry.getIn(['data', 'image']);
    const body = this.props.widgetFor('body');

    return h('div', {},
      // Hero Section
      h('div', { className: 'text-image article-hero' },
        h('div', { className: 'in-herocard' },
          h('div', { className: 'link' }, 
            h('img', { src: '/images/solution-arrow_forward.svg' }),
            h('a', { href: '/insights' }, 'Back to Insights')
          ),
          h('div', { className: 'article-title' }, h('h1', {}, title)),
        ),
        h('div', { className: 'in-heroimg' }, h('img', { src: image }))
      ),

      // Article Section
      h('section', { id: 'article', className: 'article' },
        h('div', { className: 'text-image col-7-span-12' },
          h('article', {}, body),
          h('article-footer', {},
            h('h4', {}, 'Share this article:'),
            h('div', { className: 'share-icons' }, 
              h('a', { href: '#' }, 
                h('img', { className: 'li-icon', src: '/icons/linkedin-b.svg', alt: 'share this article on Linkedin' })
              )
            )
          )
        )
      ),

      // CTA Section
      h('section', { className: 'cta-section text-image' },
        h('div', { className: 'ctabg' }),
        h('div', { className: 'intro' },
          h('h2', { className: 'heading white' }, 
            'Unlock your',
            h('br'),
            h('span', { className: 'orange' }, 'Place Marketing'),
            h('br'),
            'potential.'
          )
        ),
        h('div', { className: 'action' },
          h('p', {}, "In your free 40 minute online consultation we'll help you to:"),
          h('ul', { className: 'reasons' },
            h('li', {}, 'Identify and understand your target audiences'),
            h('li', {}, 'Define your place marketing goals'),
            h('li', {}, 'Develop your results-focused place marketing strategy')
          ),
          h('a', { href: '/consultation' }, 
            h('button', { className: 'btnCTA btn-orange' }, 'Book your free online consultation now.')
          )
        )
      )
    );
  }
});

CMS.registerPreviewTemplate("insights", InsightPreview);
CMS.registerPreviewStyle('https://place-marketing.com/css/styles.min.css'); 

