import { combineReducers } from "@reduxjs/toolkit";
// eslint-disable-next-line import/no-cycle
import buyPricingReducer, { selectBuyPrice } from "./buyPricingSlice";
import rentalPricingsReducer from "./rentalPricingsSlice";
// eslint-disable-next-line import/no-cycle

export { selectBuyPrice };
export default combineReducers({
  buyPricing: buyPricingReducer,
  rentalPricing: rentalPricingsReducer
});

/* Here for posterity if I change my mind
import { createEntityAdapter, createSlice, PayloadAction } from "@reduxjs/toolkit";
// eslint-disable-next-line import/no-cycle
import { RootState } from "redux-store/store";
import { isRentalPricing, validBuyPricing } from "../Post";
import { BuyPricing, RentalPricing } from "../CreatePost.api";


type ErrorType = { error: string | undefined };
type PricingState = {
  rentalPricing: Record<string, RentalPricing & ErrorType> | undefined;
  buyPricing: (Partial<BuyPricing> & ErrorType) | undefined;
};


const initialState: PricingState = {
  rentalPricing: undefined,
  buyPricing: undefined
};
export const pricingSlice = createSlice({
  name: "Pricing",
  initialState,

  reducers: {
    setBuyPrice: (
      state,
      action: PayloadAction<Partial<BuyPricing>>
    ): PricingState => {
      const buyPricing = action.payload;
      const error = !validBuyPricing(buyPricing)
        ? "Invalid buy price configuration"
        : undefined;
      return {
        ...state,
        buyPricing: { ...buyPricing, error }
      };
    },
    removeBuyPrice: state => ({ ...state, buyPrice: undefined }),
    upsertRentalPrice: (
      state,
      action: PayloadAction<{ key: string; rentalPricing: RentalPricing }>
    ) => {
      const { key, rentalPricing } = action.payload;
      const error = !isRentalPricing(action.payload.rentalPricing)
        ? "Invalid/incomplete rental pricing configuration."
        : undefined;
      return {
        ...state,
        rentalPricing: {
          [key]: { ...rentalPricing, error }
        }
      };
    },
    upsertRentalPriceField: (
      state,
      action: PayloadAction<{ key: string; price: number }>
    ) => {
      const { key, price } = action.payload;

      const error = !isRentalPricing(action.payload.rentalPricing)
        ? "Invalid/incomplete rental pricing configuration."
        : undefined;
      return {
        ...state,
        rentalPricing: {
          [key]: { ...rentalPricing, error }
        }
      };
    },
    removeRentalPrice: (state, action: PayloadAction<{ key: string }>) => {
      const { key } = action.payload;
      const newRentalPricings = { ...state.rentalPricing };
      delete newRentalPricings[key];
      return { ...state, rentalPricing: newRentalPricings };
    }
  }
});

// Export actions
export const {
  setBuyPrice,
  removeBuyPrice,
  upsertRentalPrice,
  removeRentalPrice
} = pricingSlice.actions;

// Export selectors
export const selectBuyPrice = (state: RootState) =>
  state.createPost.pricing.buyPricing;
export const selectRentalPrice = (state: RootState, key: string) =>
  state.createPost.pricing?.rentalPricing?.[key];

export default pricingSlice.reducer;
*/
