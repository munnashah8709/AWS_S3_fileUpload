require('dotenv').config()
const fs = require('fs')
const S3 = require('aws-sdk/clients/s3')

const bucketName = process.env.AWS_BUCKET_NAME
const region = process.env.AWS_BUCKET_REGION
const accessKeyId = process.env.AWS_ACCESS_KEY
const secretAccessKey = process.env.AWS_SECRET_KEY

const s3 = new S3({
  region,
  accessKeyId,
  secretAccessKey
})

// uploads a file to s3
async function uploadFile(file) {
  const originalFileName = file.originalname;
  const uploadParams = {
    Bucket: bucketName,
    Body: fs.createReadStream(file.path),
    Key: `${file.filename}${originalFileName}`
  };
  const result = await s3.upload(uploadParams).promise();
  const imageUrl = result.Location;  // Get the URL of the uploaded image
  return imageUrl;
}

exports.uploadFile = uploadFile;




// downloads a file from s3
function getFileStream(fileKey) {
  const downloadParams = {Key: fileKey,Bucket: bucketName};
  return s3.getObject(downloadParams).createReadStream();
}

exports.getFileStream = getFileStream;

