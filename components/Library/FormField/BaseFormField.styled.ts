// Consitently re-used components
import { InputBase } from "@material-ui/core";
import styled from "styled-components";

export const AFBaseFormField = styled(InputBase)`
  -webkit-appearance: none;
  -ms-appearance: none;
  -moz-appearance: none;
  appearance: none;
  background: #ffffff;
  box-shadow: 0 1px 4px 0 rgb(34 34 34 / 10%) inset;
  border-color: rgba(34, 34, 34, 0.15);
  border-style: solid;
  border-width: 1px;
  border-radius: 6px;
  color: #222222;
  display: block;
  font-family: inherit;
  font-size: 16px;
  line-height: 28px;
  height: 48px;
  outline: none;
  padding-top: 9px;
  padding-bottom: 9px;
  padding-left: 12px;
  padding-right: 12px;
  width: 100%;
  min-width: 0;
  box-sizing: border-box;
`;
