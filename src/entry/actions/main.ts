import * as core from "@actions/core";
import { restore } from "../../flow/restore";
import { getFlowOptionsFromActions } from "../../flow";

restore(getFlowOptionsFromActions()).catch(core.setFailed);
