import { useState } from "react";
import styled from "styled-components";
import { Cancel } from "@material-ui/icons";
import { IconButton } from "@material-ui/core";
import { motion, AnimatePresence } from "framer-motion";

type TagVariant = "period" | "social" | "prominence";

export const Tag = styled.span<{
  variant?: TagVariant;
  customBackgroundColor?: string;
  customColor?: string;
}>`
  display: inline-block;
  margin: 4px;
  padding: 5px;
  padding-left: 10px;
  padding-right: 10px;
  border-radius: 20px;
  opacity: 0.8;
  background-color: ${props =>
    props.variant
      ? props.theme.tag[props.variant].backgroundColor
      : props.customBackgroundColor};
  color: ${props =>
    props.variant
      ? props.theme.tag[props.variant].textColor
      : props.customColor};
`;

const CancelTagIcon = styled(motion.span)`
  position: absolute;
  top: 0%;
  right: 0%;
  transform-origin: center;
  transform: translate(50%, -50%);
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
    <div
      style={{ position: "relative", display: "inline-block" }}
      onMouseOver={handleMouseOver}
      onMouseOut={handleMouseOut}
    >
      <Tag variant={props.variant}>{props.label}</Tag>
      <AnimatePresence>
        {showCancelButton && (
          <CancelTagIcon
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <IconButton size="medium">
              <Cancel fontSize="small" />
            </IconButton>
          </CancelTagIcon>
        )}
      </AnimatePresence>
    </div>
  );
}

export function ConfigureTags() {
  <Grid container direction="column">
    <Grid item></Grid>
  </Grid>;
}
