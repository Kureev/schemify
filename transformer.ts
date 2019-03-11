import * as ts from 'typescript';
import visitors from './visitors';

const transformer = <T extends ts.Node>(context: ts.TransformationContext) => (
  rootNode: T
) => {
  function visit(node: ts.Node): ts.Node {
    let res: string;
    if (visitors[ts.SyntaxKind[node.kind]] != undefined) {
      res = visitors[ts.SyntaxKind[node.kind]](node);
    } else {
      res = ts.SyntaxKind[node.kind];
    }

    console.log('Visiting ' + res);
    return ts.visitEachChild(node, visit, context);
  }
  return ts.visitNode(rootNode, visit);
};

export default transformer;
