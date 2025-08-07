import { region } from "./region.types";

export interface cities {
  id: string;
  name: string;
  regionId: string;
  region: region;
  longitude: number;
  latitude: number;
  createdAt: Date;
  updatedAt: Date;
}
