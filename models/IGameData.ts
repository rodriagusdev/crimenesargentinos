import { ISuspect } from "./ISuspect";

export interface ICost {
    time: number;
    pi: number;
}

export interface IGameCosts {
    travelProvince: ICost;
    travelLocation: ICost;
    askQuestion: ICost;
}

export interface IGameData {
    levelId: number;
    info: string;
    initialRoute: string;
    initialTime: number;
    initialPI: number;
    costs: IGameCosts;
    initialClues: string[];
    suspects: ISuspect[];
    targetSuspect: ISuspect | null; // null si el caso todavía no tiene culpable cargado
}
