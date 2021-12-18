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

export function validPrice(price: any): boolean {
  return typeof price === "number" && price > 0 && price < 15000;
}
export function validRentalDuration(duration: number) {
  return duration > 0 && duration < 13;
}
export function validPeriod(period: string) {
  return (
    period === "Month" ||
    period === "Months" ||
    period === "Year" ||
    period === "Years"
  );
}

export function validBuyPricing(buyPrice: any): buyPrice is BuyPricing {
  try {
    return validPrice(buyPrice.price);
  } catch (error) {
    return false;
  }
}
export function validRentalPricing(
  rentalPricing: any
): rentalPricing is RentalPricing {
  try {
    return (
      validPrice(rentalPricing.price) &&
      validRentalDuration(rentalPricing.duration) &&
      validPeriod(rentalPricing.period)
    );
  } catch (error) {
    return false;
  }
}
