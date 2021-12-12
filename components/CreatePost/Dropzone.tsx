import styled from "styled-components";
import {
  Button,
  Grid,
  Typography,
  Popper,
  ClickAwayListener
} from "@material-ui/core";
import Image from "next/image";
import { useState, useRef, useEffect, forwardRef } from "react";
import SystemUpdateAltOutlinedIcon from "@material-ui/icons/SystemUpdateAltOutlined";
import { useDropzone } from "react-dropzone";
import AppsIcon from "@material-ui/icons/Apps";
import ArrowForwardIosIcon from "@material-ui/icons/ArrowForwardIos";
import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

import * as S from "./Dropzone.styled";

const MAX_IMAGES = 5;

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
const DragAndDropMenu = forwardRef<any, any>((props, containerRef) => {
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

function Overlay(props: {
  showOverlay: boolean;
  images: PostImage[];
  setImages: any;
  selectedImage: number;
  setSelectedImage: any;
  menuOpen: boolean;
  setMenuOpen: any;
}) {
  const menuRef = useRef(null);
  const menuButtonRef = useRef(null);
  return (
    <S.OverlayContainer
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
                props.setSelectedImage((selectedImage: number) =>
                  selectedImage > 0 ? selectedImage - 1 : selectedImage
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
                props.setSelectedImage((selectedImage: number) =>
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
        open={menuButtonRef.current !== null && props.menuOpen}
        anchorEl={menuButtonRef.current}
        placement={"right"}
      >
        <ClickAwayListener onClickAway={() => props.setMenuOpen(false)}>
          <DragAndDropMenu
            items={props.images}
            setItems={props.setImages}
            ref={menuRef}
          />
        </ClickAwayListener>
      </Popper>
    </S.OverlayContainer>
  );
}

interface PostImage extends File {
  preview: string;
}

function EmptyDropzone() {
  return (
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
  );
}

function PopulatedDropzone(props: { previewUrl: string }) {
  return (
    <div style={{ position: "relative", padding: 20, height: "100%" }}>
      <Image src={props.previewUrl} alt="" objectFit="contain" layout="fill" />
    </div>
  );
}

function onDrop(
  acceptedFiles: any[],
  images: PostImage[],
  setImages: any,
  setDelayOverlay: any
) {
  const additionalImages = acceptedFiles.map((file: any) =>
    Object.assign(file, {
      preview: URL.createObjectURL(file)
    })
  ) as File[];
  setDelayOverlay(true);
  setImages(additionalImages.concat(images).slice(0, MAX_IMAGES));
}

export default function Dropzone(props: {
  images: PostImage[];
  setImages: any;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [delayOverlay, setDelayOverlay] = useState(false);
  const [selectedImage, setSelectedImage] = useState<number>(0);

  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragAccept,
    isDragReject
  } = useDropzone({
    noClick: menuOpen,
    accept: "image/*",
    onDrop: acceptedFiles =>
      onDrop(acceptedFiles, props.images, props.setImages, setDelayOverlay)
  });

  useEffect(() => {
    setTimeout(() => setDelayOverlay(false), 500);
  }, [delayOverlay]);

  return (
    <S.DropzoneContainer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      {...getRootProps({ isDragActive, isDragAccept, isDragReject })}
      onMouseLeave={() => setShowOverlay(false)}
      onMouseEnter={() => setShowOverlay(true)}
    >
      {props.images.length === 0 && <EmptyDropzone />}
      {props.images.length !== 0 && (
        <PopulatedDropzone previewUrl={props.images[selectedImage].preview} />
      )}
      <input {...getInputProps()} />
    </S.DropzoneContainer>
  );
}
