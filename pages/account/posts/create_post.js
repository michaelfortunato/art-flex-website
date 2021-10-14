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
  capitalize,
  Popper,
  ClickAwayListener,
} from "@material-ui/core";
import Image from "next/image";
import {
  useState,
  useRef,
  useEffect,
  useLayoutEffect,
  forwardRef,
} from "react";
import { createPortal } from "react-dom";
import ArrowForwardIcon from "@material-ui/icons/ArrowForward";
import CheckIcon from "@material-ui/icons/Check";
import { AnimatePresence, AnimateSharedLayout, motion } from "framer-motion";
import postPlaceHolderImg from "@public/create_post_placeholder.jpg";
import SystemUpdateAltOutlinedIcon from "@material-ui/icons/SystemUpdateAltOutlined";
import { SocialBanner } from "@components/SignIn/SignUp";
import { useDropzone } from "react-dropzone";
import AppsIcon from "@material-ui/icons/Apps";
import ArrowForwardIosIcon from "@material-ui/icons/ArrowForwardIos";
import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

const Container = styled.div`
  margin-left: auto;
  margin-right: auto;
  max-width: 1870px;
`;
const MAX_IMAGES = 5;
const steps = [
  {
    step_title: "Name and description",
    step_content: "Please enter the title of your piece and give a description",
  },
  {
    step_title: "Upload photos",
    step_content: `Please upload 2-${MAX_IMAGES} photos of your piece`,
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

const BlurredImage = styled(Image)`
  filter: blur(40px);
`;

const chunked_upload = async () => {};

const getBorderColorOnDrop = (props) => {
  if (props.isDragAccept) {
    return "#00e676";
  }
  if (props.isDragReject) {
    return "#ff1744";
  }
  if (props.isDragActive) {
    return "#2196f3";
  }
  return "#eeeeee";
};

const DropzoneContainer = styled(motion.div)`
  border-style: dashed;
  border-width: 2px;
  border-color: ${(props) => getBorderColorOnDrop(props)};
  outline: none;
  height: 100%;
  position: relative;
`;
const Overlay = styled(motion.div)`
  top: 0;
  left: 0;
  position: absolute;
  height: 100%;
  width: 100%;
  color: #ffffff;
  opacity: 0;
`;

const DragAndDropMenuContainer = styled.div`
  color: #ffffff;
  background-color: rgb(18, 18, 18);
`;

const DragAndDropItemContainer = styled.div`
  padding: 20px;
`;

const reorder = (sourceIndex, destinationIndex, items) => {
  /* 
    if source > dest
    all elements in indices [source-1, dest] must be shifted down one
    if dest > source
    all elements in indices [source+1, dest] must be shifted up one
  */
  const sortCase = sourceIndex > destinationIndex ? 0 : 1;
  const reorderedItems = items.reduce((newItems, item, index) => {
    if (sortCase === 0) {
      if (index === destinationIndex) {
        newItems.push(items[sourceIndex]);
      } else if (destinationIndex < index && index <= sourceIndex) {
        newItems.push(items[index - 1]);
      } else {
        newItems.push(item);
      }
    }
    if (sortCase === 1) {
      if (index === destinationIndex) {
        newItems.push(items[sourceIndex]);
      } else if (sourceIndex <= index && index < destinationIndex) {
        newItems.push(items[index + 1]);
      } else {
        newItems.push(item);
      }
    }
    return newItems;
  }, []);

  return reorderedItems;
};

console.log(reorder(3, 0, ["a", "b", "c", "d"]));

const DragAndDropMenu = forwardRef((props, containerRef) => {
  const onDragEnd = (result) => {
    if (!result.destination) {
      return;
    }
    const items = reorder(
      result.source.index,
      result.destination.index,
      props.items
    );
    props.setItems(items);
  };
  const setRef = (ref, provided) => {
    containerRef(ref);
    provided.innerRef(ref);
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="droppable">
        {(provided, snapshot) => {
          provided.innerRef(containerRef.current);
          return (
            <DragAndDropMenuContainer
              {...provided.droppableProps}
              ref={(ref) => setRef(ref, provided)}
              isDraggingOver={snapshot.isDraggingOver}
            >
              {props.items.map((item, index) => (
                <Draggable
                  key={index}
                  draggableId={`item-${index}`}
                  index={index}
                >
                  {(provided, snapshot) => (
                    <DragAndDropItemContainer
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      style={{ ...provided.draggableProps.style }}
                    >
                      {item.name}
                    </DragAndDropItemContainer>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </DragAndDropMenuContainer>
          );
        }}
      </Droppable>
    </DragDropContext>
  );
});

const StyledDropzone = (props) => {
  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragAccept,
    isDragReject,
  } = useDropzone({
    accept: "image/*",
    onDrop: (acceptedFiles) => {
      const additionalImages = acceptedFiles.map((file) =>
        Object.assign(file, {
          preview: URL.createObjectURL(file),
        })
      );
      setDelayOverlay(true);
      props.setImages((images) =>
        additionalImages.concat(images).slice(0, MAX_IMAGES)
      );
    },
  });
  const [delayOverlay, setDelayOverlay] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);
  const [showOverlay, setShowOverlay] = useState(false);
  const imageMenuRef = useRef(null);
  const [imageMenuOpen, setImageMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const [isOverMenu, setIsOverMenu] = useState(false);

  const isOverMenuTrue = () => {
    setIsOverMenu(true);
  };
  const isOverMenuFalse = () => {
    setIsOverMenu(false);
  };
  const disableClick = (e) => {
    e.stopPropagation();
  };

  const closeImageMenu = () => {
    setImageMenuOpen(false);
    if (menuRef.current !== null) {
      menuRef.current.removeEventListener("mouseover", isOverMenuTrue);
      menuRef.current.addEventListener("mouseout", isOverMenuFalse);
      menuRef.current.addEventListener("click", disableClick);
      menuRef.current.addEventListener("mousedown", disableClick);
    }
  };
  useEffect(() => {
    if (menuRef.current !== null) {
      menuRef.current.addEventListener("mouseover", isOverMenuTrue);
      menuRef.current.addEventListener("mouseout", isOverMenuFalse);
      menuRef.current.addEventListener("click", disableClick);
    }
  }, [menuRef.current]);

  useEffect(() => {
    setTimeout(() => setDelayOverlay(false), 500);
  }, [delayOverlay]);

  return (
    <DropzoneContainer
      key={1}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      {...getRootProps({ isDragActive, isDragAccept, isDragReject })}
      onMouseLeave={() => setShowOverlay(false)}
      onMouseEnter={() => setShowOverlay(true)}
    >
      {props.images.length === 0 && (
        <Grid
          container
          justifyContent="center"
          alignItems="center"
          style={{ height: "100%" }}
          direction="row"
        >
          <Grid item xs="auto" style={{ paddingTop: 50 }}>
            <div>
              <div style={{ textAlign: "center", fontSize: "6rem" }}>
                <SystemUpdateAltOutlinedIcon fontSize="inherit" />
              </div>
              <div style={{ paddingTop: 5 }}>
                <Typography variant={"h5"}>
                  Drag and drop your files here
                </Typography>
              </div>
              <div style={{ paddingTop: 20, paddingBottom: 20 }}>
                <SocialBanner />
              </div>
              <div
                style={{
                  textAlign: "center",
                  paddingBottom: 40,
                }}
              >
                <Button variant="outlined">Browse</Button>
              </div>
            </div>
          </Grid>
        </Grid>
      )}
      {props.images.length !== 0 && (
        <div style={{ position: "relative", padding: 20, height: "100%" }}>
          <Image
            src={props.images[selectedImage].preview}
            objectFit="contain"
            layout="fill"
          />
        </div>
      )}
      <input {...getInputProps()} />
      <Overlay
        animate={
          !delayOverlay && showOverlay && !isOverMenu && props.images.length > 0
            ? { opacity: 1, backgroundColor: "rgba(0, 0, 0, 0.5)" }
            : { opacity: 0, backgroundColor: "rgba(0,0,0,0)" }
        }
      >
        <Grid
          container
          style={{ height: "100%" }}
          direction="column"
          justifyContent="space-between"
        >
          <Grid item xs="auto" container justifyContent="space-between">
            <Grid item xs="auto">
              <Typography style={{ fontSize: "2rem" }}>
                {selectedImage + 1}/{props.images.length}
              </Typography>
            </Grid>
            <Grid item xs="auto">
              <span
                style={{ fontSize: "3rem", cursor: "pointer" }}
                onClick={(e) => {
                  e.stopPropagation();
                  setImageMenuOpen(true);
                }}
              >
                <AppsIcon ref={imageMenuRef} fontSize="inherit" />
              </span>
            </Grid>
          </Grid>
          <Grid
            item
            xs="auto"
            container
            direction="row"
            justifyContent="center"
          >
            <Grid item xs="auto">
              <span
                style={{ marginRight: 30, fontSize: "3rem", cursor: "pointer" }}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedImage((selectedImage) =>
                    selectedImage > 0 ? selectedImage - 1 : selectedImage
                  );
                }}
              >
                <ArrowBackIosIcon fontSize="inherit" />
              </span>
              <span
                style={{ marginLeft: 30, fontSize: "3rem", cursor: "pointer" }}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedImage((selectedImage) =>
                    selectedImage < props.images.length - 1
                      ? selectedImage + 1
                      : selectedImage
                  );
                }}
              >
                <ArrowForwardIosIcon fontSize="inherit" />
              </span>
            </Grid>
          </Grid>
        </Grid>
        <Popper
          open={imageMenuRef.current !== null && imageMenuOpen}
          anchorEl={imageMenuRef.current}
          placement={"right"}
        >
          <ClickAwayListener onClickAway={closeImageMenu}>
            <DragAndDropMenu
              items={props.images}
              setItems={props.setImages}
              ref={menuRef}
            />
          </ClickAwayListener>
        </Popper>
      </Overlay>
    </DropzoneContainer>
  );
};

const AnimatedGrid = motion(Grid);
export default function CreatePost() {
  const [activeStep, setActiveStep] = useState(0);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [images, setImages] = useState([]);

  const anchorRef_canvas = useRef(null);
  const anchorRef_title = useRef(null);
  const anchorRef_description = useRef(null);
  const [isTitleFocused, setIsTitleFocused] = useState(false);

  const disabled = [title === "" || description === "", false, false];
  const handleNext = () => {
    if (activeStep < steps.length - 1) {
      setActiveStep(activeStep + 1);
    }
  };
  const handlePrevious = () => {
    setActiveStep(activeStep - 1);
  };

  console.log(images);
  return (
    <>
      <Grid style={{ height: "100%" }} container direction="column" spacing={8}>
        <AnimateSharedLayout>
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
        <Grid
          container
          item
          xs
          justifyContent="space-around"
          alignItems="center"
        >
          <AnimatedGrid item xs="auto" layout>
            <Paper
              ref={anchorRef_canvas}
              elevation={3}
              style={{ padding: 60, borderRadius: 10, display: "inline-block" }}
            >
              <div>
                <motion.div
                  style={{
                    display: "inline-block",
                    height: 440,
                    width: 400,
                    marginBottom: 20,
                  }}
                >
                  <AnimatePresence exitBeforeEnter>
                    {activeStep === 0 && (
                      <motion.div
                        key={0}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        style={{
                          borderStyle: "solid",
                          borderColor: "#OOOOOO",
                          filter: "blur(.5rem)",
                        }}
                      >
                        <Image src={postPlaceHolderImg} placeholder="blur" />
                      </motion.div>
                    )}
                    {activeStep === 1 && (
                      <StyledDropzone images={images} setImages={setImages} />
                    )}
                    {activeStep === 2 && (
                      <motion.div
                        key={2}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        style={{ filter: "blur(.5rem)" }}
                      >
                        <Image src={postPlaceHolderImg} placeholder="blur" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
                <Divider
                  style={{ height: 1, marginBottom: 20, marginTop: 10 }}
                />
                <div>
                  <Typography variant="h5">Michael Fortunato</Typography>
                </div>
                <div
                  ref={anchorRef_description}
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
                    onChange={(e) => setDescription(e.target.value)}
                  ></InputBase>
                </div>
                <ClickAwayListener onClickAway={() => setIsTitleFocused(false)}>
                  <div
                    ref={anchorRef_title}
                    style={{ marginTop: 20, borderStyle: "solid" }}
                  >
                    <InputBase
                      style={{ minHeight: 40, fontStyle: "italic" }}
                      autoComplete="title"
                      autoFocus={true}
                      placeholder={"Type your title here"}
                      value={title}
                      onChange={(e) =>
                        setTitle(
                          e.target.value
                            .toLowerCase()
                            .split(" ")
                            .map(
                              (s) => s.charAt(0).toUpperCase() + s.substring(1)
                            )
                            .join(" ")
                        )
                      }
                    ></InputBase>
                  </div>
                </ClickAwayListener>
              </div>
            </Paper>
          </AnimatedGrid>
          {activeStep === 2 && (
            <AnimatedGrid
              layout
              item
              xs="auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <Paper>
                <Typography> Set your rental</Typography>
              </Paper>
            </AnimatedGrid>
          )}
        </Grid>
        <AnimatedGrid
          layout
          container
          item
          xs="auto"
          justifyContent="center"
          direction="row"
          spacing={5}
        >
          <Grid item xs="auto">
            <Button disabled={activeStep === 0} onClick={handlePrevious}>
              Back
            </Button>
          </Grid>
          <Grid item xs="auto">
            <Button
              disabled={disabled[activeStep]}
              variant="contained"
              color="primary"
              onClick={handleNext}
            >
              Next
            </Button>
          </Grid>
        </AnimatedGrid>
        </AnimateSharedLayout>
      </Grid>
      {activeStep === 0 && (
        <motion.div animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <Popper
            open={true}
            anchorEl={anchorRef_title.current}
            placement="left"
          >
            <div style={{ paddingRight: 10 }}>
              {title !== "" ? <CheckIcon /> : <ArrowForwardIcon />}
            </div>
          </Popper>
          <Popper
            open={title !== ""}
            anchorEl={anchorRef_description.current}
            placement="left"
          >
            <div style={{ paddingRight: 10 }}>
              {description !== "" ? <CheckIcon /> : <ArrowForwardIcon />}
            </div>
          </Popper>
        </motion.div>
      )}
    </>
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
