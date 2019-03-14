import * as ts from 'typescript';

export function findNativeModuleTypeNode(
  program: ts.Program,
  checker: ts.TypeChecker
): ts.TypeNode | null {
  const LOOKUP_TYPE_NAME = 'NativeComponent';
  const ERR_DUPLICATION =
    'We only support one Native Component declaration per file';

  let node = null;

  /**
   * A variable statement consists of variable declaration
   * and optional type declaration. That said, we are looking for
   * a type declaration (TypeNode) so we can derive information
   * about the type or interface that user passed to NativeModule
   * generic. For example, NativeModule<Props> where Props
   * is a type literal (or an interface) that we will use to
   * generate a React Native Schema.
   */
  function visitDeclarationListNode(declaration: ts.VariableDeclaration) {
    if (ts.isTypeNode(declaration.type)) {
      const typeNode = <ts.TypeNode>declaration.type;
      const type: ts.Type = checker.getTypeFromTypeNode(typeNode);
      const symbol: ts.Symbol = type.getSymbol();

      /**
       * Sometimes, symbols might not exist. This will happen in a case
       * when user specifies a generic that doesn't exist.
       */
      if (symbol != null && symbol.getName() === LOOKUP_TYPE_NAME) {
        /**
         * This tool currently doesn't support multiple module definitions
         * in one file. In order to prevent unexpected override, throw
         * an error to notify user about the issue.
         *
         * @todo Write a more exhaustive error message before the release
         */
        if (node != null) {
          throw Error(ERR_DUPLICATION);
        }

        /**
         * This is a hacky way to get the first type argument.
         * In our case, we are dealing with NativeComponent<Props>
         * signature that implies a single argument with no variety.
         *
         * If you know a better way to get type parameters (generics),
         * please make sure to tell me so I can replace this bit with
         * a more elegant solution ;)
         */
        node = <ts.TypeNode>typeNode.getChildAt(2).getChildAt(0);
      }
    }
  }

  function visitSourceFile(node: ts.Node): void {
    if (ts.isVariableStatement(node)) {
      node.declarationList.forEachChild(visitDeclarationListNode);
    }
  }

  for (let sourceFile of program.getSourceFiles()) {
    if (!sourceFile.isDeclarationFile) {
      sourceFile.forEachChild(visitSourceFile);
    }
  }

  return node;
}
