const { default: axios } = require("axios");

class ChunkedFile {
  static chunkSize = 100000000;
  uploadId = null;
  uploadSource = null;
  startChunk = null;
  endChunk = null;
  fileInterface = null;
  constructor(uploadId, uploadSource, fileInterface) {
    this.uploadId = uploadId;
    this.uploadSource = uploadSource;
    this.fileInterface = fileInterface
  }

  async uploadFile() {
    /* numChunks = Math.floor(fileSize / chunkSize) */
    /* remainderChunk fileSize & chunkSize */
    let uploads = [];
    for (ithChunk = 1; ithChunk < numChunks; ++ithChunk) {
      uploads.append(uploadChunk(currentChunk, chunkSize));
    }
    if (remainderChunk !== 0) {
      uploadChunk(currentChunk, remainderChunk);
    }
    return Promise.all(uploads).then((responses) => {
      const isCompleted = responses.reduce(
        (containsCompleted, { response: { status } }) => {
          return containsCompleted(status === 200);
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
  async uploadChunk(currentChunk, chunkSize) {
	const chunk = this.fileInterface.slice(currentChunk, chunkSize)
	try {
		await axios.post("/account/studio/upload")
	} catch (error) {

	}
  }
}


