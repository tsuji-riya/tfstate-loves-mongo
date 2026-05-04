import type {FlowOptions} from "../lib/types";
import * as core from "@actions/core";
import {instanceActionsLogger} from "../lib/log";

export function getFlowOptionsFromActions(): FlowOptions {
  const mongoUri = core.getInput("mongo-uri", {required: true});

  // Sets mongoUri secret so it won't be exposed in logs
  core.setSecret(mongoUri);
  return {
    logger: instanceActionsLogger(),
    mongoUri,
    database: core.getInput("database"),
    collection: core.getInput("collection"),
    destination: core.getInput("destination")
  };
}