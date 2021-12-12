import bytes from "bytes";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";

type UploadUrlsType = Record<number, string>;
const CHUNK_SIZE = bytes("5MB");
class ChunkedFile {
  static chunkSize = bytes("5MB");

  imageKey: string;

  uploadId: string;

  fileInterface: File;

  numParts: number;

  #uploadUrls: UploadUrlsType | undefined;

  #numEvenChunks: number;

  #hasChunkRemainder: boolean;

  /**
   * Initialize an object for chunked file uploading
   * @param fileInterface - A NodeJS file object
   * @param accountEmail - The account email associated with the upload
   */
  constructor(fileInterface: File, accountEmail: string) {
    this.imageKey = ChunkedFile.generateFileKey(
      fileInterface.name,
      accountEmail
    );
    this.uploadId = "";
    this.fileInterface = fileInterface;
    this.#numEvenChunks = Math.floor(
      fileInterface.size / ChunkedFile.chunkSize
    );
    this.#hasChunkRemainder = fileInterface.size % ChunkedFile.chunkSize !== 0;
    this.numParts = this.#hasChunkRemainder
      ? this.#numEvenChunks + 1
      : this.#numEvenChunks;
  }

  /**
   * This method returns
   * @param filename
   * @param accountEmail
   */
  static generateFileKey(filename: string, accountEmail: string): string {
    return `${accountEmail}/${filename}-${uuidv4()}`;
  }

  /**
   * Method starts the upload process with AWS by calling the backend server.
   *
   * @returns
   */
  async #createUpload(isDraft: boolean) {
    const { data } = await axios.post("/account/upload-image/create-upload", {
      imageKey: this.imageKey,
      isDraft
    });
    return data.uploadId;
  }

  async #generateUploadUrls(isDraft: boolean): Promise<UploadUrlsType> {
    const { data } = await axios.post(
      "/account/upload-image/generate-upload-part-urls",
      {
        uploadId: this.uploadId,
        imageKey: this.imageKey,
        numParts: this.numParts,
        isDraft
      }
    );
    return data.uploadPartUrls;
  }

  async uploadFile(
    file: File,
    accountEmail: string,
    isDraft: boolean,
    maxRetries = 5
  ) {
    const imageKey = ChunkedFile.generateFileKey(file.name, accountEmail);
    const numEvenChunks = Math.floor(file.size / CHUNK_SIZE);
    const hasChunkRemainder: boolean = file.size % CHUNK_SIZE !== 0;
    const numParts = hasChunkRemainder
      ? this.#numEvenChunks + 1
      : this.#numEvenChunks;

    const uploadId = createUpload;
    /* remainderChunk fileSize & chunkSize */

    // The first thing we do is create the chunked upload

    this.uploadId = await this.#createUpload(isDraft);

    this.#uploadUrls = await this.#generateUploadUrls(isDraft);

    // uploadUrlKeyIndexMap[index] = "key"
    const ETags = Object.keys(this.#uploadUrls).map(ithChunk =>
      this.uploadChunk(
        this.#uploadUrls?.[parseInt(ithChunk, 10)],
        parseInt(ithChunk, 10),
        maxRetries
      )
    );
    const uploadResults = await Promise.all(ETags);
  }

  async uploadChunk(
    url: string | undefined,
    ithChunk: number,
    maxRetries: number
  ) {
    if (url === undefined) {
      throw new Error(`Upload url does not exist for chunk number ${ithChunk}`);
    }
    const chunkStart = ithChunk * ChunkedFile.chunkSize;
    const chunkEnd =
      this.#hasChunkRemainder && ithChunk === this.numParts - 1
        ? this.fileInterface.size
        : (ithChunk + 1) * ChunkedFile.chunkSize;
    const blobSlice = this.fileInterface.slice(chunkStart, chunkEnd);

    // Here we do the uploads, with retry logic if maxRetries > 0
    try {
      const result = await axios.put(url, blobSlice, {
        headers: {
          "Content-Type": "application/octet-stream",
          "Content-Range": `bytes ${chunkStart}-${chunkStart + chunkEnd}/${
            this.fileInterface.size
          }`
        }
      });
      return result;
    } catch (error: any) {
      for (let ithRetry = 0; ithRetry < maxRetries; ithRetry += 1) {
        try {
          // eslint-disable-next-line no-await-in-loop
          const result = await axios.put(url, blobSlice, {
            headers: {
              "Content-Type": "application/octet-stream",
              "Content-Range": `bytes ${chunkStart}-${chunkStart + chunkEnd}/${
                this.fileInterface.size
              }`
            }
          });
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
}

export default ChunkedFile;
