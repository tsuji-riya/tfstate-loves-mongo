import * as core from "@actions/core";

export interface Logger {
  info(message: string): void;

  warn(message: string): void;

  debug(message: string): void;
}

class CommonLogger implements Logger {
  public info(message: string): void {
    console.info(message);
  }

  public warn(message: string): void {
    console.warn(message);
  }

  public debug(message: string): void {
    console.debug(message);
  }
}

class ActionsLogger implements Logger {
  public info(message: string): void {
    core.info(message);
  }

  public warn(message: string): void {
    core.warning(message);
  }

  public debug(message: string): void {
    core.debug(message);
  }
}

export function instanceCommonLogger(): Logger {
  return new CommonLogger();
}

export function instanceActionsLogger(): Logger {
  return new ActionsLogger();
}