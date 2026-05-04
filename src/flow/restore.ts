import type {CurrentlyCollection, FlowOptions} from "../lib/types";
import {MongoClient} from "mongodb";
import * as fs from "node:fs";

export async function restore({logger, mongoUri, database, collection, destination}: FlowOptions) {
  const mongoClient = new MongoClient(mongoUri);

  logger.info("😼 Connecting to MongoDB...");
  await mongoClient.connect();
  logger.info("😻 Connected to MongoDB successfully!");

  logger.info("😼 Fetching tfstate from MongoDB...");
  const currentlyCollection = mongoClient.db(database).collection<CurrentlyCollection>(collection);
  const storedTfState = await currentlyCollection.findOne({}, {sort: {date: -1}});
  logger.info(`😽 Fetched tfstate successfully!`);

  if (!storedTfState) {
    logger.info("😿 No tfstate found in the collection. Skipping restoring tfstate file.");
    await mongoClient.close();
    return;
  }

  logger.info("😼 Restoring tfstate file...");
  fs.writeFileSync(destination, JSON.stringify(storedTfState.content, null, 2), "utf8");
  logger.info("😻 tfstate file restored successfully!");

  await mongoClient.close();
}