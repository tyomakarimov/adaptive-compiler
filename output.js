import * as wasmModule from './adaptive_module/pkg/adaptive_module';
await wasmModule.default();
function multiplyMatrices(...args) {
  return wasmModule.multiply_matrices(...args);
}
function add(a, b) {
  return a + b;
}
const start = performance.now();
console.log(multiplyMatrices(100));
console.log(add(5, 12));
const end = performance.now();
console.log(`Time: ${(end - start).toFixed(3)}`);
