import { useDispatch, useSelector } from "react-redux";
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
import { useState, useRef, MouseEventHandler } from "react";
import { AnimateSharedLayout, motion } from "framer-motion";
import uploadFile from "@utils/chunked-upload";
import InputTitle from "@components/CreatePost/Title/Title";
import InputDescription from "@components/CreatePost/Description/Description";
import * as S from "@components/CreatePost/Post.styled";

import {
  ConfigureTags,
  PostTags,
  FakeTags
} from "@components/CreatePost/Tags/Tags";
import { addTitle, selectTitle } from "@components/CreatePost/Title/titleSlice";
import {
  addDescription,
  selectDescripton
} from "@components/CreatePost/Description/descriptionSlice";
import { selectImages } from "@components/CreatePost/Images/imagesSlice";
import { selectBuyPrice } from "@components/CreatePost/Pricing/buyPricingSlice";
import {
  ConfigureImages,
  Images as PostImages
} from "@components/CreatePost/Images/Images";
import { selectAllRentalPricings } from "@components/CreatePost/Pricing/rentalPricingsSlice";
import { PostProps, PostWrapper } from "@components/CreatePost/Post";
import {
  ConfigurePrices,
  DraftPricing
} from "@components/CreatePost/Pricing/Pricing";
import { InputRentalPriceButton } from "@components/CreatePost/Pricing/PriceButtons";
import { selectTags } from "@components/CreatePost/Tags/tagsSlice";

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
      "Set the price for your piece. You can choose to have customers rent it, buy it, or both." +
      " Add tags to your piece."
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

function InputTitle2(props: { setTitle: any }) {
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
function InputDescription2(props: { setDescription: any }) {
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

function DraftTags(props: { placeholder?: boolean }) {
  const { tags } = useSelector(selectTags);
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

function DraftPricingWrapper(props: {
  placeholder?: boolean;
  buyPrice?: any;
  rentalPricing?: any;
}) {
  return (
    <div style={{ minHeight: 40 }}>
      {props.placeholder ? (
        <S.RevealInputStep showBlur={true}>
          <DraftPricing
            buyPrice={{ price: 1000 }}
            rentalPrices={[{ price: 50, duration: 12, period: "Month" }]}
          />
        </S.RevealInputStep>
      ) : (
        <DraftPricing />
      )}
    </div>
  );
}

function PostDraft(props: {
  uploadStep: number;
  postDraft: Partial<PostProps>;
}) {
  const { title } = useSelector(selectTitle);
  const { description } = useSelector(selectDescripton);
  return (
    <PostWrapper
      Image={<PostImages uploadStep={props.uploadStep} />}
      artistName={"Michael Fortunato"}
      Title={
        <i>
          {title !== "" && title !== undefined ? title : "Type your title here"}
        </i>
      }
      Tags={<DraftTags placeholder={true} />}
      Description={
        <S.RevealInputStep>
          <Typography>
            {description !== "" && description !== undefined
              ? description
              : "Type your description here"}
          </Typography>
        </S.RevealInputStep>
      }
      Pricing={<DraftPricingWrapper placeholder />}
    />
  );
}

function ConfigureTitleAndDescription() {
  const dispatch = useDispatch();
  const { typography } = useTheme();
  const { title } = useSelector(selectTitle);
  const { description } = useSelector(selectDescripton);
  return (
    <Grid
      container
      direction="column"
      justifyContent="space-evenly"
      style={{ height: "100%" }}
    >
      <Grid item>
        <InputBase
          value={title}
          multiline
          style={{
            fontSize: typography.h4.fontSize,
            borderBottom: "1px solid #000000"
          }}
          placeholder="Type your title here"
          onChange={e => dispatch(addTitle({ title: e.target.value }))}
        />
      </Grid>
      <Grid item>
        <InputBase
          value={description}
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
          onChange={e =>
            dispatch(addDescription({ description: e.target.value }))
          }
        />
      </Grid>
    </Grid>
  );
}

function ConfigurePricingAndTags() {
  const { price: buyPrice, error: buyError } = useSelector(selectBuyPrice);
  const rentalPrices = useSelector(selectAllRentalPricings);

  const existsValidBuyPrice = buyPrice && buyError === undefined;
  const existsValidRentalPrice = rentalPrices.some(
    rentalPrice => rentalPrice.error === undefined
  );
  const showTags = existsValidBuyPrice || existsValidRentalPrice;
  return (
    <Grid
      container
      direction="column"
      style={{ minHeight: "100%" }}
      spacing={2}
    >
      <Grid item xs>
        <ConfigurePrices />
      </Grid>
      <Grid item xs>
        <S.RevealInputStep showBlur={!showTags} disableInteraction={!showTags}>
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

function ConfigurePost(props: { uploadStep: number }) {
  switch (props.uploadStep) {
    case 0:
      return <ConfigureTitleAndDescription />;
    case 1:
      return <ConfigureImages />;
    case 2:
      return <ConfigurePricingAndTags />;
    default:
      return null;
  }
}

export default function CreatePost() {
  const [uploadStep, setUploadStep] = useState(0);

  // Define the attributes for the post
  const inputContainerRef = useRef<any>(null);

  const { title } = useSelector(selectTitle);
  const { description, error: descriptionError } =
    useSelector(selectDescripton);

  const { images } = useSelector(selectImages);
  const { price: buyPrice, error: buyPriceError } = useSelector(selectBuyPrice);
  const rentalPricings = useSelector(selectAllRentalPricings);

  const isButtonDisabled = (): boolean => {
    switch (uploadStep) {
      case 0:
        return (
          title === undefined ||
          title === "" ||
          description === undefined ||
          description === "" ||
          typeof descriptionError === "string"
        );
      case 1:
        return images.length < 2;
      case 2:
        return (
          buyPriceError !== undefined &&
          (rentalPricings.length === 0 ||
            rentalPricings.every(
              rentalPricing => typeof rentalPricing.error === "string"
            ))
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
            layout={false}
          >
            <AnimateSharedLayout>
              <Grid
                item
                xs="auto"
                component={motion.div}
                key="front"
                layout={false}
              >
                <PostDraft
                  accountName={"Michael Fortunato"}
                  uploadStep={uploadStep}
                />
              </Grid>
              <Grid
                layout={false}
                component={motion.div}
                ref={inputContainerRef}
                item
                xs="auto"
                key="configure"
              >
                <ConfigurePost uploadStep={uploadStep} />
              </Grid>
            </AnimateSharedLayout>
          </Grid>
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