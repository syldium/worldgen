/* eslint-disable */
import chalk from 'chalk';
import dotenv from 'dotenv';
import fs from 'fs';
import { render, WorldgenNames } from './dist/server/entry-server.mjs';

dotenv.config();

const template = fs.readFileSync(
  new URL('dist/index.html', import.meta.url),
  'utf-8'
);

const baseurl = process.env.BASE_URL;
const sitemap = [];

console.log(chalk.green('Pre-rendering default models...'));
for (
  const uri of [
    '',
    'dimension',
    'dimension_type',
    'worldgen/biome',
    'worldgen/configured_carver',
    'worldgen/configured_feature',
    'worldgen/noise_settings',
    'worldgen/placed_feature',
    'worldgen/processor_list',
    'worldgen/structure_set'
  ]
) {
  console.log('Rendering:', chalk.white('/' + uri));
  const appHtml = render(uri);
  const name = WorldgenNames[uri] || 'dimension';
  const plural = name.endsWith('s') ? name : name + 's';
  const capitalizedName = name.charAt(0).toUpperCase() + name.substring(1);
  const custom = name.includes('configured') ? '' : 'custom ';
  let canonical = '';
  if (baseurl) {
    const url = new URL(uri, baseurl).toString();
    sitemap.push(url);
    canonical = `\n    <link rel="canonical" href="${url}" />`;
  }
  const html = template
    .replace(
      '<!--meta-->',
      `<meta name="description" content="A ${custom}${name} datapack generator for Minecraft Java Edition 1.17-1.19.3" />
    <meta property="og:title" content="${capitalizedName} datapack generator for Minecraft" />
    <meta property="og:description" content="A tool to generate datapacks with ${custom}${plural} for Minecraft 1.17-1.19.3" />${canonical}`
    )
    .replace('<div id="root"></div>', '<div id="root">' + appHtml + '</div>');

  const dirPath = `dist${uri === '' ? uri : '/' + uri}`;
  const filePath = dirPath + '/index.html';
  const absolutePath = new URL(filePath, import.meta.url);
  fs.mkdir(dirPath, { recursive: true }, (err) => {
    if (err) {
      throw err;
    }
    fs.writeFileSync(absolutePath, html);
  });
}

if (sitemap.length) {
  const path = 'dist/sitemap.txt';
  fs.writeFileSync(new URL(path, import.meta.url), sitemap.join('\n'));
  console.log('Created:', chalk.white(path));
}
