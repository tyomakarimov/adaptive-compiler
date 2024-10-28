function multiplyMatrices(size) {
  const matrixA = Array(size * size).fill(1);
  const matrixB = Array(size * size).fill(1);
  const result = Array(size * size).fill(0);

  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      let sum = 0;
      for (let k = 0; k < size; k++) {
        sum += matrixA[i * size + k] * matrixB[k * size + j];
      }
      result[i * size + j] = sum;
    }
  }
  return result;
}

function add(a, b) {
  return a + b;
}

const start = performance.now();
console.log(multiplyMatrices(100));
console.log(add(5, 12));
const end = performance.now();
console.log(`Time: ${(end - start).toFixed(3)}`);
