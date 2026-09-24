import ILocation from "./ILocation";

export default interface ILevelLocations {
  id: string; // guid
  name: string;
  backgroundUrl: string;
  locations: ILocation[];
}