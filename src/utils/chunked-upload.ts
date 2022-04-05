import bytes from "bytes";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";

type UploadUrlsType = Record<number, string>;
type ProgressCb = () => void;
const CHUNK_SIZE = bytes("5MB");

// TODO: More thought needs to be put into the progressCb. Is this safe to do?
// I think so because you cannot trust the client, so the only security we
// have to do is in on our servers. For example, even if I removed the Cb
// a malicious user to edit my front end code and execute it however it wants
// to. The key is that my routes are on accessible via a valid AT
// If a malicious actor gets that then we are fucked for 15 minutes until it
// expires. If a malicious actor get a RT, we would remove the RT in the DB,
// which would reduce the ammt of time for an attack but would still leave 15
// minutes in (or whatever I end up deciding what the AT's expiriation is).

/**
 * This method returns
 * @param filename
 * @param accountEmail
 */
function generateFileKey(filename: string, accountEmail: string): string {
  return `${accountEmail}/${filename}-${uuidv4()}`;
}

/**
 * Method starts the upload process with AWS by calling the backend server.
 *
 * @returns
 */
async function createUpload(
  imageKey: string,
  isDraft: boolean
): Promise<string> {
  const { data } = await axios.post("/account/upload-image/create-upload", {
    imageKey,
    isDraft
  });
  return data.uploadId;
}

async function generateUploadUrls(
  uploadId: string,
  imageKey: string,
  numParts: number,
  isDraft: boolean
): Promise<UploadUrlsType> {
  const { data } = await axios.post(
    "/account/upload-image/generate-upload-part-urls",
    {
      uploadId,
      imageKey,
      numParts,
      isDraft
    }
  );
  return data.uploadPartUrls;
}
async function uploadChunk(
  url: string,
  blobSlice: Blob,
  maxRetries: number,
  progressCb?: ProgressCb
) {
  // Here we do the uploads, with retry logic if maxRetries > 0
  try {
    const result = await axios.put(url, blobSlice, {
      headers: { "Content-Type": "application/octet-stream" }
    });
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    progressCb && progressCb();
    return result;
  } catch (error: any) {
    for (let ithRetry = 0; ithRetry < maxRetries; ithRetry += 1) {
      try {
        // Rule doc gives us clearance to use in this case
        // eslint-disable-next-line no-await-in-loop
        const result = await axios.put(url, blobSlice, {
          headers: { "Content-Type": "application/octet-stream" }
        });

        // Yes this is a side effect
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        progressCb && progressCb();
        return result;
      } catch (retryError: any) {
        if (ithRetry === maxRetries - 1) {
          return retryError;
        }
      }
    }
    return error;
  }
}
async function uploadFile(
  file: File,
  accountEmail: string,
  isDraft: boolean,
  maxRetries = 5,
  progressCb?: ProgressCb
) {
  const imageKey = generateFileKey(file.name, accountEmail);
  const numEvenChunks = Math.floor(file.size / CHUNK_SIZE);
  const hasChunkRemainder: boolean = file.size % CHUNK_SIZE !== 0;
  const numParts = hasChunkRemainder ? numEvenChunks + 1 : numEvenChunks;

  const uploadId = await createUpload(imageKey, isDraft);
  const uploadUrls = await generateUploadUrls(
    uploadId,
    imageKey,
    numParts,
    isDraft
  );

  // uploadUrlKeyIndexMap[index] = "key"
  const uploadUrlKeys = Object.keys(uploadUrls);
  const ETags = uploadUrlKeys.map(uploadUrlKey => {
    const ithChunk = parseInt(uploadUrlKey, 10);
    const url = uploadUrls[ithChunk];
    const chunkStart = ithChunk * CHUNK_SIZE;
    const chunkEnd =
      ithChunk === uploadUrlKeys.length - 1
        ? file.size
        : (ithChunk + 1) * CHUNK_SIZE;
    // Blob 🍕
    const blobSlice = file.slice(
      chunkStart,
      chunkEnd,
      "application/octet-stream"
    );
    return uploadChunk(url, blobSlice, maxRetries, progressCb);
  });
  await Promise.all(ETags);
}

export default uploadFile;
