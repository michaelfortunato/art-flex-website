const { default: axios } = require("axios");

class ChunkedFile {
  static chunkSize = 2000000;
  uploadId = null;
  fileInterface = null;
  numChunks = null;
  constructor(uploadId, fileInterface) {
    this.uploadId = uploadId;
    this.fileInterface = fileInterface;
    this.numChunks = Math.floor(
      this.fileInterface.size / ChunkedFile.chunkSize
    );
  }

  async uploadFile() {
    /* remainderChunk fileSize & chunkSize */
    let uploads = [];
    for (ithChunk = 0; ithChunk < this.numChunks; ++ithChunk) {
      uploads.append(
        uploadChunk(
          ithChunk * ChunkedFile.chunkSize,
          (ithChunk + 1) * ChunkedFile.chunkSize
        )
      );
    }
    if (this.fileInterface.size % ChunkedFile.chunkSize !== 0) {
      uploads.append(
        uploadChunk(
          this.numChunks * ChunkedFile.chunkSize,
          this.fileInterface.size
        )
      );
    }

    return Promise.all(uploads).then((responses) => {
      const isCompleted = responses.reduce(
        (containsCompleted, { response: { status } }) => {
          return containsCompleted || status === 200;
        },
        false
      );
      if (!isComplted) {
        throw "Status's did not contain a 200Ok, meaning the api could not complete theu upload";
      } else {
        return {
          status: 200,
          statusMessage: "Successfully uploaded file",
        };
      }
    });
  }
  async uploadChunk(chunkStart, chunkEnd) {
    const chunk = this.fileInterface.slice(
      chunkStart,
      chunkEnd,
      "application/octet-stream"
    );
    return await axios.post("/account/create_post", chunk, {
      headers: {
        "Content-Range": `bytes ${chunkStart}-${chunkStart + chunkEnd}/${
          this.fileInterface.size
        }`,
        "Content-Type": chunk.type,
        "Upload-Id": this.uploadId + ":" + this.fileInterface.name,
        "Current-Chunk-Number": chunkStart / ChunkedFile.chunkSize,
        "Total-Chunks":
          Math.floor(this.fileInterface.size / ChunkedFile.chunkSize) + 1,
      },
    });
  }
}

export default ChunkedFile;
