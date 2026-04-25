import * as core from '@actions/core';
import {getInputs} from "./lib/input";
import {MongoClient} from "mongodb";
import type {CurrentlyCollection} from "./lib/types";
import * as fs from "node:fs";

async function run(): Promise<void> {
  const inputs = getInputs();
  const {mongoUri, database, collection, destination} = inputs;
  core.debug(`😼 Inputs: ${JSON.stringify(inputs)}`);
  const rawStoredTfState = core.getState("latestTfState");
  const isStoredTfStateEmpty = rawStoredTfState === "";
  if (isStoredTfStateEmpty) {
    core.info("😼 No stored tfstate found in state.");
  }
  const storedTfState = isStoredTfStateEmpty ? JSON.parse(rawStoredTfState) : {};

  core.info("😼 Reading tfstate from destination");
  const rawCurrentlyTfState = fs.readFileSync(destination, "utf8");
  const currentlyTfState = JSON.parse(rawCurrentlyTfState);
  core.info("😸 Read tfstate from destination successfully!");

  if (storedTfState === currentlyTfState) {
    core.info("😽 No changes detected in tfstate. Skipping saving to MongoDB.");
    return;
  }

  const mongoClient = new MongoClient(mongoUri);

  core.info("😼 Connecting to MongoDB...");
  await mongoClient.connect();
  core.info("😻 Connected to MongoDB successfully!");

  core.info("😼 Saving tfstate to MongoDB...");
  const currentlyCollection = mongoClient.db(database).collection<CurrentlyCollection>(collection);
  await currentlyCollection.insertOne({date: new Date(), content: currentlyTfState});
  core.info("😻 Saved tfstate to MongoDB successfully!");

  core.info("😼 Cleaning tfstate on MongoDB...");
  const tfStates = await currentlyCollection.find().sort({date: -1}).skip(2).project({_id: 1}).toArray();

  if (tfStates.length === 0) {
    core.info("😽 No extra tfstate documents to clean. Skipping cleaning.");
    await mongoClient.close();
    return;
  }

  const idsToDelete = tfStates.map(doc => doc._id);
  const result = await currentlyCollection.deleteMany({_ids: {$in: idsToDelete}});
  core.info("😻 Cleaned tfstate on MongoDB successfully! Deleted count: " + result.deletedCount);

  await mongoClient.close();
}

run().catch(core.setFailed);