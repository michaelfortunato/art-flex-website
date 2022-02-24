// eslint-disable-next-line import/no-cycle
import { RootState } from "@redux-store/store";
import { createEntityAdapter, createSlice, EntityId } from "@reduxjs/toolkit";
import { RentalPricing, validRentalPricing } from "../Post";

export type InputRentalPricing = {
  rentalPriceId: number;
  confirmed?: boolean;
} & Partial<RentalPricing>;

function calculatePeriodCardinality(period?: string): number {
  if (period === "Month") {
    return 1;
  }
  if (period === "Months") {
    return 2;
  }
  if (period === "Year") {
    return 3;
  }
  if (period === "Years") {
    return 4;
  }
  return 0;
}
function calculateDurationCardinality(duration?: number): number {
  return duration !== undefined ? duration : -1;
}

function sortByRentalPeriod(a: InputRentalPricing, b: InputRentalPricing) {
  const periodACardinality = calculatePeriodCardinality(a.period);
  const periodBCardinality = calculatePeriodCardinality(b.period);

  const durationACardinality = calculateDurationCardinality(a.duration);
  const durationBCardinality = calculateDurationCardinality(b.duration);

  if (periodACardinality === periodBCardinality) {
    return durationACardinality - durationBCardinality;
  }
  return periodACardinality - periodBCardinality;
}

const rentalPricingAdapter = createEntityAdapter<InputRentalPricing>({
  selectId: rentalPricing => rentalPricing.rentalPriceId,
  sortComparer: sortByRentalPeriod
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
