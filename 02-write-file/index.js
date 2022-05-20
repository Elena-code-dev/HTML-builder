const fs = require('fs');
const readline = require('readline');
const { stdin: input, stdout: output } = process;
const rl = readline.createInterface({ input, output });
const path = require('path');
const text = fs.createWriteStream(path.join(__dirname, 'text.txt'));

rl.on('line', (input) => {
  if(input === 'exit') {
    process.exit();
  } else {
    text.write(input + '\n');
  }
});

console.log('Добро пожаловать! Введите текст, пожалуйста!');
process.on('exit', () => output.write('Уже уходите? До встречи!'));
process.on('SIGINT', () => process.exit());

