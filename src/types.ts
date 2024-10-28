import { SourceLocation } from 'estree';

export interface CandidateFunction {
  name: string;
  loc: SourceLocation | null;
  complexityScore: number;
}
