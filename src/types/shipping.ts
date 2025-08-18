export interface IPlace {
  id: string;
  name: string;
}

export type Provinces = IPlace;
export type Cities = IPlace;
export type Districts = IPlace;
export interface SubDistricts extends IPlace {
  zip_code: string;
}
