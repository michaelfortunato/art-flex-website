// eslint-disable-next-line import/no-cycle
import { RootState } from "@redux-store/store";
import { createEntityAdapter, createSlice, EntityId } from "@reduxjs/toolkit";
import { RentalPricing, validRentalPricing } from "../Post";

export type InputRentalPricing = {
  rentalPriceId: number;
} & Partial<RentalPricing>;

const rentalPricingAdapter = createEntityAdapter<InputRentalPricing>({
  selectId: rentalPricing => rentalPricing.rentalPriceId
});

export const rentalPricingSlice = createSlice({
  name: "rentalPricing",
  initialState: rentalPricingAdapter.getInitialState(),

  reducers: {
    addEmptyRentalPrice: state => {
      rentalPricingAdapter.addOne(state, {
        rentalPriceId:
          state.ids.length > 0 ? Math.max(...(state.ids as number[])) + 1 : 0
      });
    },
    upsertOneRentalPrice: rentalPricingAdapter.upsertOne,
    removeOneRentalPrice: rentalPricingAdapter.removeOne,
    removeManyRentalPrices: rentalPricingAdapter.removeMany
  }
});

// Export actions
export const {
  addEmptyRentalPrice,
  upsertOneRentalPrice,
  removeOneRentalPrice,
  removeManyRentalPrices
} = rentalPricingSlice.actions;

// Export selectors
export const {
  selectIds: selectAllRentalPricingIds,
  selectAll: selectAllRentalPricings,
  selectById: selectRentalPricingById
} = rentalPricingAdapter.getSelectors(
  (state: RootState) => state.createPost.pricing.rentalPricing
);

export const selectRentalPriceIdsWithDurationAndPeriod =
  (duration?: number, period?: string) =>
  (state: RootState): EntityId[] =>
    selectAllRentalPricings(state)
      .filter(
        rentalPricing =>
          rentalPricing.duration === duration && rentalPricing.period === period
      )
      .map(({ rentalPriceId }) => rentalPriceId);

export const selectAllValidRentalPricings = (state: RootState) => {
  const rentalPricings = selectAllRentalPricings(state);
  return rentalPricings.filter(rentalPricing =>
    validRentalPricing({
      price: rentalPricing.price,
      duration: rentalPricing.duration,
      period: rentalPricing.period
    })
  );
};

export default rentalPricingSlice.reducer;
