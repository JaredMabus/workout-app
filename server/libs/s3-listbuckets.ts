import {
  ListBucketsCommand,
  CreateBucketCommand,
  PutObjectCommand,
} from "@aws-sdk/client-s3";
import s3Client from "./s3Client";
import { v4 as uuidv4 } from "uuid";

export const list = async () => {
  try {
    const data = await s3Client.send(new ListBucketsCommand({}));
    console.log("Success", data.Buckets);
    return data;
  } catch (err) {
    console.log("Error", err);
  }
};

export const createBucket = async () => {
  try {
    let bucketName = "workout-app-user-images-" + uuidv4();
    const data = await s3Client.send(
      new CreateBucketCommand({ Bucket: bucketName })
    );
    console.log(data);
    console.log("Successfully created a bucket called ", data.Location);
    return data;
  } catch (err) {
    console.log("Error", err);
  }
};

const params = {
  Bucket: "workout-app-user-images-056a900a-53cc-41e8-aad2-79bf5ca112a2",
  Key: "sample_upload.txt",
  Body: "Hello world1!",
};

export const createObject = async () => {
  try {
    const results = await s3Client.send(new PutObjectCommand(params));
    console.log(
      "Successfully created " +
        params.Key +
        " and uploaded it to " +
        params.Bucket +
        "/" +
        params.Key
    );
    return results;
  } catch (err) {
    console.log("Error", err);
  }
};

(async () => {
  await createBucket();
  await createObject();
  await list();
})();
