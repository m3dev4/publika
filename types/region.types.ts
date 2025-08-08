import { cities } from "./cities.type";

export interface region {
  id: string;
  name: string;
  cities: cities[];
  createdAt: Date;
  updatedAt: Date;
}
