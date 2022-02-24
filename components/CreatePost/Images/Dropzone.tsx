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

function EmptyDropzone() {
  return (
    <Grid
      container
      justifyContent="center"
      style={{ height: "100%" }}
      direction="row"
      alignItems="center"
    >
      <Grid
        container
        item
        xs="auto"
        justifyContent="center"
        style={{ fontSize: "4rem" }}
      >
        <Grid item xs="auto">
          <SystemUpdateAltOutlinedIcon fontSize="inherit" />
        </Grid>
        <Typography variant={"h6"}>Drag and drop your files here</Typography>
      </Grid>
      <Grid item xs="auto">
        <Button variant="outlined">Browse</Button>
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
      showDashedBorder={props.items.length === 0}
      {...getRootProps({ isDragActive, isDragAccept, isDragReject })}
    >
      {props.items.length === 0 && <EmptyDropzone />}
      {props.items.length !== 0 && props.PopulatedDropzone}
      <input {...getInputProps()} />
    </S.DropzoneContainer>
  );
}
