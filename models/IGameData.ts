import { ISuspect } from "./ISuspect";

// PODRIA ser TODO: Si ves que no necesitamos nada mas respecto a esta estrucutra para el juego, integralo. Pero yo por ahora lo dejaria pasar
export interface ICost {
    time: number;
    pi: number;
}

export interface IGameData {
    levelId: number;
    info: string;
    initialRoute: string;
    initialTime: number;
    initialPI: number;
    costs: {
        travelProvince: ICost;
        travelLocation: ICost;
        askQuestion: ICost;
    };
    initialClues: string[];
    suspects: ISuspect[];
    targetSuspect: ISuspect;
}
