const extract = require('extract-zip');
const path = require('path');

const zipFilePath = path.join(__dirname, 'public/images/qemu-fd12-base.zip'); 
const outputDir = path.join(__dirname, 'public/images/'); 

extract(zipFilePath, { dir: outputDir })
  .then(() => {
    console.log('Unzip FreeDOS HDD completed successfully!');
  })
  .catch((err) => {
    console.error("------\r\nAn error during unzipping 'public/images/qemu-fd12-base.zip'.\r\nYOU MAY NEED TO MANUALLY UNZIP THE FILE ON YOUR OWN INSTEAD");
    console.info("\r\n\r\nNavigate to the 'public/images' folder and extract the file 'qemu-fd12-base.zip'.\r\n\r\nThere should be a file named 'fd12-base 2.img' in the same folder after you're done\r\n------");
  });