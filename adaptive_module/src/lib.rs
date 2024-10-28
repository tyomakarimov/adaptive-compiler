use wasm_bindgen::prelude::*;
use wee_alloc::WeeAlloc;

#[global_allocator]
static ALLOC: WeeAlloc = WeeAlloc::INIT;

#[wasm_bindgen]
pub fn add(a: i32, b: i32) -> i32 {
    a + b
}

#[wasm_bindgen]
pub fn factorial(n: u32) -> u32 {
    (1..=n).product()
}

#[wasm_bindgen]
pub fn multiply_matrices(size: usize) -> Vec<i64> {
    let matrix_a = vec![1; size * size];
    let matrix_b = vec![1; size * size];
    let mut result = vec![0; size * size];

    for i in 0..size {
        for j in 0..size {
            let mut sum = 0;
            for k in 0..size {
                sum += matrix_a[i * size + k] * matrix_b[k * size + j];
            }
            result[i * size + j] = sum;
        }
    }
    result
}
