import {instanceCommonLogger} from "../lib/log";
import {restore} from "../flow/restore";
import {save} from "../flow/save";
import {parseArgs} from "node:util";

const {values, positionals} = parseArgs({
  args: process.argv,
  allowPositionals: true,
  options: {
    uri: {
      type: "string",
    },
    database: {
      type: "string",
    },
    collection: {
      type: "string",
    },
    file: {
      type: "string",
    }
  }
});

const {uri, database, collection, file} = values;
const logger = instanceCommonLogger();

switch (positionals[2]) {
  case "restore":
    if (!uri) {
      logger.warn("--uri is missing");
      break;
    }
    if (!database) {
      logger.warn("--database is missing");
      break;
    }

    if (!collection) {
      logger.warn("--collection is missing");
      break;
    }

    if (!file) {
      logger.warn("--file is missing");
      break;
    }

    await restore({logger, mongoUri: uri, collection, database, destination: file});
    break;
  case "save":
    if (!uri) {
      logger.warn("--uri is missing");
      break;
    }
    if (!database) {
      logger.warn("--database is missing");
      break;
    }

    if (!collection) {
      logger.warn("--collection is missing");
      break;
    }

    if (!file) {
      logger.warn("--file is missing");
      break;
    }

    await save({logger, mongoUri: uri, collection, database, destination: file});
    break;
}
