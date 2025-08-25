const { PNG } = require('pngjs');
const fs = require('fs');

const data = fs.readFileSync('./__image_snapshots__/home-page.png');
const png = PNG.sync.read(data);

console.log(`Width: ${png.width}`);
console.log(`Height: ${png.height}`);
