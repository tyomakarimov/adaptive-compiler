import { camelToSnakeCase } from './helpers/camelToSnakeCase';
import { CandidateFunction } from './types';
import * as wasmModule from '../adaptive_module/pkg/adaptive_module';

export const executeInWasm = (
  candidate: CandidateFunction,
  args: any[] = []
) => {
  console.log(`Running ${candidate.name} in WebAssembly...`);
  const wasmFunction = wasmModule[camelToSnakeCase(candidate.name)];
  if (wasmFunction) {
    return wasmFunction(...args);
  } else {
    throw new Error(
      `Function ${candidate.name} not found in WebAssembly module`
    );
  }
};

export const executeInJs = (candidate: CandidateFunction) => {
  console.log(`Running ${candidate.name} in JavaScript...`);
};
