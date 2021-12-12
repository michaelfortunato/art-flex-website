"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
exports.__esModule = true;
var bytes_1 = require("bytes");
var uuid_1 = require("uuid");
var axios_1 = require("axios");
var ChunkedFile = /** @class */ (function () {
    /**
     * Initialize an object for chunked file uploading
     * @param fileInterface - A NodeJS file object
     * @param accountEmail - The account email associated with the upload
     */
    function ChunkedFile(fileInterface, isDraft, accountEmail) {
        _ChunkedFile_instances.add(this);
        _ChunkedFile_numEvenChunks.set(this, void 0);
        _ChunkedFile_hasChunkRemainder.set(this, void 0);
        this.isDraft = isDraft;
        this.imageKey = ChunkedFile.generateFileKey(fileInterface.name, accountEmail);
        this.uploadId = "";
        this.fileInterface = fileInterface;
        __classPrivateFieldSet(this, _ChunkedFile_numEvenChunks, Math.floor(fileInterface.size / ChunkedFile.chunkSize), "f");
        __classPrivateFieldSet(this, _ChunkedFile_hasChunkRemainder, fileInterface.size % ChunkedFile.chunkSize !== 0, "f");
        this.numParts = __classPrivateFieldGet(this, _ChunkedFile_hasChunkRemainder, "f")
            ? __classPrivateFieldGet(this, _ChunkedFile_numEvenChunks, "f") + 1
            : __classPrivateFieldGet(this, _ChunkedFile_numEvenChunks, "f");
    }
    /**
     * This method returns
     * @param filename
     * @param accountEmail
     */
    ChunkedFile.generateFileKey = function (filename, accountEmail) {
        return "".concat(accountEmail, "/").concat(filename, "-").concat((0, uuid_1.v4)());
    };
    ChunkedFile.prototype.uploadFile = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a, uploadUrls, uploads, ithChunk;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        /* remainderChunk fileSize & chunkSize */
                        // The first thing we do is create the chunked upload
                        _a = this;
                        return [4 /*yield*/, __classPrivateFieldGet(this, _ChunkedFile_instances, "m", _ChunkedFile_createUpload).call(this)];
                    case 1:
                        /* remainderChunk fileSize & chunkSize */
                        // The first thing we do is create the chunked upload
                        _a.uploadId = _b.sent();
                        return [4 /*yield*/, __classPrivateFieldGet(this, _ChunkedFile_instances, "m", _ChunkedFile_generateUploadUrls).call(this)];
                    case 2:
                        uploadUrls = _b.sent();
                        uploads = [];
                        for (ithChunk = 0; ithChunk < this.numEvenChunks; ++ithChunk) {
                            uploads.push(this.uploadChunk(ithChunk * ChunkedFile.chunkSize, (ithChunk + 1) * ChunkedFile.chunkSize));
                        }
                        if (this.hasRemainder !== 0) {
                            uploads.push(this.uploadChunk(this.numEvenChunks * ChunkedFile.chunkSize, this.fileInterface.size));
                        }
                        return [2 /*return*/, uploads];
                }
            });
        });
    };
    ChunkedFile.prototype.uploadChunk = function (chunkStart, chunkEnd) {
        return __awaiter(this, void 0, void 0, function () {
            var chunk;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        chunk = this.fileInterface.slice(chunkStart, chunkEnd, "application/octet-stream");
                        return [4 /*yield*/, axios_1["default"].post("/account/uploadPart", chunk, {
                                headers: {
                                    "Content-Range": "bytes ".concat(chunkStart, "-").concat(chunkStart + chunkEnd, "/").concat(this.fileInterface.size),
                                    "Content-Type": chunk.type,
                                    "X-Upload-Id": this.uploadId + ":" + this.fileInterface.name,
                                    "X-Current-Chunk-Number": Math.floor(chunkStart / ChunkedFile.chunkSize) + 1,
                                    "X-Total-Chunks": this.numEvenChunks + this.hasRemainder
                                }
                            })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    var _ChunkedFile_instances, _ChunkedFile_numEvenChunks, _ChunkedFile_hasChunkRemainder, _ChunkedFile_createUpload, _ChunkedFile_generateUploadUrls;
    _ChunkedFile_numEvenChunks = new WeakMap(), _ChunkedFile_hasChunkRemainder = new WeakMap(), _ChunkedFile_instances = new WeakSet(), _ChunkedFile_createUpload = function _ChunkedFile_createUpload() {
        return __awaiter(this, void 0, void 0, function () {
            var data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, axios_1["default"].post("/account/upload-image/create-upload", {
                            imageKey: this.imageKey,
                            isDraft: this.isDraft
                        })];
                    case 1:
                        data = (_a.sent()).data;
                        return [2 /*return*/, data.uploadId];
                }
            });
        });
    }, _ChunkedFile_generateUploadUrls = function _ChunkedFile_generateUploadUrls() {
        return __awaiter(this, void 0, void 0, function () {
            var data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, axios_1["default"].post("/account/upload-image/generate-upload-part-urls", {
                            uploadId: this.uploadId,
                            imageKey: this.imageKey,
                            numParts: this.numParts,
                            isDraft: this.isDraft
                        })];
                    case 1:
                        data = (_a.sent()).data;
                        return [2 /*return*/, data.uploadPartUrls];
                }
            });
        });
    };
    ChunkedFile.chunkSize = (0, bytes_1["default"])("5MB");
    return ChunkedFile;
}());
exports["default"] = ChunkedFile;
