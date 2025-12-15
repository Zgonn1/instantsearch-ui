# instantsearch-app

_This project was generated with [create-instantsearch-app](https://github.com/algolia/instantsearch/tree/master/packages/create-instantsearch-app) by [Algolia](https://algolia.com)._

## Get started

To run this project locally, install the dependencies and run the local server:

```sh
npm install
npm start
```

Alternatively, you may use [Yarn](https://http://yarnpkg.com/):

```sh
yarn
yarn start
```

Open http://localhost:3000 to see your app.

## Environment Variables

This project uses environment variables for Algolia configuration to keep credentials secure.

1. Copy `.env.example` to `.env`:
   ```sh
   cp .env.example .env
   ```

2. Fill in your Algolia credentials in `.env`:
   - `ALGOLIA_APP_ID`: Your Algolia Application ID
   - `ALGOLIA_SEARCH_API_KEY`: Your Algolia **Search-Only** API key (safe for client-side use)
   - `ALGOLIA_INDEX_NAME`: Your Algolia index name

**Important Security Note**: 
- Always use a **Search-Only API key** for client-side applications
- Search-only keys are safe to expose in the browser
- Never use Admin API keys in client-side code
- The `.env` file is gitignored and should never be committed to version control
