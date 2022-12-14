import { S3Client } from "@aws-sdk/client-s3";
import dotenv from "dotenv";
dotenv.config();

const REGION = "us-east-2";
const s3Client = new S3Client({ region: REGION, apiVersion: "2006-06-01" });

export default s3Client;
