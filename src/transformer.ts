import { parseScript } from 'esprima';
import { attachComments, generate } from 'escodegen';

import { camelToSnakeCase } from './helpers/camelToSnakeCase';
import { CandidateFunction } from './types';
import { Node } from 'estree';
import { ASTNode } from './loader';

const findAndReplaceFunctionNode = (
  node: Node,
  functionName: string,
  wasmFunctionName: string
) => {
  if (node.type === 'FunctionDeclaration' && node.id?.name === functionName) {
    node.body = {
      type: 'BlockStatement',
      body: [
        {
          type: 'ReturnStatement',
          argument: {
            type: 'CallExpression',
            callee: {
              type: 'MemberExpression',
              object: { type: 'Identifier', name: 'wasmModule' },
              property: { type: 'Identifier', name: wasmFunctionName },
              computed: false,
              optional: false,
            },
            arguments: [
              {
                type: 'SpreadElement',
                argument: { type: 'Identifier', name: 'args' },
              },
            ],
            optional: false,
          },
        },
      ],
    };

    node.params = [
      { type: 'RestElement', argument: { type: 'Identifier', name: 'args' } },
    ];
    return node;
  }

  for (const key in node) {
    if (node[key] && typeof node[key] === 'object') {
      const result = findAndReplaceFunctionNode(
        node[key],
        functionName,
        wasmFunctionName
      );
      if (result) return result;
    }
  }
  return null;
};

export const replaceFunctionWithWasmCall = (
  sourceCode: string,
  candidate: CandidateFunction
): string => {
  const functionName = candidate.name;
  const wasmFunctionName = camelToSnakeCase(functionName);

  const ast: ASTNode = parseScript(sourceCode, {
    loc: true,
    range: true,
    tokens: true,
    comment: true,
  });

  const modifiedAst = attachComments(ast, ast.comments, ast.tokens);
  const targetNode = findAndReplaceFunctionNode(
    modifiedAst,
    functionName,
    wasmFunctionName
  );

  if (targetNode) {
    let modifiedCode = generate(modifiedAst);

    const importCode =
      "import * as wasmModule from './adaptive_module/pkg/adaptive_module';";

    const initializationCode = 'await wasmModule.default();';

    if (!modifiedCode.includes(importCode)) {
      modifiedCode =
        importCode + '\n' + initializationCode + '\n' + modifiedCode;
    }

    return modifiedCode;
  } else {
    throw new Error(`Function ${functionName} not found in the code.`);
  }
};
