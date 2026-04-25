import * as core from '@actions/core';
import type {CurrentlyCollection} from './lib/types';
import {MongoClient} from "mongodb";
import * as fs from "node:fs";
import {getInputs} from "./lib/input";

async function run(): Promise<void> {
  const inputs = getInputs();
  const {mongoUri, database, collection, destination} = inputs;
  core.debug(`😼 Inputs: ${JSON.stringify(inputs)}`);

  const mongoClient = new MongoClient(mongoUri);

  core.info("😼 Connecting to MongoDB...");
  await mongoClient.connect();
  core.info("😻 Connected to MongoDB successfully!");

  core.info("😼 Fetching tfstate from MongoDB...");
  const currentlyCollection = mongoClient.db(database).collection<CurrentlyCollection>(collection);
  const storedTfState = await currentlyCollection.findOne({}, {sort: {date: -1}});
  core.info(`😽 Fetched tfstate successfully!`);

  if (!storedTfState) {
    core.info("😿 No tfstate found in the collection. Skipping restoring tfstate file.");
    await mongoClient.close();
    return;
  }

  core.debug("😼 Saving stored tfstate into Actions state...");
  core.saveState("storedTfState", storedTfState);
  core.debug("😼 Saved stored tfstate successfully!");

  core.info("😼 Restoring tfstate file...");
  fs.writeFileSync(destination, JSON.stringify(storedTfState.content, null, 2), "utf8");
  core.info("😻 tfstate file restored successfully!");

  await mongoClient.close();
}

run().catch(core.setFailed);