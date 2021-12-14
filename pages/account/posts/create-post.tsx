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
  IconButton
} from "@material-ui/core";
import { Autocomplete } from "@material-ui/lab";
import Image from "next/image";
import {
  useState,
  useRef,
  useEffect,
  useLayoutEffect,
  forwardRef,
  ReactElement,
  ChangeEvent,
  MouseEventHandler
} from "react";
import ArrowForwardIcon from "@material-ui/icons/ArrowForward";
import CheckIcon from "@material-ui/icons/Check";
import {
  AnimatePresence,
  AnimateSharedLayout,
  motion,
  LayoutGroup
} from "framer-motion";
import postPlaceHolderImg from "@public/create_post_placeholder.jpg";
import uploadFile from "@utils/chunked-upload";
import Dropzone from "@components/CreatePost/Dropzone";

import * as S from "@components/CreatePost/Post.styled";
import SimpleListMenu from "@components/SimpleListMenu";
import { Add } from "@material-ui/icons";
import AFBaseFormField from "@components/Library/FormField/BaseFormField";
import { useTheme } from "@material-ui/styles";

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

function isRentalPricing(
  pricing: RentalPricing | BuyPricing
): pricing is RentalPricing {
  return (
    (pricing as RentalPricing).duration !== undefined &&
    (pricing as RentalPricing).period !== undefined
  );
}

function isBuyPricing(
  pricing: RentalPricing | BuyPricing
): pricing is BuyPricing {
  return (
    (pricing as BuyPricing).price !== undefined && !isRentalPricing(pricing)
  );
}

function PurchaseButton(props: PurchaseButtonProps) {
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

interface ConfigureRentlPriceProps {
  setRentalPricing: (rentalPrice: RentalPricing) => void;
}

/*

{
  1 Month
  3 Months
  6 Months
  9 Months
  1 Year
}

*/

type ConfigureRentalPeriod =
  | "1 Month"
  | "3 Months"
  | "6 Months"
  | "9 Months"
  | "1 Year";

const RentalPeriodOptions: ConfigureRentalPeriod[] = [
  "1 Month",
  "3 Months",
  "6 Months",
  "9 Months",
  "1 Year"
];

function ConfigureRentalPrice(props: ConfigureRentlPriceProps) {
  const [rentalPeriod, setRentalPeriod] =
    useState<ConfigureRentalPeriod | null>(null);
  const [rentalPeriodInput, setRentalPeriodInput] = useState<
    string | undefined
  >("");
  const [price, setPrice] = useState<number | undefined>(undefined);
  function addRentalPriceConfig() {
    // We need to split the rentalPeriod "<period> <duration>" to
    // get it to conform to the Pricing Spec
    if (!rentalPeriod || !price) {
      return;
    }
    const [duration, period] = rentalPeriod.split(" ") as [
      string,
      "Month" | "Year"
    ];
    props.setRentalPricing({
      period,
      duration: parseInt(duration, 10),
      price
    });
  }
  return (
    <Grid container spacing={3}>
      <Grid item xs="auto">
        <Autocomplete
          value={rentalPeriod}
          onChange={(event: any, newValue: ConfigureRentalPeriod | null) => {
            setRentalPeriod(newValue);
          }}
          inputValue={rentalPeriodInput}
          onInputChange={(event, newInputValue: string | undefined) => {
            // We can be sure this is correct as its
            // the discrete set of such values
            setRentalPeriodInput(newInputValue);
          }}
          id="controllable-states-demo"
          options={RentalPeriodOptions}
          style={{ width: 200 }}
          renderInput={params => (
            <TextField
              {...params}
              label="Set Rental Period"
              variant="standard"
            />
          )}
        />
      </Grid>
      <Grid item xs="auto">
        <TextField
          label="Set Rental Price"
          variant="standard"
          type="number"
          onChange={e => setPrice(parseInt(e.target.value, 10))}
        />
      </Grid>
      <Grid item xs="auto">
        <IconButton onClick={addRentalPriceConfig}>
          <Add />
        </IconButton>
      </Grid>
    </Grid>
  );
}

interface ConfigureBuyPriceProps {
  setBuyPrice: (buyPrice: BuyPricing) => void;
}
function ConfigureBuyPrice(props: ConfigureBuyPriceProps) {
  const [price, setPrice] = useState<number | undefined>(undefined);
  function addBuyPriceConfig() {
    if (price && price > 0) {
      props.setBuyPrice({ price });
    }
  }
  return (
    <Grid container>
      <Grid item xs="auto">
        <TextField
          label="Set the Price"
          variant="standard"
          type="number"
          onChange={e => setPrice(parseInt(e.target.value, 10))}
        />
      </Grid>
      <Grid item xs="auto">
        <IconButton
          color="primary"
          disabled={
            price === undefined || price <= 0 || typeof price !== "number"
          }
          onClick={addBuyPriceConfig}
        >
          <Add />
        </IconButton>
      </Grid>
    </Grid>
  );
}

type ConfigurePriceType = "Rental" | "Buy";
const PRICING_OPTIONS: ConfigurePriceType[] = ["Rental", "Buy"];

type EnterPricingProps = {
  pricing: Pricing;
  setPricing: any;
};
function EnterPricing(props: EnterPricingProps) {
  const buyPriceSet: boolean = props.pricing.buyPrice !== undefined;
  const numberOfRentalPrices: number = props.pricing.rentalPricing?.length || 0;
  const rentalPricesSet: boolean = numberOfRentalPrices > 1;
  const initial = !buyPriceSet && !rentalPricesSet;
  const optional = !initial && (!buyPriceSet || !rentalPricesSet);

  const [priceOptionNumber, setPriceOptionNumber] = useState<0 | 1 | undefined>(
    undefined
  );
  const [rentalRows, setRentalRows] = useState<number[]>([]);
  const [buyRow, setBuyRow] = useState<boolean>(false);
  function setRentalPricing(rentalPrice: RentalPricing) {
    props.setPricing((oldPricing: Pricing): Pricing => {
      if (oldPricing.rentalPricing?.length) {
        const popOldestElement = oldPricing.rentalPricing.length > 1;
        const startingIndex = popOldestElement ? 1 : 0;
        const newRentalPricing = [
          ...oldPricing.rentalPricing.slice(startingIndex),
          rentalPrice
        ];
        return { ...oldPricing, rentalPricing: newRentalPricing };
      }
      const newRentalPricing = [rentalPrice];
      return { ...oldPricing, rentalPricing: newRentalPricing };
    });
  }
  function setBuyPrice(buyPrice: BuyPricing) {
    props.setPricing(
      (pricing: Pricing): Pricing => ({
        ...pricing,
        buyPrice
      })
    );
  }

  function addPriceOptionRow(priceOption: string) {
    if (priceOption === "Rental") {
      setRentalRows((prevRentalRows: number[]) => {
        const maxKey = prevRentalRows.reduce(
          (prevMax, candidate) => (candidate > prevMax ? candidate : prevMax),
          0
        );
        return [...rentalRows, maxKey + 1];
      });
    }
    if (priceOption === "Buy") {
      setBuyRow(prevBuyRow => {
        if (!prevBuyRow) return true;
        return prevBuyRow;
      });
    }
  }

  return (
    <Grid container direction="column" spacing={3}>
      <Grid item xs="auto">
        <SimpleListMenu
          buttonLabel="Add Price"
          menuItems={{
            Rental: rentalRows.length < 2,
            Buy: buyRow
          }}
          handleMenuItemClick={addPriceOptionRow}
        />
      </Grid>
      <Grid
        layout
        container
        direction="column"
        component={motion.div}
        item
        spacing={3}
        xs="auto"
      >
        {rentalRows.map((index: number) => (
          <Grid key={index} item xs="auto">
            <ConfigureRentalPrice
              key={index}
              setRentalPricing={setRentalPricing}
            />
          </Grid>
        ))}
        {buyRow && (
          <Grid key="BuyRow" item xs="auto">
            <ConfigureBuyPrice setBuyPrice={setBuyPrice} />
          </Grid>
        )}
      </Grid>
    </Grid>
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
      <Grid item xs="auto">
        <EnterPricing pricing={pricing} setPricing={setPricing} />
      </Grid>
    </S.RevealInputStep>
  );
}

function ConfigurablePriceButton() {
  const theme: any = useTheme();
  return (
    <div
      style={{
        backgroundColor: theme.palette.primary.main
      }}
    >
      Said I made it
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
    setPricing: any;
  };
}) {
  const { images, pricing } = props.post;
  const { setTitle, setDescription, setImages, setPricing } = props.setPost;
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
        <S.InputContainer style={{ borderBottomStyle: "none" }}>
          <ConfigurablePriceButton />
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
  const [pricing, setPricing] = useState<Pricing>({
    rentalPricing: undefined,
    buyPrice: undefined
  });
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
                  post={{ title, description, images, pricing }}
                  setPost={{
                    setTitle,
                    setDescription,
                    setImages,
                    setPricing
                  }}
                />
              </Grid>
              <Grid
                layout
                component={motion.div}
                ref={inputContainerRef}
                item
                xs="auto"
                key="input"
              >
                <EnterPricing pricing={pricing} setPricing={setPricing} />
              </Grid>
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
