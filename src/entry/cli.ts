import { instanceCommonLogger, type Logger } from "../lib/log";
import { restore } from "../flow/restore";
import { save } from "../flow/save";
import { parseArgs } from "node:util";

function validateRequiredFlags(
  logger: Logger,
  values: {
    uri?: string;
    database?: string;
    collection?: string;
    file?: string;
  },
) {
  const { uri, database, collection, file } = values;
  if (!uri) {
    logger.warn("--uri is missing");
    return undefined;
  }
  if (!database) {
    logger.warn("--database is missing");
    return undefined;
  }
  if (!collection) {
    logger.warn("--collection is missing");
    return undefined;
  }
  if (!file) {
    logger.warn("--file is missing");
    return undefined;
  }
  return { uri, database, collection, file };
}

async function main() {
  const { values, positionals } = parseArgs({
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
      },
    },
  });
  const logger = instanceCommonLogger();

  const command = positionals[2];

  if (command === "restore") {
    const validateResult = validateRequiredFlags(logger, values);
    if (!validateResult) return;

    const { uri, database, collection, file } = validateResult;
    await restore({ logger, mongoUri: uri, collection, database, destination: file });
  } else if (command === "save") {
    const validateResult = validateRequiredFlags(logger, values);
    if (!validateResult) return;

    const { uri, database, collection, file } = validateResult;
    await save({ logger, mongoUri: uri, collection, database, destination: file });
  } else {
    logger.warn("You should run like <command> <restore/save> <options>");
  }
}

await main();
