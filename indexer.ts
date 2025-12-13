// src/indexer.ts
import algoliasearch from "algoliasearch";
import fs from "fs";
import { chain } from "stream-chain";
import { parser } from "stream-json";
import { streamArray } from "stream-json/streamers/StreamArray";
import { IngestionConfig } from "./config";

export async function runIngestion(config: IngestionConfig) {
  const client = algoliasearch(config.appId, config.apiKey);
  const index = client.initIndex(config.indexName);

  if (config.clearIndex) {
    console.log(`Clearing index ${config.indexName}...`);
    await index.clearObjects();
  }

  let buffer: any[] = [];
  let total = 0;

  const pipeline = chain([
    fs.createReadStream(config.filePath),
    parser(),
    streamArray()
  ]);

  const flushBatch = async () => {
    if (!buffer.length) return;
    const batch = buffer;
    buffer = [];
    total += batch.length;

    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        await index.saveObjects(batch);
        console.log(`Indexed batch of ${batch.length} objects (total: ${total}).`);
        break;
      } catch (err) {
        console.error(`Batch failed (attempt ${attempt}):`, (err as Error).message);
        if (attempt === 3) throw err;
        await new Promise(res => setTimeout(res, attempt * 1000));
      }
    }
  };

  pipeline.on("data", (data: any) => {
    const record = data.value; // element of the JSON array
    if (!record.objectID) return; // minimal guard

    buffer.push(record);

    if (buffer.length >= config.batchSize) {
      pipeline.pause();
      flushBatch()
        .then(() => pipeline.resume())
        .catch(err => pipeline.emit("error", err));
    }
  });

  pipeline.on("end", async () => {
    try {
      await flushBatch();
      console.log(`Ingestion completed. Total records indexed: ${total}.`);
    } catch (err) {
      console.error("Final flush failed:", (err as Error).message);
      process.exit(1);
    }
  });

  pipeline.on("error", (err: any) => {
    console.error("Pipeline error:", err.message);
    process.exit(1);
  });
}
