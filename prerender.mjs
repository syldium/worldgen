/* eslint-disable */
import chalk from 'chalk';
import dotenv from 'dotenv';
import fs from 'fs';
import { render, WorldgenNames } from './dist/server/entry-server.js';

dotenv.config();

const template = fs.readFileSync(
  new URL('dist/index.html', import.meta.url),
  'utf-8'
);

const baseurl = process.env.BASE_URL;
const sitemap = [];

console.log(chalk.green('Pre-rendering default models...'));
for (
  const url of [
    '',
    'dimension',
    'dimension_type',
    'worldgen/biome',
    'worldgen/configured_carver',
    'worldgen/configured_feature',
    //'worldgen/noise_settings', // FIXME
    'worldgen/processor_list',
    'worldgen/structure_set'
  ]
) {
  const appHtml = render(url);
  const name = WorldgenNames[url] || 'dimension';
  const plural = name.endsWith('s') ? name : name + 's';
  const capitalizedName = name.charAt(0).toUpperCase() + name.substr(1);
  const custom = name.includes('configured') ? '' : 'custom ';
  const html = template
    .replace(
      '<!--meta-->',
      `<meta name="description" content="A ${custom}${name} datapack generator for Minecraft Java Edition 1.17.1" />
    <meta property="og:title" content="${capitalizedName} datapack generator for Minecraft" />
    <meta property="og:description" content="A tool to generate datapacks with ${custom}${plural} for Minecraft 1.17.1" />`
    )
    .replace('<div id="root"></div>', '<div id="root">' + appHtml + '</div>');

  const dirPath = `dist${url === '' ? url : '/' + url}`;
  const filePath = dirPath + '/index.html';
  const absolutePath = new URL(filePath, import.meta.url);
  fs.mkdir(dirPath, { recursive: true }, (err) => {
    if (err) {
      throw err;
    }
    fs.writeFileSync(absolutePath, html);
  });
  if (baseurl) {
    sitemap.push(new URL(url, baseurl).toString());
  }
  console.log('Rendered:', chalk.white('/' + url));
}

if (sitemap.length) {
  const path = 'dist/sitemap.txt';
  fs.writeFileSync(new URL(path, import.meta.url), sitemap.join('\n'));
  console.log('Created:', chalk.white(path));
}
