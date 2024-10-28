import { CandidateFunction } from './types';

export interface EnvironmentConditions {
  deviceIsPowerful: boolean;
  networkIsFast: boolean;
}

export const shouldOptimizeWithWasm = (
  candidate: CandidateFunction,
  conditions: EnvironmentConditions
): boolean => {
  const isComplexFunction = candidate.complexityScore > 2;
  const suitableForWasm =
    conditions.deviceIsPowerful && conditions.networkIsFast;
  return isComplexFunction && suitableForWasm;
};
