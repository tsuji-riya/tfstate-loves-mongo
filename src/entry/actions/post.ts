import * as core from '@actions/core';
import {save} from "../../flow/save";
import {getFlowOptionsFromActions} from "../../flow";

save(getFlowOptionsFromActions()).catch(core.setFailed);
