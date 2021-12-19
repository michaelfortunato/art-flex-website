import { useState } from "react";
import styled from "styled-components";
import { Grid } from "@material-ui/core";
import { Cancel } from "@material-ui/icons";
import { IconButton } from "@material-ui/core";
import { motion, AnimatePresence } from "framer-motion";
import CustomAutocomplete from "@components/CustomAutocomplete";
import { AFBaseFormField } from "@components/Library/FormField/BaseFormField.styled";
import { Autocomplete } from "@material-ui/lab";

type TagVariant = "period" | "social" | "prominence";

export const TagContainer = styled(Grid)<{
  variant?: TagVariant;
  customBackgroundColor?: string;
  customColor?: string;
}>`
  border-radius: 20px;
  opacity: 0.8;
  padding: 5px;
  padding-left: 15px;
  padding-right: 10px;
  background-color: ${props =>
    props.variant
      ? props.theme.tag[props.variant].backgroundColor
      : props.customBackgroundColor};
  color: ${props =>
    props.variant
      ? props.theme.tag[props.variant].textColor
      : props.customColor};
`;

const TagLabels = {
  // Periods
  Modernism: {
    variant: "period"
  },
  Surrealism: {
    variant: "period"
  },
  Impressionism: {
    variant: "period"
  },
  // Locations
  "New York": {
    variant: "social"
  },
  "Los Angeles": {
    variant: "social"
  },
  Paris: {
    variant: "social"
  },
  // Mediums
  Pastel: {
    variant: "prominence"
  },
  Drawing: {
    variant: "prominence"
  }
};

export function Tag(props: {
  label: string;
  variant: TagVariant;
  children: React.ReactNode;
}) {
  return (
    <TagContainer
      container
      justifyContent="space-between"
      alignItems="center"
      variant={props.variant}
      spacing={0}
    >
      <Grid item xs="auto">
        {props.label}
      </Grid>
      {props.children && (
        <Grid item xs="auto">
          {props.children}
        </Grid>
      )}
    </TagContainer>
  );
}

// type TagLabel = keyof typeof TagLabels;

type InputTagProps = { label: string; variant: TagVariant };
export function InputTag(props: InputTagProps) {
  const [showCancelButton, setShowCancelButton] = useState(false);
  function handleMouseOver() {
    if (!showCancelButton) setShowCancelButton(true);
  }
  function handleMouseOut() {
    if (showCancelButton) setShowCancelButton(false);
  }
  return (
    <div style={{ display: "inline-block" }}>
      <Tag variant={props.variant} label={props.label}>
        <IconButton size="small">
          <Cancel fontSize="small" />
        </IconButton>
      </Tag>
    </div>
  );
}

export function ConfigureTags() {
  return (
    <Grid container direction="column">
      <Grid item xs="auto">
        <Autocomplete
          multiple
          options={Object.keys(TagLabels)}
          renderTags={(value: readonly string[], getTagProps) => {
            console.log(value);
            return value.map((option: string, index: number) => {
              console.log(option);
              console.log(getTagProps({ index }));
              return (
                <InputTag
                  key={index}
                  label={option}
                  variant="period"
                  {...getTagProps({ index })}
                />
              );
            });
          }}
          filterSelectedOptions
          renderInput={params => {
            console.log(params);
            return (
              <div ref={params.InputProps.ref}>
                <AFBaseFormField
                  placeholder="Add tags to your artwork"
                  {...params.inputProps}
                />
              </div>
            );
          }}
        />
      </Grid>
    </Grid>
  );
}
