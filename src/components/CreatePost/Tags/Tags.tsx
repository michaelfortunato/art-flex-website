import { useState, ChangeEvent } from "react";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import { Grid, TextField, IconButton, Chip, useTheme } from "@material-ui/core";
import { Cancel } from "@material-ui/icons";
import { Autocomplete } from "@material-ui/lab";
import { makeStyles } from "@material-ui/styles";
import { selectTags, setTags } from "./tagsSlice";
import { Tag as TagProps, TagCategory } from "../Post";

type TagVariant = "period" | "social" | "prominence";
/*
export const TagContainer = styled(Grid)<{
  variant?: TagCategory;
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
*/

export const FakeTags: TagProps[] = [
  {
    category: "Period",
    label: "Modernism"
  },
  {
    category: "Period",
    label: "Surrealism"
  },
  {
    category: "Period",
    label: "Impressionism"
  },
  {
    category: "Location",
    label: "New York"
  },
  {
    category: "Location",
    label: "Los Angeles"
  },
  {
    category: "Location",
    label: "Paris"
  },
  {
    category: "Medium",
    label: "Pastel"
  },
  {
    category: "Medium",
    label: "Graphite"
  }
];

const TagColors = {
  Period: {
    backgroundColor: "#673ab7",
    textColor: "white"
  },
  Location: {
    backgroundColor: "#ffea00",
    textColor: "white"
  },
  Medium: {
    backgroundColor: "#73a3f0",
    textColor: "white"
  }
} as any;

const Tag = styled(Chip)<{ category: string }>`
  font-size: 14px;
  font-weight: 500;
  background-color: ${props =>
    props.category in TagColors
      ? TagColors[props.category].backgroundColor
      : props.theme.palette.primary.main};
  color: ${props =>
    props.category in TagColors
      ? TagColors[props.category].textColor
      : "#FFFFFF"};
`;

export function PostTags(props: { tags: TagProps[] }) {
  return (
    <Grid container spacing={1}>
      {props.tags.map(({ category, label }) => (
        <Grid item key={label}>
          <Tag category={category} label={label} />
        </Grid>
      ))}
    </Grid>
  );
}

/*
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
*/
// type TagLabel = keyof typeof TagLabels;
/*
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
*/
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
        options={FakeTags}
        getOptionLabel={tags => tags.label}
        groupBy={option => option.category}
        onChange={(event: ChangeEvent<{}>, tags: TagProps[]) =>
          dispatch(setTags({ tags }))
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
          value.map(({ label, category }, index) => (
            <Tag
              key={label}
              style={{ fontSize: 14, fontWeight: 500 }}
              label={label}
              category={category}
              {...getTagProps({ index })}
            />
          ))
        }
      />
    </div>
  );
}
