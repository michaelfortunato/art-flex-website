import styled from "styled-components";
import Appbar from "@components/Appbar/Appbar";
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
  ClickAwayListener
} from "@material-ui/core";
import Image from "next/image";
import {
  useState,
  useRef,
  useEffect,
  useLayoutEffect,
  forwardRef,
  ReactElement,
  ChangeEvent
} from "react";
import ArrowForwardIcon from "@material-ui/icons/ArrowForward";
import CheckIcon from "@material-ui/icons/Check";
import { AnimatePresence, AnimateSharedLayout, motion } from "framer-motion";
import postPlaceHolderImg from "@public/create_post_placeholder.jpg";
import { v4 as uuidv4 } from "uuid";
import uploadFile from "@utils/chunked-upload";
import Dropzone from "@components/CreatePost/Dropzone";

const MAX_IMAGES = 5;
const steps = [
  {
    stepTitle: "Name and description",
    stepContent: "Please enter the title of your piece and give a description"
  },
  {
    stepTitle: "Upload photos",
    stepContent: `Please upload 2-${MAX_IMAGES} photos of your piece`
  },
  {
    stepTitle: "Set your price",
    stepContent:
      "Set the price for your piece. You can choose to have customers rent it, buy it or both."
  },
  {
    stepTitle: "Summary",
    stepContent: "Summary"
  }
];

function UploadStatus() {}

interface PostImage extends File {
  preview: string;
}

interface PostInterface {
  title: string | undefined;
  description: string | undefined;
  images: PostImage[];
}

function InputDescription(props: { setDescription: any }) {
  return (
    <div
      style={{
        maxHeight: 200,
        overflowY: "auto",
        marginTop: 20,
        borderBottomStyle: "solid",
        borderBottomColor: "#000000"
      }}
    >
      <InputBase
        fullWidth
        style={{
          fontSize: "1rem",
          minHeight: 40,
          fontStyle: "italic"
        }}
        multiline
        spellCheck
        autoComplete="title"
        autoFocus={true}
        placeholder={"Type your description here"}
        onChange={e => props.setDescription(e.target.value)}
      ></InputBase>
    </div>
  );
}

function PostImages(props: {
  uploadStep: number;
  images: PostImage[];
  setImages: any;
}) {
  return (
    <div
      style={{
        display: "inline-block",
        height: 440,
        width: 400,
        marginBottom: 20
      }}
    >
      <AnimatePresence exitBeforeEnter>
        {props.uploadStep === 0 ? (
          <motion.div
            key={0}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              borderStyle: "solid",
              borderColor: "#OOOOOO",
              filter: "blur(.5rem)"
            }}
          >
            <Image src={postPlaceHolderImg} alt="" placeholder="blur" />
          </motion.div>
        ) : (
          <Dropzone images={props.images} setImages={props.setImages} />
        )}
      </AnimatePresence>
    </div>
  );
}

function Post(props: {
  accountName: string;
  uploadStep: number;
  post: PostInterface;
  setPost: {
    setTitle: any;
    setDescription: any;
    setImages: any;
  };
}) {
  const { images } = props.post;
  const { setTitle, setDescription, setImages } = props.setPost;
  return (
    <Paper
      elevation={3}
      style={{
        padding: 60,
        borderRadius: 10,
        display: "inline-block"
      }}
    >
      <div>
        <PostImages
          uploadStep={props.uploadStep}
          images={images}
          setImages={setImages}
        />
        <Divider style={{ height: 1, marginBottom: 20, marginTop: 10 }} />
        <div>
          <Typography variant="h5">{props.accountName}</Typography>
        </div>
        <div
          style={{
            maxHeight: 200,
            overflowY: "auto",
            marginTop: 20,
            borderBottomStyle: "solid",
            borderBottomColor: "#000000"
          }}
        >
          <InputBase
            fullWidth
            style={{
              fontSize: "1rem",
              minHeight: 40,
              fontStyle: "italic"
            }}
            multiline
            spellCheck
            autoComplete="title"
            autoFocus={true}
            placeholder={"Type your description here"}
            onChange={e => setDescription(e.target.value)}
          ></InputBase>
        </div>
        <div style={{ marginTop: 20, borderBottomStyle: "solid" }}>
          <InputBase
            style={{ minHeight: 40, fontStyle: "italic" }}
            autoComplete="title"
            autoFocus={true}
            placeholder={"Type your title here"}
            onChange={e =>
              // Maybe we need value in sign up form
              setTitle(
                e.target.value
                  .toLowerCase()
                  .split(" ")
                  .map(s => s.charAt(0).toUpperCase() + s.substring(1))
                  .join(" ")
              )
            }
          ></InputBase>
        </div>
      </div>
    </Paper>
  );
}

export default function CreatePost() {
  const [uploadStep, setUploadStep] = useState(0);

  // Define the attributes for the post
  const [title, setTitle] = useState<undefined | string>(undefined);
  const [description, setDescription] = useState<undefined | string>(undefined);
  const [images, setImageBase] = useState<PostImage[]>([]);
  const setImages = (newImages: PostImage[]) =>
    setImageBase(oldImages => newImages.concat(oldImages).slice(0, MAX_IMAGES));

  const isButtonDisabled = (): boolean => {
    switch (uploadStep) {
      case 0:
        return title === undefined || description === undefined;
      default:
        return false;
    }
  };
  const handleNext = () => {
    if (uploadStep < steps.length - 1) {
      setUploadStep(uploadStep + 1);
    } else {
      uploadFile();
      // upload("/account/upload-image", images[0]);
      // upload_post({ title, description, images });
    }
  };
  const handlePrevious = () => {
    setUploadStep(uploadStep - 1);
  };
  return (
    <Grid container direction="column" spacing={8}>
      <AnimateSharedLayout>
        <Grid item xs="auto">
          <Stepper activeStep={uploadStep} alternativeLabel>
            {steps.map(({ stepTitle, stepContent }) => (
              <Step key={stepTitle}>
                <StepLabel>
                  <Typography>{stepContent}</Typography>
                </StepLabel>
              </Step>
            ))}
          </Stepper>
        </Grid>
        <Grid container item direction="column" spacing={8}>
          <Grid
            container
            item
            xs
            justifyContent="space-around"
            alignItems="center"
          >
            <Grid component={motion.div} key="front" item xs="auto" layout>
              <Post
                accountName={"Michael Fortunato"}
                uploadStep={uploadStep}
                post={{ title, description, images }}
                setPost={{
                  setTitle,
                  setDescription,
                  setImages
                }}
              />
            </Grid>
          </Grid>
          <Grid
            component={motion.div}
            layout
            container
            item
            xs="auto"
            justifyContent="center"
            direction="row"
            spacing={5}
          >
            <Grid item xs="auto">
              <Button disabled={uploadStep === 0} onClick={handlePrevious}>
                Back
              </Button>
            </Grid>
            <Grid item xs="auto">
              <Button
                disabled={isButtonDisabled()}
                variant="contained"
                color="primary"
                onClick={handleNext}
              >
                {uploadStep < steps.length - 1 ? "Next" : "Submit"}
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </AnimateSharedLayout>
    </Grid>
  );
}
const Container = styled.div`
  margin-left: auto;
  margin-right: auto;
  max-width: 1870px;
`;
CreatePost.getLayout = function getLayout(page: ReactElement) {
  return (
    <Container key={1}>
      <Appbar key={1} />
      {page}
    </Container>
  );
};
