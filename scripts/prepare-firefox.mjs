import { readFile, writeFile, mkdir, copyFile, rm } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = fileURLToPath(new URL('../', import.meta.url));
const version = process.argv[2] || '1.1.2';
// A conservative version subset accepted by Firefox and AMO.
if (!/^(0|[1-9]\d{0,4})(\.(0|[1-9]\d{0,4})){0,3}$/.test(version) ||
    version.split('.').some(part => Number(part) > 65535)) {
  throw new Error('Version must contain 1–4 numbers from 0 to 65535, separated by dots.');
}
const manifest = JSON.parse(await readFile(path.join(root, 'manifest.json'), 'utf8'));
manifest.name = 'Google Translate Eraser';
manifest.version = version;
manifest.browser_specific_settings = {
  gecko: {
    id: 'google-translate-eraser@tobiko-dev',
    strict_min_version: '140.0',
    data_collection_permissions: { required: ['none'] }
  },
  gecko_android: { strict_min_version: '142.0' }
};
const destination = path.join(root, 'dist', 'firefox');
await rm(destination, { recursive: true, force: true });
await mkdir(destination, { recursive: true });
// Explicit allowlist: screenshots, downloads, docs and credentials are never packaged.
for (const filename of ['content.js', 'content.css']) {
  await copyFile(path.join(root, filename), path.join(destination, filename));
}
await writeFile(path.join(destination, 'manifest.json'), JSON.stringify(manifest, null, 2) + '\n');
console.log(`Prepared Firefox ${version}: ${destination}`);
