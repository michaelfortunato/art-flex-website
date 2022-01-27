import { Grid, Paper, Typography, Divider } from "@material-ui/core";
import * as S from "./Post.styled";

export interface RentalPricing {
  period: "Month" | "Months" | "Year" | "Years";
  duration: number;
  price: number;
}
export const inputRentalPeriodOptions = [
  "1 Month",
  "3 Months",
  "6 Months",
  "9 Months",
  "1 Year"
] as const;

export type Tag = {
  category: string;
  label: string;
};

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
  artistName: string;
  title: string | undefined;
  description: string | undefined;
  images: PostImage[];
  pricing: Pricing;
  tags: Tag[];
}

const MAX_PRICE = 15000;

export function isRentalPricing(pricing: any): pricing is RentalPricing {
  return pricing
    ? (pricing as RentalPricing).duration !== undefined &&
        (pricing as RentalPricing).period !== undefined
    : false;
}

export function getPriceError(price: any) {
  if (typeof price !== "number" || Number.isNaN(price)) {
    return { error: "Price must be a number." };
  }
  if (price > MAX_PRICE) {
    return { error: "Price must be less than $15,000" };
  }
  if (price < 0) {
    return { error: "Price must be a positive number" };
  }
  return null;
}

export function validPrice(price: any): boolean {
  return getPriceError(price) === null;
}
export function validRentalDuration(duration: number) {
  return duration > 0 && duration < 13;
}

function validPeriod(period: string) {
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
export const MAX_TITLE_LEN = 100;
export const MAX_DESCRIPTION_LEN = 400;
export const MIN_IMAGES = 2;
export const MAX_IMAGES = 5;
export const MAX_RENTAL_PRICES = 2;

/**
 * Here we do client side validation of description
 * @param description
 */

export function getTitleError(title: any) {
  if (typeof title !== "string") {
    return { error: `Title must be a string` };
  }
  if (title.length > MAX_TITLE_LEN) {
    return {
      error: `Title must be fewer than ${MAX_TITLE_LEN} characters long`
    };
  }
  if (title === "") {
    return { error: "Title must be a non empty string." };
  }
  return null;
}

export function validTitle(title: any): title is string {
  return getTitleError(title) === null;
}
export function getDescriptionError(description: any) {
  if (typeof description !== "string" || description.length === 0) {
    return { error: "Description must be non-empty a string" };
  }
  if (description.length > MAX_DESCRIPTION_LEN) {
    return {
      error: `Description is must be fewer than ${MAX_DESCRIPTION_LEN} character`
    };
  }
  return null;
}

export function validDescription(description: any): description is string {
  return getDescriptionError(description) === null;
}

export function isImage(image: any): image is PostImage {
  return image.name && image.preview;
}
export function getImagesError(images: any[]) {
  if (images.length > MAX_IMAGES) {
    return {
      error: `Cannot have more than ${MAX_IMAGES} images in artwork post.`
    };
  }
  if (images.length < MIN_IMAGES) {
    return {
      error: `Must have at least ${MIN_IMAGES} images in artwork post.`
    };
  }
  return undefined;
}
export function areImagesValid(images: any) {
  return getImagesError(images) === undefined;
}

// Images
export function validImages(images: PostImage[]) {
  return getImagesError(images) === null;
}

// Tags

export function isTag(tag: any): tag is Tag {
  return (
    (tag as Tag).label !== undefined && (tag as Tag).category !== undefined
  );
}

export function validTags(tags: any[]) {
  return tags.every(tag => isTag(tag));
}

interface PostWrapperProps {
  Image: React.ReactNode;
  artistName: string;
  Title: React.ReactNode;
  Tags: React.ReactNode;
  Description: React.ReactNode;
  Pricing: React.ReactNode;
}

export function PostWrapper(props: PostWrapperProps) {
  return (
    <Paper
      elevation={3}
      style={{
        padding: 60,
        paddingTop: 60,
        borderRadius: 10,
        display: "inline-block"
      }}
    >
      <div>
        <Grid container justifyContent="center">
          <Grid item xs="auto">
            <div
              style={{
                display: "inline-block",
                height: 320,
                width: 300,
                marginTop: 0,
                marginBottom: 20
              }}
            >
              {props.Image}
            </div>
          </Grid>
        </Grid>
        <Divider style={{ height: 1, marginBottom: 20, marginTop: 10 }} />
        <div>
          <Typography variant="h5">{props.artistName}</Typography>
        </div>
        <S.PostItem>{props.Title}</S.PostItem>
        <S.PostItem>{props.Tags}</S.PostItem>
        <S.PostItem style={{ maxHeight: 200, overflowY: "auto" }}>
          {props.Description}
        </S.PostItem>
        <S.PostItem
          style={{
            borderBottomStyle: "none"
          }}
        >
          {props.Pricing}
        </S.PostItem>
      </div>
    </Paper>
  );
}
