import { RootState } from "@redux-store/store";
import {
  createEntityAdapter,
  createSlice,
  PayloadAction
} from "@reduxjs/toolkit";
import { RentalPricing, validRentalPricing } from "../CreatePost.api";

type ErrorType = { error: string };
type InputRentalPricing = { rentalPriceId: string } & Partial<
  RentalPricing & ErrorType
>;

const rentalPricingAdapter = createEntityAdapter<InputRentalPricing>({
  selectId: rentalPricing => rentalPricing.rentalPriceId
});

export const rentalPricingSlice = createSlice({
  name: "rentalPricing",
  initialState: rentalPricingAdapter.getInitialState(),

  reducers: {
    upsertRentalPrice: (state, action: PayloadAction<InputRentalPricing>) => {
      // Create the "reconstructed" rental pricing to be tested by
      // our validator
      const stagedRentalPricing = {
        ...state.entities[action.payload.rentalPriceId],
        ...action.payload,
        error: undefined
      };
      console.log("ehr;eklwjr;lkj");
      console.log(stagedRentalPricing);
      console.log("ehr;eklwjr;lkj");
      const error = !validRentalPricing(stagedRentalPricing)
        ? "Invalid/incomplete rental pricing configuration."
        : undefined;
      console.log(action.payload);
      rentalPricingAdapter.upsertOne(state, {
        ...action.payload,
        error
      });
    },
    removeRentalPrice: rentalPricingAdapter.removeOne
  }
});

// Export actions
export const { upsertRentalPrice, removeRentalPrice } =
  rentalPricingSlice.actions;

// Export selectors
export const {
  selectIds: selectAllRentalPricingIds,
  selectAll: selectAllRentalPricings,
  selectById: selectRentalPricingById
} = rentalPricingAdapter.getSelectors(
  (state: RootState) => state.createPost.pricing.rentalPricing
);

export default rentalPricingSlice.reducer;
