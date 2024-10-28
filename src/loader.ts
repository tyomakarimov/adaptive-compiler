import * as fs from 'fs';
import * as path from 'path';
import * as esprima from 'esprima';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export type ASTNode = esprima.Program;

export const loadAndParseFile = (filePath: string): ASTNode => {
  try {
    console.log;
    const code = fs.readFileSync(path.resolve(__dirname, filePath), 'utf8');
    const ast: ASTNode = esprima.parseScript(code, { loc: true });
    console.log('AST successfully generated.');
    return ast;
  } catch (error) {
    console.error(`Error loading or parsing file ${filePath}:`, error);
    throw error;
  }
};
