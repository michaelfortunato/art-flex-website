import styled from "styled-components";
import { motion } from "framer-motion";

function getBorderColorOnDrop(
  isDragAccept: boolean,
  isDragReject: boolean,
  isDragActive: boolean
) {
  if (isDragAccept) {
    return "#00e676";
  }
  if (isDragReject) {
    return "#ff1744";
  }
  if (isDragActive) {
    return "#2196f3";
  }
  return "#eeeeee";
}

export const DropzoneContainer = styled(motion.div)<any>`
  border-style: dashed;
  border-width: 2px;
  border-color: ${({ isDragAccept, isDragReject, isDragActive }) =>
    getBorderColorOnDrop(isDragAccept, isDragReject, isDragActive)};
  outline: none;
  height: 100%;
  position: relative;
`;

export const OverlayContainer = styled(motion.div)`
  top: 0;
  left: 0;
  position: absolute;
  height: 100%;
  width: 100%;
  color: #ffffff;
  opacity: 0;
`;

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