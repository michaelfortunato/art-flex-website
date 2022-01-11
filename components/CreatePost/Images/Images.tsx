import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import PostPlaceHolderImg from "@public/create_post_placeholder.jpg";
import { useDispatch, useSelector } from "react-redux";
import Dropzone from "./Dropzone";
import { addImage, reorderImages, selectImages } from "./imagesSlice";
import { MAX_IMAGES } from "../Post";
import DraggableMenu from "./DraggableMenu";

export function ConfigureImages() {
  const dispatch = useDispatch();
  const { images } = useSelector(selectImages);
  return images.length !== 0 ? (
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
    />
  ) : null;
}

export function Images(props: { uploadStep: number }) {
  const { images } = useSelector(selectImages);
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
  const selectedImage = 0;
  return (
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
          <Image src={PostPlaceHolderImg} alt="" placeholder="blur" />
        </motion.div>
      ) : (
        <Dropzone
          items={images}
          setItems={setImages}
          PopulatedDropzone={
            <div style={{ position: "relative", padding: 20, height: "100%" }}>
              {images.length !== 0 && (
                <Image
                  src={images[selectedImage].preview}
                  alt=""
                  objectFit="contain"
                  layout="fill"
                />
              )}
            </div>
          }
        />
      )}
    </AnimatePresence>
  );
}
