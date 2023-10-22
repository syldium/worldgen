import { strFromU8, unzipSync } from 'fflate';
import {
  createWriteStream,
  existsSync,
  mkdirSync,
  readFileSync,
  unlinkSync
} from 'fs';
import { opendir, readFile } from 'fs/promises';
import { get } from 'https';
import { dirname, join as joinPath } from 'path';
import { argv, exit } from 'process';
import type { GameVersion } from './main/context/GameVersion';
import { ErrorCollector } from './main/model/node/Node';
import { RegistryHolder } from './main/model/Registry';
import { getVanillaZipUrl } from './main/util/FetchHelper';
import { findNamespacedKeyAndRegistry } from './main/util/PathHelper';

async function test(
  version: GameVersion,
  items: AsyncIterable<[string, string]>,
  addContext: boolean
): Promise<number> {
  const holder = await RegistryHolder.create(version);

  let errorsCount = 0;
  let checkedFiles = 0;
  for await (const [path, content] of items) {
    const match = findNamespacedKeyAndRegistry(path);
    if (!match) {
      continue;
    }
    const registryType = match[2];
    if (!holder.isWorldgen(registryType)) {
      continue;
    }
    const model = JSON.parse(content);
    const errors = new ErrorCollector();
    holder.worldgen[registryType].model.node.validate(
      '',
      model,
      errors,
      holder
    );
    checkedFiles += 1;
    if (errors.size) {
      errorsCount += errors.size;
      if (addContext) {
        console.error('Assertion failed for', path, 'when validating', model);
        console.error(errors.errors);
      } else {
        console.error(
          'Assertion failed for',
          path,
          'when validating:',
          errors.errors
        );
      }
    }
  }
  if (errorsCount) {
    console.error(errorsCount, 'error(s) found!');
    return 2;
  }
  console.log('Success!', checkedFiles, 'file(s) checked');
  return 0;
}

async function* iterateZip(zip: Buffer): AsyncIterable<[string, string]> {
  for (const [path, content] of Object.entries(unzipSync(zip))) {
    const dataPath = joinPath('data', 'minecraft', path);
    yield [dataPath, strFromU8(content)];
  }
}

function tryLoad(version: GameVersion, addContext: boolean) {
  const generated = joinPath('scripts', 'generated', version);
  if (existsSync(generated)) {
    test(
      version,
      async function* () {
        for await (
          const dirent of await opendir(generated, { recursive: true })
        ) {
          if (!dirent.isFile()) {
            continue;
          }
          const path = joinPath(dirent.path, dirent.name);
          const content = await readFile(path, 'utf-8');
          yield [path.substring(generated.length + 1), content];
        }
      }(),
      addContext
    ).then(exit);
    return;
  }
  const zip = joinPath('work', version, 'vanilla_worldgen.zip');
  if (existsSync(zip)) {
    test(version, iterateZip(readFileSync(zip)), addContext).then(exit);
    return;
  }
  mkdirSync(dirname(zip), { recursive: true });
  const file = createWriteStream(zip);
  get(getVanillaZipUrl(version), function (response) {
    response.pipe(file);
    file.on('finish', () => {
      file.close();
      test(version, iterateZip(readFileSync(zip)), addContext).then(exit);
    });
  }).on('error', function (err) {
    console.error(err);
    unlinkSync(zip);
  });
}

const addContext = argv.length > 0 && argv[0] === 'context';

//tryLoad('1.18.2', addContext);
tryLoad('1.20.2', addContext);
