const express = require('express')
const fs = require('fs')
const util = require('util')
const unlinkFile = util.promisify(fs.unlink)

const multer = require('multer')
const upload = multer({
   dest: 'uploads/',
   limits: { fileSize: 10 * 1024 * 1024 }
   })

const { uploadFile, getFileStream } = require('./s3')

const app = express()

app.get('/images/:key', (req, res) => {
  console.log(req.params)
  const key = req.params.key
  const readStream = getFileStream(key)
  readStream.pipe(res)
})

app.post('/images', upload.single('image'), async (req, res) => {
  const file = req.file;
  const imageUrl = await uploadFile(file);
  await unlinkFile(file.path);
  const description = req.body.description;

  const response = {
    imagePath: imageUrl,  // Use the image URL instead of concatenating path
    url: imageUrl
  };

  res.send(response);
});



app.listen(8080, () => console.log("listening on port 8080"))