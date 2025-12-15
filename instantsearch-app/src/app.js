const { algoliasearch, instantsearch } = window;

// Get credentials from environment variables
// These should be set in a .env file (see .env.example)
// For production, use a search-only API key (safe to expose in client-side code)
// Parcel v2 automatically replaces process.env.* at build time, but we handle the case
// where process might be undefined in the browser runtime
const ALGOLIA_APP_ID = (typeof process !== 'undefined' && process.env && process.env.ALGOLIA_APP_ID) || undefined;
const ALGOLIA_SEARCH_API_KEY = (typeof process !== 'undefined' && process.env && process.env.ALGOLIA_SEARCH_API_KEY) || undefined;

if (!ALGOLIA_APP_ID || !ALGOLIA_SEARCH_API_KEY) {
  throw new Error(
    'Missing required Algolia credentials. Please set ALGOLIA_APP_ID and ALGOLIA_SEARCH_API_KEY in your .env file. See .env.example for details.'
  );
}

const searchClient = algoliasearch(
  ALGOLIA_APP_ID,
  ALGOLIA_SEARCH_API_KEY
);

const ALGOLIA_INDEX_NAME = (typeof process !== 'undefined' && process.env && process.env.ALGOLIA_INDEX_NAME) || 'bestbuy_demo';

const search = instantsearch({
  indexName: ALGOLIA_INDEX_NAME,
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
]);
search.start();
