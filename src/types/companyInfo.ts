export interface CompanyInfoPayload {
  companyName: string;
  email: string;
  phoneNumber: string;
  province: number; // ID of the province
  city: number; // ID of the city
  district: number; // ID of the district
  subDistrict: number; // ID of the sub-district
  fullAddress: string; // Full address including street, city, and province
}

export interface UpdateCompanyInfoPayload {
  companyName?: string;
  email?: string;
  phoneNumber?: string;
  province?: number; // ID of the province
  city?: number; // ID of the city
  district?: number; // ID of the district
  subDistrict?: number; // ID of the sub-district
  fullAddress?: string; // Full address including street, city, and province
}

export interface CompanyInfo {
  id: string; // Unique identifier for the company info
  companyName: string; // Name of the company
  logoUrl: string | null; // URL of the company's logo, can be null if no logo is set
  email: string; // Contact email for the company
  phoneNumber: string; // Contact phone number for the company
  province: string; // Name of the province
  provinceId: number; // ID of the province
  city: string; // Name of the city
  cityId: number; // ID of the city
  district: string; // Name of the district
  districtId: number; // ID of the district
  subDistrict: string; // Name of the sub-district
  subDistrictId: number; // ID of the sub-district
  postalCode: string; // Postal code for the address
  fullAddress: string; // Full address including street, city, and province
  createdAt: string; // Timestamp when this info was created
  updatedAt: string; // Timestamp when this info was last updated
}
