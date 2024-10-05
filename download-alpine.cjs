const fetch = require('node-fetch');
const path = require('path');
const fs = require('fs');

const fileName = 'alpine-virt-3.20.3-x86.iso';

const alpineIsoUrl = `https://dl-cdn.alpinelinux.org/alpine/v3.20/releases/x86/${fileName}`;
const destination = path.join(__dirname, `public/images/${fileName}`);

console.log('Downloading ' + alpineIsoUrl);
fetch(alpineIsoUrl)
  .then((response) => {
    // Check if the response is OK (status code 200)
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    // Get the total content length from the headers
    const total = parseInt(response.headers.get('content-length'), 10);
    let downloaded = 0;

    // Create a writable stream to the destination file
    const fileStream = fs.createWriteStream(destination);

    return new Promise((resolve, reject) => {
      // Pipe the response body into the file stream
      response.body
        .on('data', (chunk) => {
          downloaded += chunk.length;
          const percentage = ((downloaded / total) * 100).toFixed(2);
          process.stdout.write(`Downloading ${fileName}: ${percentage}%\r`);
        })
        .on('end', () => {
          console.log('\nFile downloaded successfully!');
          resolve();
        })
        .on('error', (err) => {
          reject(err);
        })
        .pipe(fileStream);
    });
  })
  .catch((err) => {
    console.log(err);
    console.error(
      "------\r\nAn error during downloading '" +
        fileName +
        "'.\r\nYOU MAY NEED TO MANUALLY DOWNLOAD THE FILE ON YOUR OWN INSTEAD"
    );
    console.info(
      '\r\n\r\nDownload ' +
        alpineIsoUrl +
        " and add it to the 'public/images' folder------"
    );
  });
