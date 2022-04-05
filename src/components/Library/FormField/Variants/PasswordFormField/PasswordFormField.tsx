import { useState } from "react";
import { useTheme ,
  InputAdornment,
  IconButton,
  FormHelperText,
  Typography
} from "@material-ui/core";
import { Visibility, VisibilityOff } from "@material-ui/icons";
import AFBaseFormField, { AFBaseFormFieldInput } from "../../BaseFormField";

export interface AFPasswordFormFieldInput extends AFBaseFormFieldInput {
  setPassword: (userInput: string) => void;
  validPassword?: boolean;
  error?: boolean;
  helperText?: String;
}

export default function AFPasswordFormField(props: AFPasswordFormFieldInput) {
  const theme = useTheme();
  const [showPassword, setShowPassword] = useState(false);
  const handleMouseDownPassword = (event: any) => {
    event.preventDefault();
  };

  const helperTextColor = props.validPassword
    ? theme.palette.success.main
    : props.error
    ? theme.palette.error.main
    : "inherit";
  return (
    <div>
      <AFBaseFormField
        text={props.text}
        error={props.error}
        style={{ cursor: "text", display: "inline-flex" }}
        fullWidth
        type={showPassword ? "text" : "password"}
        onChange={event => props.setPassword(event.target.value)}
        endAdornment={
          <InputAdornment position="end">
            <IconButton
              aria-label="toggle password visibility"
              onClick={() => setShowPassword(!showPassword)}
              onMouseDown={handleMouseDownPassword}
            >
              {showPassword ? <Visibility /> : <VisibilityOff />}
            </IconButton>
          </InputAdornment>
        }
      ></AFBaseFormField>
      {props.helperText && (
        <FormHelperText style={{ color: helperTextColor }}>
          {props.helperText}
        </FormHelperText>
      )}
    </div>
  );
}
