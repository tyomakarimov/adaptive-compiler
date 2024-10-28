import {
  Node,
  FunctionDeclaration,
  FunctionExpression,
  Program,
  ArrowFunctionExpression,
} from 'estree';

import { CandidateFunction } from './types';

const traverseAST = (node: Node, callback: (node: Node) => void) => {
  callback(node);
  for (const key in node) {
    const child = (node as any)[key];
    if (Array.isArray(child)) {
      child.forEach(n => {
        if (n && typeof n.type === 'string') {
          traverseAST(n as Node, callback);
        }
      });
    } else if (child && typeof child.type === 'string') {
      traverseAST(child as Node, callback);
    }
  }
};

const calculateComplexity = (
  node: FunctionDeclaration | FunctionExpression | ArrowFunctionExpression
): number => {
  let score = 0;

  traverseAST(node, subNode => {
    if (subNode.type === 'ForStatement' || subNode.type === 'WhileStatement') {
      score += 1;
    }

    if (
      subNode.type === 'BinaryExpression' &&
      ['+', '-', '*', '/'].includes(subNode.operator)
    ) {
      score += 0.5;
    }

    if (
      subNode.type === 'CallExpression' &&
      subNode.callee.type === 'MemberExpression' &&
      subNode.callee.property.type === 'Identifier' &&
      subNode.callee.property.name === 'map'
    ) {
      score += 0.5;
    }
  });

  return score;
};

export const analyzeCode = (ast: Program): CandidateFunction[] => {
  const candidates: CandidateFunction[] = [];
  traverseAST(ast, node => {
    if (
      node.type === 'FunctionDeclaration' ||
      node.type === 'FunctionExpression' ||
      node.type === 'ArrowFunctionExpression'
    ) {
      const complexityScore = calculateComplexity(node);

      if (complexityScore > 1) {
        candidates.push({
          name:
            node.type === 'FunctionDeclaration' && node.id
              ? node.id.name
              : 'anonymous',
          loc: node.loc || null,
          complexityScore,
        });
      }
    }
  });
  return candidates;
};
