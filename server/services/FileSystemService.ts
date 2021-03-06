/**
 * Created by SHELDON on 6/21/2017.
 */

import * as fs from "fs";
import * as mime from "mime";
import * as path from "path";
import {MimeType} from "../enums/MimeType";

import {isNullOrUndefined} from "util";
import {FileUploadRecord} from "../models/FileUploadRecord";
import {AppError} from "../errors/AppError";
import {ClientError} from "../errors/HttpStatus";
import StringUtils from "../utils/stringUtils";
import {FileAccessType} from "../enums/FileAccessType";
import {IFileUploadRecordRepository} from "../repositories/FileUploadRecordRepository";
import {BaseService} from "./BaseService";
import {User} from "../models/User";

const fileType = require('file-type');

export interface IFileSystemService {
    saveUploadedFile(file: Express.Multer.File, user: User)
}

export class FileSystemService extends BaseService implements IFileSystemService {
    private readonly validImageMimeTypes = [MimeType.PNG, MimeType.JPG];
    private readonly validTextDocMimeTypes = [];
    private fileUploadRecordRepository: IFileUploadRecordRepository;

    constructor(fileUploadRecordRepository: IFileUploadRecordRepository) {
        super();
        this.fileUploadRecordRepository = fileUploadRecordRepository;
    }

    // TODO: should do a "batch" write instead. so that all files are validated before saving it.
    saveUploadedFile(file: Express.Multer.File,
                     user: User): Promise<FileUploadRecord> {
        /* Step 1. Validate the mimeType that is set by Multer, which is determined
           using the content-header,
         */
        let mimeTypeFromContentHeader: string = file.mimetype;
        if (!this.isValidMimeType(mimeTypeFromContentHeader)) {
            throw new AppError("Invalid file type.", ClientError.BAD_REQUEST);
        }

        /* Step 2. Determine and validate the mimeType of the file using the "magic number"
           inside the file itself.
           https://en.wikipedia.org/wiki/File_format#Magic_number
         */
        let magicNumberChunk: Buffer = new Buffer(4100);
        file.buffer.copy(magicNumberChunk, 0, 0, 4100);
        let fileTypeInfo: any = fileType(magicNumberChunk);
        if (!this.isValidMimeType(fileTypeInfo.mime)) {
            throw new AppError("Invalid file type.", ClientError.BAD_REQUEST);
        }

        /* Step 3. Write the file to disk(should upload to S3 instead). */
        let uploadedTime: Date = new Date();
        let newFileName: string = StringUtils.genRandomString(10) + '_' + uploadedTime.getTime() + '.' + mime.extension(file.mimetype);
        let filePath: string = path.join(__dirname, '..', '..', 'static', 'media', newFileName);
        let folderPath = path.dirname(filePath);
        let fileURL: string = '/media/' + newFileName;

        return this.checkPath(folderPath).then(() => {
            return;
        }).catch((err) => {
            // make the media folder
            return this.mkDir(folderPath);
        }).then(() => {
            return this.writeFileAsync(filePath, file.buffer);
        }).then(() => {
            let fileUploadRecord: FileUploadRecord = new FileUploadRecord(
                user,
                FileAccessType.PUBLIC,
                fileURL, // Build a correct URL
                newFileName,
                file.originalname,
                fileTypeInfo.mime,
                file.size,
                uploadedTime);
            return this.fileUploadRecordRepository.create(fileUploadRecord);
        })
    }

    checkPath(path): Promise<any> {
        return new Promise((resolve, reject) => {
            fs.access(path, fs.constants.R_OK | fs.constants.W_OK, (err) => {
                (err) ? reject(err) : resolve(1);
            });
        });
    }

    mkDir(path): Promise<any> {
        return new Promise((resolve, reject) => {
            fs.mkdir(path, fs.constants.R_OK | fs.constants.W_OK, (err) => {
                (err) ? reject(err) : resolve(1);
            });
        });
    }

    writeFileAsync(filePath, buffer): Promise<any> {
        return new Promise(function (resolve, reject) {
            fs.writeFile(filePath, buffer, function (err) {
                (err) ? reject(err) : resolve(1);
            });
        })
    }

    private isValidMimeType(mimeType: string): boolean {
        let found: MimeType = this.validImageMimeTypes
            .concat(this.validTextDocMimeTypes)
            .find((validMimeType: MimeType) => {
                return validMimeType.toString().toLowerCase() === mimeType.toLowerCase();
            });
        return !isNullOrUndefined(found)
    }

}