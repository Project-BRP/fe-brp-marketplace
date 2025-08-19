export interface IPlace {
  id: number;
  name: string;
}

export type Provinces = IPlace;
export type Cities = IPlace;
export type Districts = IPlace;
export interface SubDistricts extends IPlace {
  zip_code: string;
}

export interface ShippingOption {
  name: string;
  code: string;
  service: string;
  description: string;
  cost: number;
  etd: string;
}

export interface CheckCostResponse {
  shippingOptions: ShippingOption[];
}

export interface CheckCostPayload {
  destinationProvince: number;
  destinationCity: number;
  destinationDistrict: number;
  destinationSubDistrict: number;
  weight_in_kg: number;
}
