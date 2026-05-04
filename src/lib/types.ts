import type { Logger } from "./log";

export type TFState = any;

export type CurrentlyCollection = {
  date: Date;
  content: TFState;
};

export type FlowOptions = {
  logger: Logger;
  mongoUri: string;
  database: string;
  collection: string;
  destination: string;
};
