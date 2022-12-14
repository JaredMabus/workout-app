import { PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import path from "path";
import s3Client from "./s3Client";
import { v4 } from "uuid";

export default class S3 {
  Bucket: string;
  Key: string;
  Body: Buffer | undefined;
  client: any;
  accountId: string;
  url: string;

  constructor(Key: string, Body: Buffer | undefined, accountId: string) {
    this.Bucket =
      "workout-app-user-images-056a900a-53cc-41e8-aad2-79bf5ca112a2";
    this.Body = Body;
    this.accountId = accountId;
    this.url = "";
    this.client = s3Client;
    this.Key = this.validFileName(Key);
  }

  validFileName(string: string) {
    try {
      string = string.replace(/\s/g, "");
      let fileExt = path.parse(string).ext;
      string = `${v4()}-avatar${fileExt}`;
      this.url = `https://${this.Bucket}.s3.us-east-2.amazonaws.com/${string}`;
      return string;
    } catch (err) {
      throw new Error("Could not create valid file name");
    }
  }

  async uploadFile() {
    try {
      if (this.Key !== undefined) {
        let params = {
          Bucket: this.Bucket,
          Key: this.Key,
          Body: this.Body,
        };
        return await this.client.send(new PutObjectCommand(params));
      }
    } catch (err) {
      throw new Error("Could not upload file");
    }
  }

  async deleteFile(fileName: string) {
    try {
      fileName = fileName.replace(
        `https://${this.Bucket}.s3.us-east-2.amazonaws.com/`,
        ""
      );
      let params = {
        Bucket: this.Bucket,
        Key: fileName,
      };
      return await this.client.send(new DeleteObjectCommand(params));
    } catch (err) {
      throw new Error("Could not delete file");
    }
  }
}
