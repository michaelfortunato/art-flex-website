import styled from "styled-components";
import { Button, Grid, Typography } from "@material-ui/core";
import Image from "next/image";
import { forwardRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import SystemUpdateAltOutlinedIcon from "@material-ui/icons/SystemUpdateAltOutlined";
import { useDropzone } from "react-dropzone";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

import * as S from "./Dropzone.styled";
import { addImage, selectImages } from "./imagesSlice";

const MAX_IMAGES = 5;

const DragAndDropMenuContainer = styled.div`
  color: #ffffff;
  background-color: rgb(18, 18, 18);
`;

const DragAndDropItemContainer = styled.div`
  padding: 20px;
`;

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
          <div style={{ textAlign: "center", fontSize: "1rem" }}>
            <SystemUpdateAltOutlinedIcon fontSize="inherit" />
          </div>
          <div style={{ paddingTop: 5 }}>
            <Typography variant={"h5"}>
              Drag and drop your files here
            </Typography>
          </div>
          <div style={{ paddingTop: 10, paddingBottom: 10 }}></div>
          <div
            style={{
              textAlign: "center",
              paddingBottom: 20
            }}
          >
            <Button variant="outlined">Browse</Button>
          </div>
        </div>
      </Grid>
    </Grid>
  );
}

export default function Dropzone(props: {
  items: any[];
  setItems: any;
  PopulatedDropzone: React.ReactNode;
}) {
  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragAccept,
    isDragReject
  } = useDropzone({
    accept: "image/*",
    onDrop: props.setItems
  });

  return (
    <S.DropzoneContainer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      {...getRootProps({ isDragActive, isDragAccept, isDragReject })}
    >
      {props.items.length === 0 && <EmptyDropzone />}
      {props.items.length !== 0 && props.PopulatedDropzone}
      <input {...getInputProps()} />
    </S.DropzoneContainer>
  );
}
