const { default: axios } = require("axios");
import bytes from "bytes";

class ChunkedFile {
  static chunkSize = bytes("5MB");
  uploadId = null;
  fileInterface = null;
  numChunks = null;
  constructor(uploadId, fileInterface) {
    this.uploadId = uploadId;
    this.fileInterface = fileInterface;
    this.numEvenChunks = Math.floor(fileInterface.size / ChunkedFile.chunkSize);
    this.hasRemainder = fileInterface.size % ChunkedFile.chunkSize !== 0;
    this.numChunks = this.numEvenChunks + this.hasRemainder;
  }

  async createUpload() {
    return axios.post(
      "/account/createUpload",
      {},
      {
        headers: {
          "X-Upload-Id": this.uploadId + ":" + this.fileInterface.name,
          "X-Total-Chunks": this.numEvenChunks + this.hasRemainder
        },
      }
    ); 
  }
  async uploadFile() {
    /* remainderChunk fileSize & chunkSize */

    //The first thing we do is create the chunked upload

    await this.createUpload(); 

    let uploads = [];
    for (let ithChunk = 0; ithChunk < this.numEvenChunks; ++ithChunk) {
      uploads.push(
        this.uploadChunk(
          ithChunk * ChunkedFile.chunkSize,
          (ithChunk + 1) * ChunkedFile.chunkSize
        )
      );
    }
    if (this.hasRemainder !== 0) {
      uploads.push(
        this.uploadChunk(
          this.numEvenChunks * ChunkedFile.chunkSize,
          this.fileInterface.size
        )
      );
    }
    return uploads;
    /*
    const responses = await Promise.all(uploads);
    const isCompleted = responses.reduce((containsCompleted, { status }) => {
      return containsCompleted || status === 200;
    }, false);
    if (isCompleted) {
      return {
        status: 200,
        statusMessage: "Successfully uploaded file",
      };
    } else {
      throw "Status's did not contain a 200Ok, meaning the api could not complete theu upload";
    }
    */
  }
  async uploadChunk(chunkStart, chunkEnd) {
    const chunk = this.fileInterface.slice(
      chunkStart,
      chunkEnd,
      "application/octet-stream"
    );
    return await axios.post("/account/uploadPart", chunk, {
      headers: {
        "Content-Range": `bytes ${chunkStart}-${chunkStart + chunkEnd}/${
          this.fileInterface.size
        }`,
        "Content-Type": chunk.type,
        "X-Upload-Id": this.uploadId + ":" + this.fileInterface.name,
        "X-Current-Chunk-Number":
          Math.floor(chunkStart / ChunkedFile.chunkSize) + 1,
        "X-Total-Chunks": this.numEvenChunks + this.hasRemainder,
      },
    });
  }
}

export default ChunkedFile;
