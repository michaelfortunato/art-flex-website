export interface RentalPricing {
  period: "Month" | "Year";
  duration: number;
  price: number;
}
export interface BuyPricing {
  price: number;
}
export interface Pricing {
  rentalPricing: RentalPricing[] | undefined;
  buyPrice: BuyPricing | undefined;
}

export interface PostImage extends File {
  preview: string;
}

export interface PostProps {
  title: string | undefined;
  description: string | undefined;
  images: PostImage[];
  pricing: Pricing;
}
