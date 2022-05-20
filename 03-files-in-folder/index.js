const fs = require('fs/promises');
const path = require('path');

async function getFileData () {
  try {
    const files = await fs.readdir(path.join(__dirname, 'secret-folder'), { withFileTypes: true});
    
    for(const file of files) {
      if(file.isFile()) {
        const fileName = path.join(__dirname, 'secret-folder', file.name);
        const fsFile = require('fs');
        fsFile.stat(fileName, (err, stats) => {
          console.log(path.basename(fileName, path.extname(fileName)) + ' - ' + path.extname(fileName).slice(1) + ' - ' + stats.size + 'b');
        });
      }
    }
  } catch (err) {
    console.error(err);
  }
}
getFileData();