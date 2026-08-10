import { mkdirSync, readFileSync } from "node:fs";

import AdmZip from "adm-zip";

/**
 * @typedef {{
 *   version: string,
 *   background: { scripts: string[], service_worker: string, type: string },
 *   browser_specific_settings: unknown,
 * }} Manifest
 */

/** @type {Manifest} */
const baseManifest = JSON.parse(readFileSync("src/manifest.json", "utf-8"));
const { version } = baseManifest;

const targets = {
  /** @param {Manifest} manifest */
  chrome: (manifest) => ({
    ...manifest,
    browser_specific_settings: undefined,
    background: {
      service_worker: manifest.background.service_worker,
      type: manifest.background.type,
    },
  }),
  /** @param {Manifest} manifest */
  firefox: (manifest) => ({
    ...manifest,
    background: {
      scripts: manifest.background.scripts,
      type: manifest.background.type,
    },
  }),
};

mkdirSync("dist", { recursive: true });

for (const [target, buildManifest] of Object.entries(targets)) {
  const manifest = buildManifest(baseManifest);
  const zip = new AdmZip();
  zip.addLocalFolder("src", "", (entry) => entry !== "manifest.json");
  zip.addFile(
    "manifest.json",
    Buffer.from(JSON.stringify(manifest, null, 2) + "\n"),
  );
  zip.writeZip(`dist/x-vertical-video-blocker-${version}-${target}.zip`);
}
