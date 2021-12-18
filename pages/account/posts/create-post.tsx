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
  ClickAwayListener,
  List,
  ListItem,
  ListItemText,
  Menu,
  MenuItem,
  TextField,
  IconButton,
  Table,
  TableContainer,
  TableHead,
  TableRow,
  TableBody,
  TableCell
} from "@material-ui/core";
import Image from "next/image";
import { useState, useRef, ReactElement, MouseEventHandler } from "react";
import { AnimatePresence, AnimateSharedLayout, motion } from "framer-motion";
import postPlaceHolderImg from "@public/create_post_placeholder.jpg";
import uploadFile from "@utils/chunked-upload";
import Dropzone from "@components/CreatePost/Dropzone";

import * as S from "@components/CreatePost/Post.styled";
import {
  ConfigurablePriceTable,
  InputPricing
} from "@components/CreatePost/InputPricing";

const MAX_IMAGES = 5;
const MAX_RENTAL_PRICES = 2;
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

interface RentalPricing {
  period: "Month" | "Year";
  duration: number;
  price: number;
}
interface BuyPricing {
  price: number;
}
interface Pricing {
  rentalPricing: RentalPricing[] | undefined;
  buyPrice: BuyPricing | undefined;
}

function isRentalPricing(
  pricing: RentalPricing | undefined
): pricing is RentalPricing {
  return pricing
    ? (pricing as RentalPricing).duration !== undefined &&
        (pricing as RentalPricing).period !== undefined
    : false;
}

function isBuyPricing(
  pricing: RentalPricing | BuyPricing
): pricing is BuyPricing {
  return (
    (pricing as BuyPricing).price !== undefined && !isRentalPricing(pricing)
  );
}

interface PostImage extends File {
  preview: string;
}

interface PostInterface {
  title: string | undefined;
  description: string | undefined;
  images: PostImage[];
  pricing: Pricing;
}

function InputTitle(props: { setTitle: any }) {
  return (
    <S.InputForm
      autoComplete="title"
      autoFocus={true}
      placeholder={"Type your title here"}
      onChange={e =>
        // Maybe we need value autoComplete in sign up form
        props.setTitle(
          e.target.value
            .toLowerCase()
            .split(" ")
            .map(s => s.charAt(0).toUpperCase() + s.substring(1))
            .join(" ")
        )
      }
    ></S.InputForm>
  );
}
function InputDescription(props: { setDescription: any }) {
  return (
    <S.InputForm
      fullWidth
      multiline
      spellCheck
      autoComplete="title"
      autoFocus={true}
      placeholder={"Type your description here"}
      onChange={e => props.setDescription(e.target.value)}
    ></S.InputForm>
  );
}

function PostImages(props: {
  uploadStep: number;
  images: PostImage[];
  setImages: any;
}) {
  return (
    <Grid container justifyContent="center">
      <Grid item xs="auto">
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
      </Grid>
    </Grid>
  );
}

const TagValues = {
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

const emptyTagsConfig = [
  ["Modernism", "period"],
  ["New York", "social"],
  ["Pastel", "prominence"]
];

function EmptyTags() {
  return (
    <S.RevealInputStep showBlur container spacing={3}>
      {emptyTagsConfig.map(tagKey => (
        <Grid key={tagKey[0]} item xs="auto">
          <S.Tag variant={tagKey[1] as S.TagVariants}>{tagKey[0]}</S.Tag>
        </Grid>
      ))}
    </S.RevealInputStep>
  );
}

type PurchaseButtonProps = {
  pricing: RentalPricing | BuyPricing;
  onClick?: (e: MouseEventHandler<HTMLButtonElement>) => void;
};

export function PurchaseButton(props: PurchaseButtonProps) {
  let color: "primary" | "secondary" | undefined;
  let text: string;
  if (isRentalPricing(props.pricing)) {
    const period = `${props.pricing.period}${
      props.pricing.duration > 1 && "s"
    }`;
    text = `Rent for $${props.pricing.price}} per ${props.pricing.duration} ${period}`;
    color = "secondary";
  } else if (isBuyPricing(props.pricing)) {
    text = `Buy for $${props.pricing.price}`;
    color = "primary";
  } else {
    throw new Error("Invalid prop type for props.pricing.");
  }
  return (
    <Button variant="contained" color={color}>
      {text}
    </Button>
  );
}

type PostPricingProps = {
  pricing: Pricing;
  setPricing: any;
};
function PostPricing(props: PostPricingProps) {
  const { pricing, setPricing } = props;
  return (
    <S.RevealInputStep container spacing={2}>
      <Grid item xs="auto">
        <Button>Add Purchase Option</Button>
      </Grid>
      <Grid item xs="auto"></Grid>
    </S.RevealInputStep>
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
  const { images, pricing } = props.post;
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
        <S.InputContainer>
          <InputTitle setTitle={setTitle} />
        </S.InputContainer>
        <S.InputContainer style={{ borderBottomStyle: "none" }}>
          <EmptyTags />
        </S.InputContainer>
        <S.InputContainer style={{ maxHeight: 200, overflowY: "auto" }}>
          <InputDescription setDescription={setDescription} />
        </S.InputContainer>
        <S.InputContainer
          style={{
            borderBottomStyle: "none"
          }}
        >
          <InputPricing />
        </S.InputContainer>
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
  const inputContainerRef = useRef<any>(null);

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
        <Grid
          layout
          component={motion.div}
          container
          item
          direction="column"
          alignItems="center"
          spacing={8}
        >
          <Grid
            item
            xs="auto"
            component={motion.div}
            container
            direction="row"
            justifyContent="space-evenly"
            layout
          >
            <AnimateSharedLayout>
              <Grid item xs="auto" component={motion.div} key="front" layout>
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
              <Grid
                layout
                component={motion.div}
                ref={inputContainerRef}
                item
                xs="auto"
                key="configure"
              ></Grid>
            </AnimateSharedLayout>
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
