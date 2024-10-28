import { readFileSync } from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

import { loadAndParseFile } from './src/loader';
import { adaptiveExecution } from './src/compiler';
import init from './adaptive_module/pkg/adaptive_module';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const conditions = {
  deviceIsPowerful: true,
  networkIsFast: true,
};

const initWasm = async () => {
  const wasmPath = path.resolve(
    __dirname,
    './adaptive_module/pkg/adaptive_module_bg.wasm'
  );
  const wasmBytes = readFileSync(wasmPath);
  await init(wasmBytes);
};

(async () => {
  await initWasm();
  const ast = loadAndParseFile('../test.js');
  adaptiveExecution('../test.js', ast, conditions);
})();
