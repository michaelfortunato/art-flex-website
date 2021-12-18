export interface RentalPricing {
  period: "Month" | "Months" | "Year" | "Years";
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

export function isRentalPricing(pricing: any): pricing is RentalPricing {
  return pricing
    ? (pricing as RentalPricing).duration !== undefined &&
        (pricing as RentalPricing).period !== undefined
    : false;
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
export const TITLE_MAX_LEN = 100;
export const DESCRIPTION_MAX_LEN = 400;
export const MAX_IMAGES = 5;
export const MAX_RENTAL_PRICES = 2;

/**
 * Here we do client side validation of description
 * @param description
 */
export function validDescription(description: string) {
  return description.length > DESCRIPTION_MAX_LEN
    ? {
        error: `Description is must be fewer than ${DESCRIPTION_MAX_LEN} character`
      }
    : {};
}
