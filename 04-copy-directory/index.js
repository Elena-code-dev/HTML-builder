const fs = require('fs');
const path = require('path');
const fs2 = require('fs/promises');

async function copyFile (start, finish) {
  try {
    const files = await fs2.readdir(path.join(__dirname, 'files'), {withFileTypes: true});
    for(const file of files) {
      if(file.isFile()) {
        fs.copyFile(path.join(start, file.name), path.join(finish, file.name), (err) => {
          if (err) throw err;
        });
      } else {
        copyFile(path.join(start, file.name)), path.join(finish, file.name);
      }
    }
  } catch (err) {
    console.error(err);
  }
}

async function copyDir () {
  try  {
    await fs2.rm(path.join(__dirname, 'files-copy'), {recursive: true});
  } catch (err) {
    await fs2.mkdir(path.join(__dirname, 'files-copy'), {});
  }
  try {
    await fs2.mkdir(path.join(__dirname, 'files-copy'), {recursive: true});
  } catch (err) {
    console.error(err);
  }
  copyFile(path.join(__dirname, 'files'), path.join(__dirname, 'files-copy'));
}
copyDir();
