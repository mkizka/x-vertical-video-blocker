import { mkdirSync, readFileSync } from "node:fs";

import AdmZip from "adm-zip";

const baseManifest = JSON.parse(readFileSync("src/manifest.json", "utf-8"));
const { version } = baseManifest;

const targets = {
  chrome: (manifest) => {
    const result = { ...manifest };
    delete result.browser_specific_settings;
    result.background = {
      service_worker: manifest.background.service_worker,
      type: manifest.background.type,
    };
    return result;
  },
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
