import React from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import PostPlaceHolderImg from "@public/create_post_placeholder.jpg";
import { useDispatch, useSelector } from "react-redux";
import { ClickAwayListener, Grid } from "@material-ui/core";
import Dropzone from "./Dropzone";
import {
  addImage,
  getSelectedImageIndex,
  removeImage,
  reorderImages,
  selectImages,
  setSelectedImage
} from "./imagesSlice";
import { MAX_IMAGES } from "../Post";
import DraggableMenu from "./DraggableMenu";

export function ConfigureImages() {
  const dispatch = useDispatch();
  const { images, selectedImage } = useSelector(selectImages);
  return images.length !== 0 ? (
    <Grid container style={{ height: "100%" }} alignItems="center">
      <Grid item>
        <DraggableMenu
          items={images.map(({ name }) => name)}
          onReorder={(source: number, destination: number) =>
            dispatch(
              reorderImages({
                sourceIndex: source,
                destinationIndex: destination
              })
            )
          }
          selectedItem={selectedImage}
          setSelectedItem={(newSelectedImage: string | undefined) =>
            dispatch(setSelectedImage({ selectedImage: newSelectedImage }))
          }
          onRemove={(imageIndex: number) =>
            dispatch(removeImage({ index: imageIndex }))
          }
          containerProps={{
            item: true,
            xs: 11,
            direction: "column",
            spacing: 3
          }}
          itemProps={{
            marginTop: 20 // Watch out for margin collapse (do not add marginbottom)
          }}
        />
      </Grid>
    </Grid>
  ) : null;
}

export function Images(props: { uploadStep: number }) {
  const { images } = useSelector(selectImages);
  const selectedImageIndex = useSelector(getSelectedImageIndex);
  const dispatch = useDispatch();
  function setImages(acceptedFiles: any[]) {
    const additionalImages = acceptedFiles.map((file: any) => ({
      name: file.name,
      preview: URL.createObjectURL(file)
    }));
    additionalImages
      .slice(0, MAX_IMAGES)
      .forEach((image: any) => dispatch(addImage(image)));
  }
  return (
    <AnimatePresence exitBeforeEnter>
      {props.uploadStep === 0 ? (
        <motion.div
          key={0}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={{
            filter: "blur(.5rem)",
            position: "relative"
          }}
        >
          <Image src={PostPlaceHolderImg} alt="" width={400} height={400} />
        </motion.div>
      ) : (
        <Dropzone
          items={images}
          setItems={setImages}
          PopulatedDropzone={
            <div
              style={{
                position: "relative"
              }}
            >
              {images.length !== 0 && (
                <Image
                  src={images[selectedImageIndex || 0].preview}
                  alt=""
                  width={400}
                  height={400}
                />
              )}
            </div>
          }
        />
      )}
    </AnimatePresence>
  );
}
