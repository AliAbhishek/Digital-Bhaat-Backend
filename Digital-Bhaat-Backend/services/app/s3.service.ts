// utils/s3.utils.ts

import { S3 } from 'aws-sdk';
import Env from '../../config/Env.config';

const s3 = new S3();

/**
 * Delete a file from S3 bucket.
 * @param bucketName - Name of the S3 bucket
 * @param key - Key (path + filename) of the object to delete
 */
export const deleteFromS3 = async (bucketName: string, key: string): Promise<void> => {
    const params = {
        Bucket: bucketName,
        Key: key,
    };


    await s3.deleteObject(params).promise();
    console.log(`✅ Deleted from S3: ${key}`);

};


export const generatePresignedUrl = async(key: string, expiresIn = 300) => {

  let url=await  s3.getSignedUrlPromise('getObject', {
    Bucket: process.env.S3_BUCKET_NAME!,
    Key: key,
    Expires: expiresIn,
  });

//   console.log(url,"url")
  return url
};


export const addPresignedUrls = async (profile: any) => {
  const extractKey = (url: string) => {
    try {
      return new URL(url).pathname.slice(1); // Removes leading slash
    } catch (error) {
      return url; // fallback if it's already a key
    }
  };

  if (profile?.guardianDetails?.profileImage) {
    const key = extractKey(profile.guardianDetails.profileImage);

    let url = await generatePresignedUrl(key);
  
    profile.guardianImageUrl=url
    
  }

//   if (profile?.brideDetails?.profileImage) {
//     const key = extractKey(profile.brideDetails.profileImage);
//     profile.brideProfileImageUrl = await generatePresignedUrl(key);
//   }

  return profile;
};

