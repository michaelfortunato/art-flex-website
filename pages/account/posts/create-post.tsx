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
  Popper,
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
import SystemUpdateAltOutlinedIcon from "@material-ui/icons/SystemUpdateAltOutlined";
import { useDropzone } from "react-dropzone";
import AppsIcon from "@material-ui/icons/Apps";
import ArrowForwardIosIcon from "@material-ui/icons/ArrowForwardIos";
import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { v4 as uuidv4 } from "uuid";
import uploadFile from "@utils/chunked-upload";

/*
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
        outline: "none"
      }}
      value={value}
      onChange={event => setValue(event.target.value)}
    />
  );
};
*/

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

// eslint-disable-next-line react/display-name
const DragAndDropMenu = forwardRef((props, containerRef) => {
  const onDragEnd = result => {
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
              ref={ref => setRef(ref, provided)}
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

const OverlayContainer = styled(motion.div)`
  top: 0;
  left: 0;
  position: absolute;
  height: 100%;
  width: 100%;
  color: #ffffff;
  opacity: 0;
`;

const Overlay = props => {
  const menuRef = useRef(null);
  const menuButtonRef = useRef(null);
  return (
    <OverlayContainer
      animate={
        props.showOverlay || props.menuOpen
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
              {props.selectedImage + 1}/{props.items.length}
            </Typography>
          </Grid>
          <Grid item xs="auto">
            <span
              style={{ fontSize: "3rem", cursor: "pointer" }}
              onClick={e => {
                e.stopPropagation();
                props.setMenuOpen(menuOpen => !menuOpen);
              }}
            >
              <AppsIcon ref={menuButtonRef} fontSize="inherit" />
            </span>
          </Grid>
        </Grid>
        <Grid item xs="auto" container direction="row" justifyContent="center">
          <Grid item xs="auto">
            <span
              style={{
                marginRight: 30,
                fontSize: "3rem",
                cursor: "pointer"
              }}
              onClick={e => {
                e.stopPropagation();
                props.setItemNumber(itemNumber =>
                  itemNumber > 0 ? itemNumber - 1 : itemNumber
                );
              }}
            >
              <ArrowBackIosIcon fontSize="inherit" />
            </span>
            <span
              style={{
                marginLeft: 30,
                fontSize: "3rem",
                cursor: "pointer"
              }}
              onClick={e => {
                e.stopPropagation();
                props.setItemNumber(itemNumber =>
                  itemNumber < props.items.length - 1
                    ? itemNumber + 1
                    : itemNumber
                );
              }}
            >
              <ArrowForwardIosIcon fontSize="inherit" />
            </span>
          </Grid>
        </Grid>
      </Grid>
      <Popper
        open={menuButtonRef.current !== null && props.menuOpen}
        anchorEl={menuButtonRef.current}
        placement={"right"}
      >
        <ClickAwayListener onClickAway={() => props.setMenuOpen(false)}>
          <DragAndDropMenu
            items={props.items}
            setItems={props.setItems}
            ref={menuRef}
          />
        </ClickAwayListener>
      </Popper>
    </OverlayContainer>
  );
};

const getBorderColorOnDrop = props => {
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
  border-color: ${props => getBorderColorOnDrop(props)};
  outline: none;
  height: 100%;
  position: relative;
`;

function Dropzone(props: { images: any[]; setImages: any }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [delayOverlay, setDelayOverlay] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);
  const [showOverlay, setShowOverlay] = useState(false);

  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragAccept,
    isDragReject
  } = useDropzone({
    noClick: menuOpen,
    accept: "image/*",
    onDrop: acceptedFiles => {
      const additionalImages = acceptedFiles.map(file =>
        Object.assign(file, {
          preview: URL.createObjectURL(file)
        })
      ) as File[];
      setDelayOverlay(true);
      props.setImages((images: File[]) =>
        additionalImages.concat(images).slice(0, MAX_IMAGES)
      );
    }
  });

  useEffect(() => {
    setTimeout(() => setDelayOverlay(false), 500);
  }, [delayOverlay]);

  return (
    <DropzoneContainer
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
              <div style={{ paddingTop: 20, paddingBottom: 20 }}></div>
              <div
                style={{
                  textAlign: "center",
                  paddingBottom: 40
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
            alt=""
            objectFit="contain"
            layout="fill"
          />
        </div>
      )}
      <input {...getInputProps()} />
      <Overlay
        showOverlay={showOverlay && !delayOverlay && props.images.length > 0}
        items={props.images}
        setItems={props.setImages}
        selectedImage={selectedImage}
        setItemNumber={setSelectedImage}
        menuOpen={menuOpen}
        setMenuOpen={setMenuOpen}
      />
    </DropzoneContainer>
  );
}

const Container = styled.div`
  margin-left: auto;
  margin-right: auto;
  max-width: 1870px;
`;

/*
const useChunkedUpload = () => {
  const [isError, setIsError] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [numCompletedChunks, setNumCompletedChunks] = useState(0);
  const [chunkedFileObject, setChunkedFileObject] = useState(null);

  const progress =
    chunkedFileObject === null
      ? 0
      : numCompletedChunks / chunkedFileObject.numChunks;
  const isLoading = chunkedFileObject !== null;

  const upload = async (url, file) => {
    if (isComplete || isLoading) return;
    const chunkedFile = new ChunkedFile(uuidv4(), file);
    setChunkedFileObject(chunkedFile);
  };

  useEffect(async () => {
    if (chunkedFileObject === null) return;
    try {
      const promises = await chunkedFileObject.uploadFile();
      promises.forEach(promise => {
        promise
          .then(response => {
            if (response.status === 200) {
              setIsComplete(true);
              setNumCompletedChunks(chunkedFileObject.numChunks);
            } else {
              setNumCompletedChunks(
                numCompletedChunks => numCompletedChunks + 1
              );
            }
          })
          .catch(error => {
            setIsError(true);
          });
      });
    } catch (error) {
      setIsError(true);
    }
  }, [chunkedFileObject]);

  useEffect(() => {
    if (
      chunkedFileObject &&
      numCompletedChunks === chunkedFileObject.numChunks &&
      isComplete === false
    ) {
      setIsError(true);
    }
  }, [numCompletedChunks]);

  return [upload, isComplete, isLoading, isError, progress];
};
*/
function UploadStatus() {}

interface PostImage extends File {
  preview: string;
}

interface PostInterface {
  title: string | undefined;
  description: string | undefined;
  images: PostImage[];
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
            maxHeight: 100,
            overflowY: "auto",
            marginTop: 20,
            borderStyle: "solid"
          }}
        >
          <InputBase
            fullWidth
            style={{
              fontSize: "1rem",
              overflowY: "auto",
              minHeight: 40,
              fontStyle: "italic"
            }}
            autoComplete="title"
            autoFocus={true}
            placeholder={"Type your description here"}
            onChange={e => setDescription(e.target.value)}
          ></InputBase>
        </div>
        <ClickAwayListener onClickAway={() => setIsTitleFocused(false)}>
          <div style={{ marginTop: 20, borderStyle: "solid" }}>
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
        </ClickAwayListener>
      </div>
    </Paper>
  );
}
/*
          <Grid
            container
            item
            xs
            justifyContent="space-around"
            alignItems="center"
          >
            <AnimatedGrid key="front" item xs="auto" layout>
              <Post accountName={"Michael Fortunato"} uploadStep={uploadStep} />
            </AnimatedGrid>
            {uploadStep === 2 && (
              <AnimatedGrid
                key="rental"
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
            {uploadStep === 3 && (
              <AnimatedGrid
                key="back"
                layout
                item
                xs="auto"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                style={{ maxWidth: 900 }}
              >
                <Paper>
                  {images.map(({ preview }) => (
                    <div
                      style={{
                        display: "inline-block",
                        position: "relative",
                        padding: 20,
                        height: 200,
                        width: 200
                      }}
                    >
                      <Image src={preview} objectFit="contain" layout="fill" />
                    </div>
                  ))}
                </Paper>
              </AnimatedGrid>
            )}
          </Grid>

                {uploadStep === 0 && (
        <motion.div animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <Popper
            key={1}
            open={anchorRef_title.current !== null}
            anchorEl={anchorRef_title.current}
            placement="left"
          >
            <div style={{ paddingRight: 10 }}>
              {post.title !== "" ? <CheckIcon /> : <ArrowForwardIcon />}
            </div>
          </Popper>
          <Popper
            key={2}
            open={post.title !== "" && anchorRef_title.current !== null}
            anchorEl={anchorRef_description.current}
            placement="left"
          >
            <div style={{ paddingRight: 10 }}>
              {post.description !== "" ? <CheckIcon /> : <ArrowForwardIcon />}
            </div>
          </Popper>
        </motion.div>
*/

export default function CreatePost() {
  const [uploadStep, setUploadStep] = useState(0);

  // Define the attributes for the post
  const [title, setTitle] = useState<undefined | string>(undefined);
  const [description, setDescription] = useState<undefined | string>(undefined);
  const [images, setImages] = useState<File[]>([]);

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

CreatePost.getLayout = function getLayout(page: ReactElement) {
  return (
    <Container key={1}>
      <Appbar key={1} />
      {page}
    </Container>
  );
};
