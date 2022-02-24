import { createSlice, PayloadAction } from "@reduxjs/toolkit";
// eslint-disable-next-line import/no-cycle
import { RootState } from "@redux-store/store";
import { BuyPricing } from "../CreatePost.api";
import { validBuyPricing } from "../Post";

export type InputBuyPricing = Partial<BuyPricing> & {
  confirmed?: boolean;
  isDraft?: boolean;
};
const initialState: InputBuyPricing = {
  price: undefined
};
export const buyPricingSlice = createSlice({
  name: "buyPricing",
  initialState,

  reducers: {
    setEmptyBuyPrice: () => ({ price: undefined, isDraft: true }),
    setBuyPrice: (_state, action: PayloadAction<InputBuyPricing>) => {
      const { price, confirmed, isDraft } = action.payload;
      return {
        price,
        isDraft,
        confirmed
      };
    },
    removeBuyPrice: () => ({
      price: undefined
    }),
    markBuyPriceNotConfirmed: state => ({
      ...state,
      confirmed: false
    })
  }
});

// Export actions
export const {
  setEmptyBuyPrice,
  setBuyPrice,
  removeBuyPrice,
  markBuyPriceNotConfirmed
} = buyPricingSlice.actions;

// Export selectors
export const selectValidBuyPrice = (
  state: RootState
): BuyPricing | undefined => {
  const { price } = state.createPost.pricing.buyPricing;
  const buyPricing = { price };
  if (validBuyPricing(buyPricing)) {
    return buyPricing;
  }
  return undefined;
};
export const selectBuyPrice = (state: RootState) =>
  state.createPost.pricing.buyPricing;

export default buyPricingSlice.reducer;
