import AWS from "aws-sdk";
import Locals from "../config/config"

/*
* @author Prafful Bansal
* @description AWS Cloud Storage Service
*/
AWS.config.update({
  accessKeyId: Locals.config().accessKeyId,
  secretAccessKey: Locals.config().secretAccessKey,
  region: Locals.config().region,
});

// creating file uploading service
export const uploadFile = async (file: any) => {
  return new Promise(function (resolve, reject) {
    //this function will upload file to aws and return the link
    const s3 = new AWS.S3({ apiVersion: "2006-03-01" });

    const uploadParams: any = {
      // ACL: "public-read",
      Bucket: Locals.config().bucketName,
      Key: "ProfileImages/" + file.originalname,
      Body: file.buffer,
    };

    s3.upload(uploadParams, function (err: any, data: any) {
      if (err) {
        return reject({ error: err });
      }
      console.log(" file uploaded successfully ");
      console.log(data);
      return resolve(data.Location);
    });
  });
};
