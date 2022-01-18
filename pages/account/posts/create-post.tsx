import styled from "styled-components";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import Appbar from "@components/Appbar/Appbar";
import {
  Button,
  Grid,
  Step,
  StepLabel,
  Stepper,
  Typography,
  InputBase,
  useTheme
} from "@material-ui/core";
import Image from "next/image";
import { useState, useRef, ReactElement, MouseEventHandler } from "react";
import { AnimatePresence, AnimateSharedLayout, motion } from "framer-motion";
import uploadFile from "@utils/chunked-upload";
import InputTitle from "@components/CreatePost/Title/Title";
import InputDescription from "@components/CreatePost/Description/Description";
import * as S from "@components/CreatePost/Post.styled";

import {
  ConfigureTags,
  PostTags,
  InputTag,
  FakeTags
} from "@components/CreatePost/Tags/Tags";
import {
  addTitle,
  selectIsTitleValid,
  selectIsValidTitle,
  selectTitle
} from "@components/CreatePost/Title/titleSlice";
import {
  addDescription,
  selectDescripton,
  selectIsDescriptionValid,
  selectIsValidDescription
} from "@components/CreatePost/Description/descriptionSlice";
import {
  selectAreImagesValid,
  selectImages,
  selectNumberOfImages
} from "@components/CreatePost/Images/imagesSlice";
import {
  selectBuyPrice,
  selectValidBuyPrice
} from "@components/CreatePost/Pricing/buyPricingSlice";
import {
  ConfigureImages,
  Images as PostImages
} from "@components/CreatePost/Images/Images";
import {
  selectAllRentalPricingIds,
  selectAllRentalPricings,
  selectAllValidRentalPrices,
  selectAllValidRentalPricings
} from "@components/CreatePost/Pricing/rentalPricingsSlice";
import {
  getDescriptionError,
  getTitleError,
  isTag,
  PostProps,
  PostWrapper,
  validBuyPricing,
  validDescription,
  validImages,
  validRentalPricing,
  validTitle,
  MAX_IMAGES
} from "@components/CreatePost/Post";
import {
  ConfigurePrices,
  ConfigurePriceTable,
  DraftPrices,
  DraftPricing
} from "@components/CreatePost/Pricing/Pricing";
import { InputRentalPriceButton } from "@components/CreatePost/Pricing/PriceButtons";
import {
  selectAreTagsValid,
  selectTags
} from "@components/CreatePost/Tags/tagsSlice";

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
      "Set the price for your piece. You can choose to have customers rent it, buy it, or both." +
      " Add tags to your piece."
  },
  {
    stepTitle: "Summary",
    stepContent: "Summary"
  }
];

function UploadStatus() {}

function PostDraft2(props: { accountName: string; uploadStep: number }) {
  return (
    <PostWrapper
      Image={<PostImages uploadStep={props.uploadStep} />}
      artistName={"Michael Fortunato"}
      Title={<InputTitle />}
      Tags={<ConfigureTags />}
      Description={<InputDescription />}
      Pricing={
        <div>
          <InputRentalPriceButton id="fpp" />
        </div>
      }
    />
  );
}

function DraftTitleWrapper() {
  const title = useSelector(selectTitle);
  return <i>{title !== "" ? title : "Type your title here"}</i>;
}
function DraftDescriptionWrapper() {
  const description = useSelector(selectDescripton);
  return (
    <S.RevealInputStep>
      <Typography>
        {description !== "" && description !== undefined
          ? description
          : "Type your description here"}
      </Typography>
    </S.RevealInputStep>
  );
}

function DraftTagsWrapper(props: { placeholder?: boolean }) {
  const tags = useSelector(selectTags);
  return (
    <div style={{ minHeight: 40 }}>
      {props.placeholder ? (
        <S.RevealInputStep showBlur={true}>
          <PostTags tags={[FakeTags[0], FakeTags[3], FakeTags[6]]} />
        </S.RevealInputStep>
      ) : (
        <PostTags tags={tags} />
      )}
    </div>
  );
}

function DraftPricingWrapper(props: { placeholder?: boolean }) {
  const rentalPricings = useSelector(selectAllValidRentalPricings);
  const buyPrice = useSelector(selectValidBuyPrice);

  return (
    <div style={{ minHeight: 120 }}>
      {props.placeholder ? (
        <S.RevealInputStep showBlur={true}>
          <DraftPricing
            buyPrice={{ price: 1000 }}
            rentalPrices={[
              { rentalPriceId: 0, price: 50, duration: 12, period: "Month" }
            ]}
          />
        </S.RevealInputStep>
      ) : (
        <DraftPricing buyPrice={buyPrice} rentalPrices={rentalPricings} />
      )}
    </div>
  );
}

function PostDraft(props: {
  uploadStep: number;
  tagPlaceholder?: boolean;
  pricingPlaceholder?: boolean;
}) {
  return (
    <PostWrapper
      Image={<PostImages uploadStep={props.uploadStep} />}
      artistName={"Michael Fortunato"}
      Title={<DraftTitleWrapper />}
      Tags={<DraftTagsWrapper placeholder={props.tagPlaceholder} />}
      Description={<DraftDescriptionWrapper />}
      Pricing={<DraftPricingWrapper placeholder={props.pricingPlaceholder} />}
    />
  );
}

function ConfigureTitleAndDescription() {
  const dispatch = useDispatch();
  const { typography } = useTheme();
  return (
    <Grid
      container
      direction="column"
      justifyContent="space-evenly"
      style={{ height: "100%" }}
    >
      <Grid item>
        <InputBase
          multiline
          style={{
            fontSize: typography.h4.fontSize,
            borderBottom: "1px solid #000000"
          }}
          placeholder="Type your title here"
          onChange={e => dispatch(addTitle(e.target.value))}
        />
      </Grid>
      <Grid item>
        <InputBase
          multiline
          fullWidth
          style={{
            fontSize: typography.h4.fontSize,
            borderBottom: "1px solid #000000",
            minWidth: "500px",
            maxHeight: "200px",
            overflowY: "auto"
          }}
          placeholder="Type your description here"
          onChange={e => dispatch(addDescription(e.target.value))}
        />
      </Grid>
    </Grid>
  );
}

function ConfigurePricingAndTags(props: { hideTags?: boolean }) {
  return (
    <Grid
      container
      style={{ minHeight: "100%", maxWidth: 650 }}
      direction="column"
      justifyContent="space-around"
    >
      <Grid item xs>
        <ConfigurePrices />
      </Grid>
      <Grid item xs="auto">
        <S.RevealInputStep
          showBlur={props.hideTags}
          disableInteraction={props.hideTags}
        >
          <Grid container justifyContent="center">
            <Grid item xs="auto">
              <Typography variant="h4"> Add tags</Typography>
            </Grid>
          </Grid>
          <div>
            <ConfigureTags />
          </div>
        </S.RevealInputStep>
      </Grid>
    </Grid>
  );
}

function ConfigurePost(props: {
  uploadStep: number;
  isTitleValid?: boolean;
  isDescriptionValid?: boolean;
  areImagesValid?: boolean;
  areRentalPricingsValid?: boolean;
  isBuyPriceValid?: boolean;
  areTagsValid?: boolean;
}) {
  switch (props.uploadStep) {
    case 0:
      return <ConfigureTitleAndDescription />;
    case 1:
      return <ConfigureImages />;
    case 2:
      return (
        <ConfigurePricingAndTags
          hideTags={
            !props.areTagsValid &&
            !props.isBuyPriceValid &&
            !props.areRentalPricingsValid
          }
        />
      );
    default:
      return null;
  }
}

export default function CreatePost() {
  const [uploadStep, setUploadStep] = useState(0);

  // Define the attributes for the post
  const inputContainerRef = useRef<any>(null);

  const isTitleValid = useSelector(selectIsTitleValid);
  const isDescriptionValid = useSelector(selectIsDescriptionValid);
  const areImagesValid = useSelector(selectAreImagesValid);
  const validRentalPricings = useSelector(
    selectAllValidRentalPricings,
    shallowEqual
  );
  const validBuyPrice = useSelector(selectValidBuyPrice);
  const areTagsValid = useSelector(selectAreTagsValid);
  const numberOfImages = useSelector(selectNumberOfImages);

  // console.log(validTitle(title) && validDescription(description));
  // console.log(getTitleError(title));
  // console.log(getDescriptionError(description));
  const validStep = (): boolean => {
    switch (uploadStep) {
      case 0:
        return isTitleValid && isDescriptionValid;
      case 1:
        return areImagesValid;
      case 2:
        return (
          areTagsValid &&
          (validRentalPricings.length > 0 || validBuyPrice !== undefined)
        );
      default:
        return true;
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
    <Grid container direction="row" spacing={8} justifyContent="center">
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
          component={motion.div}
          container
          item
          xs={12}
          direction="row"
          justifyContent="center"
          alignItems="center"
        >
          <AnimateSharedLayout>
            <Grid
              container
              item
              xs={6}
              justifyContent="center"
              layout={uploadStep < 2}
              component={motion.div}
              key="front"
            >
              <Grid
                item
                xs="auto"
                component={motion.div}
                key="front"
                layout={false}
              >
                <PostDraft
                  uploadStep={uploadStep}
                  tagPlaceholder={
                    !areTagsValid &&
                    validBuyPrice === undefined &&
                    validRentalPricings.length < 1
                  }
                  pricingPlaceholder={
                    uploadStep < 2 &&
                    validBuyPrice === undefined &&
                    validRentalPricings.length < 1
                  }
                />
              </Grid>
            </Grid>
            {(numberOfImages > 0 || uploadStep !== 1) && (
              <Grid
                container
                justifyContent="center"
                component={motion.div}
                ref={inputContainerRef}
                item
                xs={6}
                key="configure"
              >
                <Grid item xs="auto">
                  <ConfigurePost
                    uploadStep={uploadStep}
                    isTitleValid={isTitleValid}
                    isDescriptionValid={isDescriptionValid}
                    areImagesValid={areImagesValid}
                    areRentalPricingsValid={validRentalPricings.length > 0}
                    isBuyPriceValid={validBuyPrice !== undefined}
                    areTagsValid={areTagsValid}
                  />
                </Grid>
              </Grid>
            )}
          </AnimateSharedLayout>
          <Grid
            component={motion.div}
            layout={false}
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
                disabled={!validStep()}
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
