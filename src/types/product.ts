// src/types/product.ts
export interface ProductResponse {
  products: Product[];
  totalPage: number;
  currentPage: number;
}

export interface ProductTypesResponse
  extends Omit<ProductResponse, "products"> {
  productTypes: ProductType[];
}

export interface PackagingResponse extends Omit<ProductResponse, "products"> {
  packagings: Packaging[];
}

// Represents the structure of a single product variant
export interface ProductVariant {
  id: string;
  productId: string;
  weight_in_kg: string;
  packagingId: string | null;
  imageUrl: string;
  priceRupiah: number;
  createdAt: string;
  updatedAt: string;
  packaging?: Packaging | null;
}

// Represents the packaging information
export interface Packaging {
  id: string;
  name: string;
}

// Represents the product type information
export interface ProductType {
  id: string;
  name: string;
}

// Represents the core product, which contains multiple variants
export interface Product {
  id: string;
  name: string;
  description: string;
  productTypeId?: string;
  storageInstructions: string;
  expiredDurationInYears: number;
  usageInstructions: string;
  benefits: string;
  createdAt: string;
  updatedAt: string;
  productType: ProductType;
  composition: string;
  variants: ProductVariant[] | [];
}

// Type for the payload when creating a new product
export interface CreateProductPayload {
  name: string;
  composition: string;
  description: string;
  productTypeId?: string;
  storageInstructions: string;
  expiredDurationInYears: number;
  usageInstructions: string;
  benefits: string;
}

// Type for the payload when updating a product
export type UpdateProductPayload = Partial<CreateProductPayload>;
