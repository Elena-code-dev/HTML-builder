const fs = require('fs');
const path = require('path');
const fsPromises = require('fs/promises');
let temlate = '';
const components = {};
copyDir();
async function copyDir () {
  try  {
    await fsPromises.rm(path.join(__dirname, 'project-dist'), {recursive: true});
  } catch (err) {
    await fsPromises.mkdir(path.join(__dirname, 'project-dist'), {recursive: true}, () => {});
  }
  try {
    await fsPromises.mkdir(path.join(__dirname, 'project-dist'), {recursive: true}, () => {});
  } catch (err) {
    console.error(err);
  }
  const stream = fs.createReadStream(path.join(__dirname, 'template.html'), 'utf-8');
  stream.on('data', chunk => temlate += chunk);
  stream.on('end', () => {
    getComponents();
  });
  stream.on('error', error => console.error(error));

  copyFile(path.join(__dirname, 'assets'), path.join(__dirname, 'project-dist', 'assets'));
  getStyles();
}
async function getStyles () {
  const output = fs.createWriteStream(path.join(__dirname, 'project-dist', 'style.css'));
  try {
    const files = await fsPromises.readdir(path.join(__dirname, 'styles'), {withFileTypes: true});
	
    for(const item of files) {
      if(item.isFile()) {
        let extname = path.extname(path.join(__dirname, 'styles', item.name));
        if(extname != '.css')
          continue; 
        const stream = fs.createReadStream(path.join(__dirname, 'styles', item.name), 'utf-8');
        let data = '';
        stream.on('data', chunk => data += chunk);
        stream.on('end', () => {
          output.write(data);
        });
        stream.on('error', error => console.error(error));
      }	
    } 
  } catch (err) {
    console.error(err);
  }
}

async function getComponents() {
  const files = await fsPromises.readdir(path.join(__dirname, 'components'), {withFileTypes: true});
  let component = files.map(item => {
    return new Promise((resolve, reject) => {
      if(item.isFile()) {
        if(path.extname(path.join(__dirname, 'components', item.name)) != '.html')
          resolve();
        const name = path.basename(path.join(__dirname, 'components', item.name), path.extname(path.join(__dirname, 'components', item.name)));
        components[name] = { text: '', ready: false };
        const stream = fs.createReadStream(path.join(__dirname, 'components', item.name), 'utf-8');
        stream.on('data', chunk => components[name].text += chunk);
        stream.on('end', () => { resolve();});
        stream.on('error', () => reject());
      }
    });
  });
  Promise.allSettled(component).then(() => {
    let res = temlate;
    for(let item in components) {
      res = res.split(`{{${item}}}`).join(components[item].text);
    }
    temlate = res;
    fs.writeFile(path.join(__dirname,'project-dist',  'index.html'), temlate, (err) => {
      if (err) throw err;
    });
  });
}

async function copyFile (start, finish) {
  fs.mkdir(finish, { recursive: true },(err) => {
    if (err) throw err;
  });
  try {
    const files = await fsPromises.readdir(start, {withFileTypes: true});
    for(const file of files) {
      if(file.isFile()) {
        fs.copyFile(path.join(start, file.name), path.join(finish, file.name), (err) => {
          if (err) throw err;
        });
      } else {
        copyFile(path.join(start, file.name), path.join(finish, file.name));
      }
    }
  } catch (err) {
    console.error(err);
  }
}
