import { readFileSync, writeFileSync } from 'fs';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';
import { Program } from 'estree';

import { analyzeCode } from './analyzer';
import { shouldOptimizeWithWasm, EnvironmentConditions } from './decisionMaker';
import { CandidateFunction } from './types';
import { replaceFunctionWithWasmCall } from './transformer';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const adaptiveExecution = (
  filePath: string,
  ast: Program,
  conditions: EnvironmentConditions
) => {
  let modifiedCode = readFileSync(resolve(__dirname, filePath), 'utf8');
  const candidates = analyzeCode(ast);
  console.log({ candidates });
  candidates.forEach((candidate: CandidateFunction) => {
    const shouldUseWasm = shouldOptimizeWithWasm(candidate, conditions);

    console.log(
      `Executing ${candidate.name} in ${
        shouldUseWasm ? 'WebAssembly' : 'JavaScript'
      }`
    );

    if (shouldUseWasm) {
      modifiedCode = replaceFunctionWithWasmCall(modifiedCode, candidate);
    }
  });

  writeFileSync(resolve(__dirname, '../output.js'), modifiedCode, 'utf8');
  console.log('Modified code written to output.js');
};
