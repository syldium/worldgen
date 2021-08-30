/* eslint-disable */

require('dotenv').config();
const chalk = require('chalk');
const fs = require('fs');
const path = require('path');

const toAbsolute = (p) => path.resolve(__dirname, p);

const template = fs.readFileSync(toAbsolute('dist/index.html'), 'utf-8');
const { render, WorldgenNames } = require('./dist/server/entry-server.js');

const baseurl = process.env.BASE_URL;
const sitemap = [];

console.log(chalk.green('Pre-rendering default models...'));
for (const url of [
  '',
  'dimension',
  'dimension_type',
  'worldgen/biome',
  'worldgen/configured_carver',
  'worldgen/configured_feature',
  'worldgen/configured_surface_builder',
  'worldgen/noise_settings',
  'worldgen/processor_list'
]) {
  const appHtml = render(url);
  const name = WorldgenNames[url] || 'dimension';
  const plural = name.endsWith('s') ? name : name + 's';
  const capitalizedName = name.charAt(0).toUpperCase() + name.substr(1);
  const custom = name.includes('configured') ? '' : 'custom ';
  const html = template
    .replace('<!--meta-->',
`<meta name="description" content="A ${custom}${name} datapack generator for Minecraft Java Edition 1.17.1" />
    <meta property="og:title" content="${capitalizedName} datapack generator for Minecraft" />
    <meta property="og:description" content="A tool to generate datapacks with ${custom}${plural} for Minecraft 1.17.1" />`)
    .replace('<div id="root"></div>', '<div id="root">' + appHtml + '</div>');

  const filePath = `dist${url === '' ? url : '/' + url}/index.html`;
  const absolutePath = toAbsolute(filePath);
  fs.mkdir(path.dirname(absolutePath), { recursive: true }, (err) => {
    if (err) {
      throw err;
    }
    fs.writeFileSync(absolutePath, html);
  })
  if (baseurl) {
    sitemap.push(new URL(url, baseurl).toString());
  }
  console.log('Rendered:', chalk.white('/' + url));
}

if (sitemap.length) {
  const path = 'dist/sitemap.txt';
  fs.writeFileSync(toAbsolute(path), sitemap.join('\n'));
  console.log('Created:', chalk.white(path));
}
