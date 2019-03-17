import { slashJoin, removeExtension } from './path';
import { resolve, relative } from 'path';
import { getIconId } from './icon-id';

export interface IconAsset {
  id: string;
  absolutePath: string;
  relativePath: string;
}

export interface AssetsMap {
  [key: string]: IconAsset;
}

import * as glob from 'glob';

export const ASSETS_EXTENSION = 'svg';

export const loadPaths = (dir: string): Promise<string[]> =>
  new Promise((resolve, reject) => {
    const globPath = slashJoin(dir, `**/*.${ASSETS_EXTENSION}`);

    glob(globPath, {}, (err, files) => {
      if (err) {
        return reject(err);
      }

      if (!files.length) {
        return reject(new Error(`No SVGs found in ${dir}`));
      }

      resolve(files);
    });
  });

export const loadAssets = async (dir: string): Promise<AssetsMap> => {
  const paths = await loadPaths(dir);
  const out = {};

  for (const path of paths) {
    const iconId = getIconId(path, dir);

    out[iconId] = {
      id: iconId,
      absolutePath: resolve(path),
      relativePath: relative(resolve(dir), resolve(path))
    };
  }

  return out;
};