import { useState } from "react";
import styled from "styled-components";
import { Grid, Typography, IconButton } from "@material-ui/core";
import { Add } from "@material-ui/icons";
import * as BaseForm from "@components/Library/FormField/BaseFormField.styled";
import CustomAutocomplete from "@components/CustomAutocomplete";
import { InputRentalPeriod } from "./InputPricing";

const StyledFilloutPriceButton = styled(Grid)`
  background-color: rgb(103, 58, 183);
  border-bottom-color: rgb(255, 255, 255);
  border-bottom-left-radius: 4px;
  border-bottom-right-radius: 4px;
  border-bottom-style: none;
  border-bottom-width: 0px;
  border-image-outset: 0;
  border-image-repeat: stretch;
  border-image-slice: 100%;
  border-image-source: none;
  border-image-width: 1;
  border-left-color: rgb(255, 255, 255);
  border-left-style: none;
  border-left-width: 0px;
  border-right-color: rgb(255, 255, 255);
  border-right-style: none;
  border-right-width: 0px;
  border-top-color: rgb(255, 255, 255);
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
  border-top-style: none;
  border-top-width: 0px;
  box-shadow: rgba(0, 0, 0, 0.2) 0px 3px 1px -2px,
    rgba(0, 0, 0, 0.14) 0px 2px 2px 0px, rgba(0, 0, 0, 0.12) 0px 1px 5px 0px;
  box-sizing: border-box;
  color: rgb(255, 255, 255);
  cursor: pointer;
  font-family: Roboto, Helvetica, Arial, sans-serif;
  font-size: 14px;
  font-stretch: 100%;
  font-style: normal;
  font-variant-caps: normal;
  font-variant-east-asian: normal;
  font-variant-ligatures: normal;
  font-variant-numeric: normal;
  font-weight: 500;
  letter-spacing: 0.39998px;
  line-height: 24.5px;
  margin-bottom: 0px;
  margin-left: 0px;
  margin-right: 0px;
  margin-top: 0px;
  min-width: 64px;
  outline-color: rgb(255, 255, 255);
  outline-style: none;
  outline-width: 0px;
  padding-bottom: 6px;
  padding-left: 16px;
  padding-right: 16px;
  padding-top: 6px;
  text-decoration-color: rgb(255, 255, 255);
  text-decoration-line: none;
  text-decoration-style: solid;
  text-decoration-thickness: auto;
  text-indent: 0px;
  text-rendering: auto;
  text-shadow: none;
  text-transfor: muppercase;
  user-select: none;
  vertical-align: middle;
  word-spacing: 0px;
  writing-mode: horizontal-tb;
  -webkit-font-smoothing: antialiased;
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
  -webkit-border-image: none;
`;

const StyledFilloutPriceButtonLabel = styled(Grid)`
  color: rgb(255, 255, 255);
  cursor: pointer;
  font-family: Roboto, Helvetica, Arial, sans-serif;
  font-size: 14px;
  font-stretch: 100%;
  font-style: normal;
  font-variant-caps: normal;
  font-variant-east-asian: normal;
  font-variant-ligatures: normal;
  font-variant-numeric: normal;
  font-weight: 500;
  justify-content: center;
  letter-spacing: 0.39998px;
  line-height: 24.5px;
  text-align: center;
  text-decoration-thickness: auto;
  text-indent: 0px;
  text-rendering: auto;
  text-shadow: none;
  text-transform: uppercase;
  user-select: none;
  word-spacing: 0px;
  writing-mode: horizontal-tb;
  -webkit-font-smoothing: antialiased;
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
`;

export function FilloutPriceButton() {
  const [rentalPeriod, setRentalPeriod] = useState<InputRentalPeriod | null>(
    null
  );
  console.log(rentalPeriod);
  return (
    <Grid container alignItems="center">
      <StyledFilloutPriceButton container alignItems="center" item xs={11}>
        <StyledFilloutPriceButtonLabel
          item
          xs="auto"
          container
          alignItems="center"
        >
          <Grid item xs="auto">
            <Typography variant="body1">
              <b>Rent For $</b>
            </Typography>
          </Grid>
          <Grid item xs="auto">
            <BaseForm.AFBaseFormField
              style={{
                height: 36,
                width: 120,
                paddingTop: 2,
                marginLeft: 0,
                marginRight: 10
              }}
              type="number"
              placeholder="Enter price"
            />
          </Grid>
          <Grid item xs="auto" style={{ marginRight: 10 }}>
            <Typography variant="body1">
              <b>For</b>
            </Typography>
          </Grid>
          <Grid item xs="auto">
            <CustomAutocomplete
              options={["1 Month"]}
              width={120}
              InputProps={{
                placeholder: "Select Period",
                style: {
                  height: 36,
                  width: 120,
                  paddingTop: 2,
                  marginRight: 10
                }
              }}
              onChange={newValue =>
                setRentalPeriod(newValue as InputRentalPeriod)
              }
            >
              <BaseForm.AFBaseFormField />
            </CustomAutocomplete>
          </Grid>
        </StyledFilloutPriceButtonLabel>
      </StyledFilloutPriceButton>
      <Grid item xs={1}>
        <IconButton color="primary">
          <Add />
        </IconButton>
      </Grid>
    </Grid>
  );
}
