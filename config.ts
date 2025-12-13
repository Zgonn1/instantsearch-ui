// src/config.ts
export interface IngestionConfig {
    appId: string;
    apiKey: string;
    indexName: string;
    filePath: string;
    batchSize: number;
    clearIndex: boolean;
  }
  
  export function loadConfig(argv: any): IngestionConfig {
    // Use "globalThis.process" so it works in both Node and non-Node (browser, etc.) envs
    const env = typeof globalThis.process !== "undefined" && globalThis.process.env ? globalThis.process.env : {};
    const appId = env.ALGOLIA_APP_ID || argv.appId;
    const apiKey = env.ALGOLIA_ADMIN_API_KEY || argv.apiKey;
    const indexName = argv.index || env.ALGOLIA_INDEX_NAME || "bestbuy_demo";
    const filePath = argv.file || "expected-algolia-payload.json";
    const batchSize = Number(argv.batchSize || 1000);
    const clearIndex = Boolean(argv.reset || false);
    if (!appId || !apiKey) {
      throw new Error("ALGOLIA_APP_ID and ALGOLIA_ADMIN_API_KEY must be provided.");
    }
  
    return { appId, apiKey, indexName, filePath, batchSize, clearIndex };
  }
  