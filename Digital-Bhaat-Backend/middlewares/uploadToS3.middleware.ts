
import { S3 } from 'aws-sdk';
const Busboy = require('busboy'); // ✅ Will always work in CommonJS
import { NextFunction, Request, Response } from 'express';
import path from 'path';
import responseHandlers, { CustomError } from '../services/response/response.service';
import statusCodes from '../utils/statusCode.utils';
import Env from '../config/Env.config';

const s3 = new S3();
const bucketName = Env.S3_BUCKET_NAME!

export const setUploadFolder = (folderName: string) => {
  return (req: any, _res: Response, next: NextFunction) => {
    req.uploadFolder = folderName;
    next();
  };
};

export const uploadToS3 = (req: any, res: Response, next: NextFunction) => {
  // const userId = req.headers['x-user-id'] as string; // Or from req.user if using auth middleware

  const userId = req.user.userId
  const folder = req.uploadFolder || 'others';

  if (!userId) throw new CustomError(statusCodes.BAD_REQUEST, "Missing user ID")

  //    const busboy = new (Busboy as any)({ headers: req.headers });
  const busboy = Busboy({ headers: req.headers });

  let uploadFinished = false;

  busboy.on('file', (fieldname: string, file: any, filename: any, encoding: string, mimetype: string) => {


    //   if (typeof filename !== 'string') {
    //     return res.status(400).json({ error: "Invalid filename received." });
    //   }

    const ext = path.extname(filename.filename);
    const timestamp = new Date().toISOString().replace(/[-:.]/g, '').slice(0, 15);
    const key = `${folder}/${userId}-${timestamp}${ext}`;
   
    const params = {
      Bucket: bucketName,
      Key: key,
      Body: file,
      ContentType: mimetype || 'application/octet-stream',
    };

    s3.upload(params, (err: any, data: any) => {
      if (err) {
        return res.status(500).json({ error: 'Upload to S3 failed', details: err });
      }

      req.s3File = {
        key: data.Key,
        bucket: data.Bucket,
        url: data.Location
      };
      uploadFinished = true;
      next(); // proceed to textract step

    });
  });



  busboy.on('error', (err: any) => {
    res.status(500).json({ error: 'File parsing error', details: err });
  });

  req.pipe(busboy);
};
