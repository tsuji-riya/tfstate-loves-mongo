export type ActionInputs = {
  mongoUri: string;
  database: string;
  collection: string;
  destination: string;
}

export type TFState = any;

export type CurrentlyCollection = {
  date: Date;
  content: TFState,
}

export type SavedState = {
  inputs: ActionInputs;
}