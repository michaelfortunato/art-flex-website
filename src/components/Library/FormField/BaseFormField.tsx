import { ChangeEventHandler } from "react";
import { InputBase, InputBaseProps, Typography } from "@material-ui/core";
import * as Styled from "./BaseFormField.styled";

export interface AFBaseFormFieldInput extends InputBaseProps {
  text: string;
}

export type FormField = typeof InputBase;
export type FormConfig = AFBaseFormFieldInput;

export default function AFBaseFormField(props: AFBaseFormFieldInput) {
  return (
    <div>
      <div style={{ paddingLeft: 2 }}>
        <Typography>
          <b>{props.text}</b>
        </Typography>
      </div>
      <Styled.AFBaseFormField {...props} />
    </div>
  );
}
