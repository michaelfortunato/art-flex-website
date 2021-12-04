import { ChangeEventHandler } from "react";
import { InputBaseProps, Typography } from "@material-ui/core";
import * as Styled from "./BaseFormField.styled";

export interface BaseFormFieldInput extends InputBaseProps {
  text: string;
  type: string;
}

export default function BaseFormField(props: BaseFormFieldInput) {
  return (
    <div>
      <div style={{ paddingLeft: 2 }}>
        <Typography>
          <b>{props.text}</b>
        </Typography>
      </div>
      <Styled.BaseForm {...props} />
    </div>
  );
}
