import type {CurrentlyCollection, FlowOptions} from "../lib/types";
import {MongoClient} from "mongodb";
import * as fs from "node:fs";

export async function save({logger, mongoUri, database, collection, destination}: FlowOptions): Promise<void> {
  logger.info("😼 Reading tfstate from destination");
  const readRawTfState = fs.readFileSync(destination, "utf8");
  const readTfState = JSON.parse(readRawTfState);
  logger.info("😸 Read tfstate from destination successfully!");

  const mongoClient = new MongoClient(mongoUri);

  logger.info("😼 Connecting to MongoDB...");
  await mongoClient.connect();
  logger.info("😻 Connected to MongoDB successfully!");

  logger.info("😼 Fetching tfstate from MongoDB...");
  const currentlyCollection = mongoClient.db(database).collection<CurrentlyCollection>(collection);
  const storedLatestTfState = await currentlyCollection.findOne({}, {sort: {date: -1}});
  logger.info(`😽 Fetched tfstate successfully!`);

  if (storedLatestTfState) {
    if (isEqual(storedLatestTfState.content, readTfState)) {
      logger.info("😽 No changes detected in tfstate. Skipping saving to MongoDB.");
      await mongoClient.close();
      return;
    }
  } else {
    logger.info("😺 No tfstate found on MongoDB. Saving tfstate into MongoDB...");
  }

  logger.info("😼 Saving tfstate to MongoDB...");
  await currentlyCollection.insertOne({date: new Date(), content: readTfState});
  logger.info("😻 Saved tfstate to MongoDB successfully!");

  logger.info("😼 Cleaning tfstate on MongoDB...");
  const tfStates = await currentlyCollection.find().sort({date: -1}).skip(2).project({_id: 1}).toArray();

  if (tfStates.length === 0) {
    logger.info("😽 No extra tfstate documents to clean. Skipping cleaning.");
    await mongoClient.close();
    return;
  }

  const idsToDelete = tfStates.map(doc => doc._id);
  const result = await currentlyCollection.deleteMany({_id: {$in: idsToDelete}});
  logger.info("😻 Cleaned tfstate on MongoDB successfully! Deleted count: " + result.deletedCount);

  await mongoClient.close();
}

function isEqual(a: any, b: any): boolean {
  return JSON.stringify(a) === JSON.stringify(b);
}