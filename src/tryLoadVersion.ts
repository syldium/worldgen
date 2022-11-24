import { strFromU8, Unzipped, unzipSync } from 'fflate';
import {
  createWriteStream,
  existsSync,
  mkdirSync,
  readFileSync,
  unlinkSync
} from 'fs';
import { get } from 'https';
import { dirname, join as joinPath } from 'path';
import { argv, exit } from 'process';
import type { GameVersion } from './main/context/GameVersion';
import { ErrorCollector, ValidationContext } from './main/model/node/Node';
import { RegistryHolder } from './main/model/Registry';
import { getVanillaZipUrl } from './main/util/FetchHelper';
import { findNamespacedKeyAndRegistry } from './main/util/PathHelper';

interface TestConfig {
  addContentContext?: boolean;
  reportUnknownKeys?: boolean;
}

async function test(
  version: GameVersion,
  unzipped: Unzipped,
  config: TestConfig
): Promise<number> {
  const holder = await RegistryHolder.create(version);

  let errorsCount = 0;
  let checkedFiles = 0;

  const ctx: ValidationContext = {
    holder,
    ignoreKeys: config.reportUnknownKeys ? new Set<string>() : undefined
  };
  for (const [path, content] of Object.entries(unzipped)) {
    const match = findNamespacedKeyAndRegistry(
      joinPath('data', 'minecraft', path)
    );
    if (!match) {
      continue;
    }
    const registryType = match[2];
    if (!holder.isWorldgen(registryType)) {
      continue;
    }
    const model = JSON.parse(strFromU8(content));
    const errors = new ErrorCollector();
    holder.worldgen[registryType].model.node.validate(
      '',
      model,
      errors,
      ctx
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

function tryLoad(version: GameVersion, config: TestConfig) {
  const zip = joinPath('work', version, 'vanilla_worldgen.zip');
  if (existsSync(zip)) {
    test(version, unzipSync(readFileSync(zip)), config).then(exit);
    return;
  }
  mkdirSync(dirname(zip), { recursive: true });
  const file = createWriteStream(zip);
  get(getVanillaZipUrl(version), function (response) {
    response.pipe(file);
    file.on('finish', () => {
      file.close();
      test(version, unzipSync(readFileSync(zip)), config).then(exit);
    });
  }).on('error', function (err) {
    console.error(err);
    unlinkSync(zip);
  });
}

const addContext = argv.length > 0 && argv[0] === 'context';

//tryLoad('1.18.2', addContext);
tryLoad('1.19', { reportUnknownKeys: true });
