export type PostImage = File;

export interface RentalPricing {
  period: "Month" | "Months" | "Year" | "Years";
  duration: number;
  price: number;
}
export interface BuyPricing {
  price: number;
}
export interface Pricing {
  rentalPricing: RentalPricing[];
  buyPrice: BuyPricing;
}

export interface CreatePost {
  title: string;
  description: string;
  images: PostImage[];
  pricing: Pricing;
}
