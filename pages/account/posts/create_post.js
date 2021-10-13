import styled from "styled-components";
import Appbar from "@components/Appbar";
import {
  Button,
  Grid,
  Paper,
  Step,
  StepLabel,
  Stepper,
  Typography,
  Divider,
  InputBase,
} from "@material-ui/core";
import { useState, useRef, useLayoutEffect } from "react";
const Container = styled.div`
  margin-left: auto;
  margin-right: auto;
  max-width: 1870px;
`;

const steps = [
  {
    step_title: "Name and description",
    step_content: "Please enter the title of your piece and give a description",
  },
  {
    step_title: "Upload photos",
    step_content: "Please upload 2 photos of your piece",
  },
  {
    step_title: "Set your price",
    step_content:
      "Set the price for your piece. You can choose to have customers rent it, buy it or both.",
  },
];

const TextArea = () => {
  const ref = useRef();
  const [value, setValue] = useState(
    "Some initial text that both wraps and uses\nnew\nlines"
  );

  // This only tracks the auto-sized height so we can tell if the user has manually resized
  const autoHeight = useRef();

  useLayoutEffect(() => {
    if (!ref.current) {
      return;
    }

    if (
      autoHeight.current !== undefined &&
      ref.current.style.height !== autoHeight.current
    ) {
      // don't auto size if the user has manually changed the height
      return;
    }

    ref.current.style.height = "auto";
    ref.current.style.overflow = "hidden";
    const next = `${ref.current.scrollHeight}px`;
    ref.current.style.height = next;
    autoHeight.current = next;
    ref.current.style.overflow = "auto";
  }, [value, ref, autoHeight]);

  return (
    <textarea
      ref={ref}
      style={{
        resize: "vertical",
        minHeight: "1em",
        borderStyle: "none",
      }}
      value={value}
      onChange={(event) => setValue(event.target.value)}
    />
  );
};


const chunked_upload = async () => {

}


export default function CreatePost() {
  const [activeStep, setActiveStep] = useState(0);
  return (
    <Grid style={{ height: "100%" }} container direction="column" spacing={8}>
      <Grid item xs="auto">
        <Stepper activeStep={activeStep} alternativeLabel>
          {steps.map(({ step_title, step_content }) => {
            return (
              <Step key={step_title}>
                <StepLabel>
                  <Typography>{step_content}</Typography>
                </StepLabel>
              </Step>
            );
          })}
        </Stepper>
      </Grid>
      <Grid container item xs justifyContent="center" alignItems="center">
        <Grid item xs="auto">
          <Paper
            style={{ padding: 60, borderRadius: 10, display: "inline-block" }}
          >
            <div>
              <div
                style={{
                  display: "inline-block",
                  minHeight: 440,
                  width: 400,
                  borderStyle: "solid",
                  marginBottom: 20,
                }}
              ></div>
              <Divider style={{ height: 1, marginBottom: 10 }} />
              <div>
                <Typography variant="h5">Michael Fortunato</Typography>
              </div>
              <div
                style={{
                  maxHeight: 100,
                  overflowY: "auto",
                  marginTop: 20,
                  borderStyle: "solid",
                }}
              >
                <InputBase
                  fullWidth
                  style={{
                    fontSize: "1rem",
                    overflowY: "auto",
                    minHeight: 40,
                    fontStyle: "italic",
                  }}
                  autoComplete="title"
                  autoFocus={true}
                  placeholder={"Type your description here"}
                ></InputBase>
              </div>
              <div style={{ marginTop: 20, borderStyle: "solid" }}>
                <InputBase
                  style={{ minHeight: 40, fontStyle: "italic" }}
                  autoComplete="title"
                  autoFocus={true}
                  placeholder={"Type your title here"}
                ></InputBase>
              </div>
            </div>
          </Paper>
        </Grid>
      </Grid>
      <Grid
        container
        item
        xs="auto"
        justifyContent="center"
        direction="row"
        spacing={5}
      >
        <Grid item xs="auto">
          <Button disabled={activeStep === 0}>Back</Button>
        </Grid>
        <Grid item xs="auto">
          <Button variant="contained" color="primary">
            Next
          </Button>
        </Grid>
      </Grid>
    </Grid>
  );
}

CreatePost.getLayout = function getLayout(page) {
  return (
    <Container key={1}>
      <Appbar key={1} />
      {page}
    </Container>
  );
};
