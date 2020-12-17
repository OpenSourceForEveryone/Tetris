import { createStore } from "satcheljs";
import "../mutator/ResponseMutator";
import "../orchestrators/ResponseOrchestrator";
import * as actionSDK from "@microsoft/m365-action-sdk";
import { ProgressState } from "../utils/SharedEnum";

/**
 * Response store containing all data required when user play the game.
 */

export interface ResponseProgressStatus {
    actionInstance: ProgressState;
    currentContext: ProgressState;
    settingInstance: ProgressState;
    currentUserDataInstance: ProgressState;
    localizationInstance: ProgressState;
}

interface IGameResponseStore {
    context: actionSDK.ActionSdkContext;
    actionInstance: actionSDK.Action;
    actionInstanceRowsForCurrentUser: actionSDK.ActionDataRow[];
    shouldValidate: boolean;
    progressState: ResponseProgressStatus;
    isActionDeleted: boolean;
    shouldPlayerPlay: boolean;
    playerPrevScore: string;
    PlayerCurrentScore: string;
}

const store: IGameResponseStore = {
    context: null,
    shouldValidate: false,
    actionInstance: null,
    actionInstanceRowsForCurrentUser: null,
    progressState: {
        actionInstance: ProgressState.NotStarted,
        currentContext: ProgressState.NotStarted,
        settingInstance: ProgressState.NotStarted,
        currentUserDataInstance: ProgressState.NotStarted,
        localizationInstance: ProgressState.NotStarted,
    },
    isActionDeleted: false,
    shouldPlayerPlay: true,
    playerPrevScore: null,
    PlayerCurrentScore: null

};

export default createStore<IGameResponseStore>("ResponseStore", store);