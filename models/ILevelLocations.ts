import ILocation from "./ILocation";

//todo: integrar con backend
export default interface ILevelLocations {
  id: number;
  name: string;
  backgroundUrl: string;
  locations: ILocation[];
}