const { algoliasearch, instantsearch } = window;

const searchClient = algoliasearch(
  'YKLIUUYB8O',
  '723feb791c8ceec90b26bafc66542fcd'
);

const search = instantsearch({
  indexName: 'bestbuy_demo',
  searchClient,
  future: { preserveSharedStateOnUnmount: true },
});

search.addWidgets([
  instantsearch.widgets.searchBox({
    container: '#searchbox',
  }),
  instantsearch.widgets.hits({
    container: '#hits',
    templates: {
      item: (hit, { html, components }) => html`
        <article>
          <img src=${hit.image} alt=${hit.name} />
          <div>
            <h1>${components.Highlight({ hit, attribute: 'name' })}</h1>
            <p>${components.Highlight({ hit, attribute: 'description' })}</p>
            <p>${components.Highlight({ hit, attribute: 'price' })}</p>
          </div>
        </article>
      `,
    },
  }),
  instantsearch.widgets.configure({
    hitsPerPage: 8,
  }),
  instantsearch.widgets.pagination({
    container: '#pagination',
  }),
]);
search.addWidgets([
  instantsearch.widgets.clearRefinements({
    container: "#clear-refinements",
  }),

  instantsearch.widgets.refinementList({
    container: "#brand-list",
    attribute: "brand",
  }),

  instantsearch.widgets.configure({
    hitsPerPage: 8,
  }),
]);
search.start();
