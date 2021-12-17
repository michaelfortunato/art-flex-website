import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { isRentalPricing, MAX_RENTAL_PRICES } from "../Post";
import { Pricing, BuyPricing, RentalPricing } from "../CreatePost.api";

function removeRentalPricing(
  stateRentalPricing: RentalPricing[],
  actionRentalPricing: RentalPricing
): RentalPricing[] {
  const newRentalPricing = stateRentalPricing.filter(rentalPricing => {
    const {
      price: statePrice,
      duration: stateDuration,
      period: statePeriod
    } = rentalPricing;
    const {
      price: actionPrice,
      duration: actionDuration,
      period: actionPeriod
    } = actionRentalPricing || {};
    const equalsActionRentalPricing =
      statePrice === actionPrice &&
      stateDuration === actionDuration &&
      statePeriod === actionPeriod;
    return !equalsActionRentalPricing;
  });
  return newRentalPricing;
}
type ErrorType = { error: string | undefined };
type PricingState = {
  rentalPricing: Record<string, RentalPricing & ErrorType> | undefined;
  buyPrice: (BuyPricing & ErrorType) | undefined;
};

const initialState: PricingState = {
  rentalPricing: undefined,
  buyPrice: undefined
};
export const pricingSlice = createSlice({
  name: "Pricing",
  initialState,

  reducers: {
    setBuyPrice: (state, action: PayloadAction<BuyPricing>) => ({
      ...state,
      buyPricing: action.payload
    }),
    upsertRentalPrice: (
      state: Pricing,
      action: PayloadAction<{ key: string; rentalPricing: RentalPricing }>
    ) => {
      if (!isRentalPricing(action.payload)) {
        throw new Error("Bad action call");
      }
      const newRentalPricing = [action.payload]
        .concat(
          state.rentalPricing
            ? removeRentalPricing(state.rentalPricing, action.payload)
            : []
        )
        .slice(0, MAX_RENTAL_PRICES);
      return {
        ...state,
        rentalPricing: newRentalPricing
      };
    },
    removeRentalPrice: (state, action: PayloadAction<RentalPricing>) => {
      if (!state.rentalPricing) {
        throw new Error(
          "Cannot remove element from set of rentalPrices as set is undefined"
        );
      }
      if (!action.payload) {
        throw new Error("Element you wish to remove is undefined");
      }
      const newRentalPricing = removeRentalPricing(
        state.rentalPricing,
        action.payload
      );
      return { ...state, rentalPricing: newRentalPricing };
    }
  }
});

// Export actions
export const { setBuyPrice, upsertRentalPrice, removeRentalPrice } =
  pricingSlice.actions;

// Export selectors
export const selectBuyPrice = (state: Pricing) => state.buyPrice;
export const selectRentalPrices = (state: Pricing) => state.rentalPricing;

export default pricingSlice.reducer;
