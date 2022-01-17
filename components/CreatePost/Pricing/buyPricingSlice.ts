import { createSlice, PayloadAction } from "@reduxjs/toolkit";
// eslint-disable-next-line import/no-cycle
import { RootState } from "@redux-store/store";
import { BuyPricing, validBuyPricing } from "../CreatePost.api";

type ErrorType = { error: string };
type BuyPricingState = Partial<BuyPricing & ErrorType>;

const initialState: BuyPricingState = {
  price: undefined,
  error: undefined
};
export const buyPricingSlice = createSlice({
  name: "buyPricing",
  initialState,

  reducers: {
    setBuyPrice: (
      _state,
      action: PayloadAction<Partial<BuyPricing>>
    ): BuyPricingState => {
      const { price } = action.payload;
      const error = !validBuyPricing({ price })
        ? "Invalid buy price configuration"
        : undefined;
      return {
        price,
        error
      };
    },
    removeBuyPrice: (): BuyPricingState => ({
      price: undefined,
      error: undefined
    })
  }
});

// Export actions
export const { setBuyPrice, removeBuyPrice } = buyPricingSlice.actions;

// Export selectors
export const selectBuyPrice = (state: RootState) =>
  state.createPost.pricing.buyPricing;

export default buyPricingSlice.reducer;
