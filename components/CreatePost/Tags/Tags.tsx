import { useState, ChangeEvent } from "react";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import { Grid, TextField, IconButton, Chip } from "@material-ui/core";
import { Cancel } from "@material-ui/icons";
import { Autocomplete } from "@material-ui/lab";
import { selectTags, setTags } from "./tagsSlice";
import { makeStyles } from "@material-ui/styles";

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

export function DraftTags() {
  const { tags } = useSelector(selectTags);
  return (
    <Grid container spacing={1}>
      {tags.map(tag => (
        <Grid item key={tag}>
          <Chip
            color="primary"
            label={tag}
            style={{ fontSize: 14, fontWeight: 500 }}
          />
        </Grid>
      ))}
    </Grid>
  );
}

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
const useStyles = makeStyles({
  underline: {
    "&::before": {
      transition: "none",
      borderBottom: "1px solid #000000"
    },
    "&::after": {
      transition: "none",
      borderBottom: "1px solid #000000"
    },
    "&:hover:not(.Mui-disabled):before": {
      borderBottom: "1px solid #000000"
    },
    "&:hover:not(.Mui-disabled):after": {
      borderBottom: "1px solid #000000"
    }
  }
});
export function ConfigureTags() {
  const dispatch = useDispatch();
  const classes = useStyles();
  return (
    <div>
      <Autocomplete
        multiple
        options={Object.keys(TagLabels)}
        onChange={(event: ChangeEvent<{}>, value: string[]) =>
          dispatch(setTags({ tags: value }))
        }
        renderInput={params => (
          <TextField
            {...params}
            style={{ maxWidth: 500 }}
            placeholder="Tag your artwork"
            variant="standard"
            InputProps={{
              ...params.InputProps,
              endAdornment: null,
              classes
            }}
          />
        )}
        renderTags={(value, getTagProps) =>
          value.map((label, index) => (
            <Chip
              key={index}
              style={{ fontSize: 14, fontWeight: 500 }}
              color="primary"
              label={label}
              {...getTagProps({ index })}
            />
          ))
        }
      />
    </div>
  );
}
