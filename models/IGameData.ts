import { ISuspect } from "./ISuspect";

interface ICost {
    time: number;
    pi: number;
}

export interface IGameData {
    levelId: number;
    initialTime: number;
    initialPI: number;
    costs: {
        travelProvince: ICost;
        travelLocation: ICost;
        askQuestion: ICost;
    }
    discoveredClues: string[];
    suspects: ISuspect[];
    targetSuspect: ISuspect;
}