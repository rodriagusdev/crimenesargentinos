import ILocation from "./ILocation";

export default interface ILevelLocations {
  id: number;
  name: string;
  backgroundUrl: string;
  locations: ILocation[];
}