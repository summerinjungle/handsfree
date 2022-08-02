/** --- */
const AWS = require('aws-sdk');
const multer = require('multer');
const { memoryStorage } = require('multer')
const storage = memoryStorage()
const upload = multer({ storage })

const fs = require('fs');
var path = require("path");
var zlib = require('zlib');

const s3 = new AWS.S3({
  accessKeyId: process.env.S3_ACCESSKEY_ID,
  secretAccessKey: process.env.S3_SECRET_ACCESSKEY,
})

const uploadAudio = (filename, bucketname, file) => {
  console.log("FILE-----", file);
  return new Promise((resolve, reject) => {
    const params = {
      Key: filename,
      Bucket: bucketname,
      Body: file,
      ContentType: ';video/webm',
      ACL: 'public-read'
    }

    s3.upload(params, (err, data) => {
      if (err) {
        console.log(err);
        reject(err)
      } else {
        resolve(data)
      }
    })
  })

}

exports.doUpload = async (sessionId) => {
  const filename = sessionId;
  const bucketname = 'onxmoreplzbucket';


  
  
  let path1 = path.join('__dirname', '../output_ffmpeg/' + "glele10x" + '.webm');
  var file = fs.createReadStream(path1).pipe(zlib.createGzip());
  // const file = fs.readFileSync(path1, (err, data) => {
  //   if (err) {
  //     console.error(err);
  //     return;
  //   }
  //   console.log(data);
  // });
  const link = await uploadAudio(filename, bucketname, file);
  console.log('uploaded successfully ...');
  console.log(link);
}

const uploadFile = (sessionId) => {
  // Read content from the file
  const fileContent = fs.readFileSync(fileName);

  // Setting up S3 upload parameters
  const params = {
    Bucket: BUCKET_NAME,
    Key: 'cat.jpg', // File name you want to save as in S3
    Body: fileContent
  };

  // Uploading files to the bucket
  s3.upload(params, function (err, data) {
    if (err) {
      throw err;
    }
    console.log(`File uploaded successfully. ${data.Location}`);
  });
};

const buckt = 'onxmoreplzbucket'