const fs = require('fs');
const path = require('path');
const fsA = require('fs');
const output = fs.createWriteStream(path.join(__dirname, 'project-dist', 'bundle.css'));

fsA.readdir(path.join(__dirname, 'styles'), (err, files) => {
  if(err) throw err;
  let style = files.filter(file => file.split('.').slice(1).join('') === 'css' ? file : null);
  for(const item of style) {
    const stream = fs.createReadStream(path.join(__dirname, 'styles', `${item}`), 'utf-8');
    let data = '';
    stream.on('data', chunk => data += chunk);
    stream.on('end', () => {
      output.write(data);
    });
  }	
});
