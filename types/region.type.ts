export interface Region {
  id: string;
  name: string;
  cities?: {
    id: string;
    name: string;
    longitude?: number;
    latitude?: number;
  }[];
  createdAt: Date;
  updatedAt: Date;
}
