import * as core from "@actions/core";
import type {ActionInputs} from "./types";

export function getInputs(): ActionInputs {
  const mongoUri = core.getInput("mongo-uri", {required: true});

  // Sets mongoUri secret so it won't be exposed in logs
  core.setSecret(mongoUri);
  return {
    mongoUri,
    database: core.getInput("database"),
    collection: core.getInput("collection"),
    destination: core.getInput("destination")
  };
}