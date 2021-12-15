import styled from "styled-components";
import { useAutocomplete } from "@material-ui/lab";
import { InputBaseProps } from "@material-ui/core";
import React, { useEffect } from "react";

const StyledListBox = styled.ul<{ width: number | string }>`
  width: ${props =>
    typeof props.width === "number" ? `${props.width}px` : props.width};
  margin: 0px;
  margin-right: 10px;
  padding: 0px;
  z-index: 2;
  position: absolute;
  list-style: none;
  background-color: white;
  color: black;
  overflow: auto;
  max-height: 200px;
  border: 1px solid rgba(0, 0, 0, 0.25);
  & li[data-focus="true"] {
    background-color: #4a8df6;
    color: white;
    cursor: pointer;
  }
  & li:active: {
    background-color: #2977f5;
    color: white;
  }
`;

type CustomAutocompleteProps = {
  options: string[];
  children: any;
  width: number | string;
  onChange: (newValue: string | null) => void;
  InputProps?: InputBaseProps;
};
export default function CustomAutocomplete(props: CustomAutocompleteProps) {
  const {
    getRootProps,
    getInputProps,
    getListboxProps,
    getOptionProps,
    groupedOptions,
    value
  } = useAutocomplete({
    id: "use-autocomplete-demo",
    options: props.options,
    getOptionLabel: (option: string) => option
  });
  const { onChange } = props;
  useEffect(() => {
    onChange(value);
  }, [value, onChange]);
  return (
    <div {...getRootProps()}>
      {React.cloneElement(props.children, {
        style: { width: props.width },
        ...props.InputProps,
        ...getInputProps()
      })}
      {groupedOptions.length > 0 ? (
        <StyledListBox key={1} {...getListboxProps()} width={props.width}>
          {groupedOptions.map((option, index) => (
            <li key={index} {...getOptionProps({ option, index })}>
              {option}
            </li>
          ))}
        </StyledListBox>
      ) : null}
    </div>
  );
}
