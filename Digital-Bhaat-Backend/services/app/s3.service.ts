// utils/s3.utils.ts

import { S3 } from 'aws-sdk';

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
