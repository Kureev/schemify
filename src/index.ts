import * as ts from 'typescript';
import Schema from './Schema';
import Module from './Module';
import Prop from './Prop';
import Event from './Event';
import Component from './Component';

export default class Transpiler {
  private program: ts.Program;
  private checker: ts.TypeChecker;
  /**
   * Type of the NativeComponent<T>
   */
  private LOOKUP_TYPE_NAME = 'NativeComponent';
  /**
   * Reference to the TypeNode that retains information about the type
   */
  private componentName: string = null;
  private componentType: ts.TypeNode = null;
  /**
   * A variable statement consists of variable declaration
   * and optional type declaration. That said, we are looking for
   * a type declaration (TypeNode) so we can derive information
   * about the type or interface that user passed to NativeModule
   * generic. For example, NativeModule<Props> where Props
   * is a type literal (or an interface) that we will use to
   * generate a React Native Schema.
   */
  private visitDeclarationListNode(declaration: ts.VariableDeclaration): void {
    if (ts.isTypeNode(declaration.type)) {
      const typeNode = <ts.TypeNode>declaration.type;
      const type: ts.Type = this.checker.getTypeFromTypeNode(typeNode);
      const symbol: ts.Symbol = type.getSymbol();

      /**
       * Sometimes, symbols might not exist. This will happen in a case
       * when user specifies a generic that doesn't exist.
       */
      if (symbol != null && symbol.getName() === this.LOOKUP_TYPE_NAME) {
        /**
         * This tool currently doesn't support multiple module definitions
         * in one file. In order to prevent unexpected override, throw
         * an error to notify user about the issue.
         *
         * @todo Write a more exhaustive error message before the release
         */
        if (this.componentType != null) {
          throw Error(
            'We only support one Native Component declaration per file'
          );
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
        this.componentType = <ts.TypeNode>typeNode.getChildAt(2).getChildAt(0);
        /**
         * Along with the reference to component type, we need to pull
         * a component name that will be used in the schema
         */
        this.componentName = declaration.name.getText();
      }
    }
  }

  /**
   * A helper visitor function that checks for VariableStatements and
   * iterates over declarationList in order to find one with a sought-for type
   */
  private visitSourceFile(node: ts.Node): void {
    if (ts.isVariableStatement(node)) {
      const variableStatement: ts.VariableStatement = node;
      variableStatement.declarationList.forEachChild(
        (declarationNode: ts.VariableDeclaration) =>
          this.visitDeclarationListNode(declarationNode)
      );
    }
  }

  /**
   * Returns a boolean that indicates if given name:type pair
   * represents an event. Under the hood, it uses pattern matching
   * for the name an isFunctionTypeNode valudation for the type.
   */
  private isEvent(propertyName: string, type: ts.Type) {
    return (
      propertyName.match(/on[A-Z]/) != null &&
      ts.isFunctionTypeNode(this.checker.typeToTypeNode(type))
    );
  }

  /**
   * Maps TypeScript types to the Schema types that RN will understand
   */
  private getPropertyTypeAnnotation(type: ts.Type): string {
    switch (this.checker.typeToString(type)) {
      case 'boolean':
        return 'BooleanTypeAnnotation';
      case 'number':
        return 'FloatTypeAnnotation';
      default:
        if (!ts.isFunctionTypeNode(this.checker.typeToTypeNode(type))) {
          throw Error(
            'Unknown type encountered in a type annotation for an event'
          );
        }
    }
  }

  constructor(filename: string) {
    this.program = ts.createProgram([filename], {
      noEmitOnError: true,
      noImplicitAny: true,
      target: ts.ScriptTarget.ES5,
    });
    this.checker = this.program.getTypeChecker();
  }

  /**
   * Finds a TypeNode with a sought-for type (NativeComponent<T> by default)
   */
  private findNativeModuleTypeNode(): [string, ts.TypeNode] {
    if (this.componentType != null) {
      return;
    }

    for (let sourceFile of this.program.getSourceFiles()) {
      if (!sourceFile.isDeclarationFile) {
        sourceFile.forEachChild((sourceFile: ts.SourceFile) =>
          this.visitSourceFile(sourceFile)
        );
      }
    }

    if (this.componentType == null) {
      throw Error(`Can't find a NativeModule<T> type in the given file`);
    }

    return [this.componentName, this.componentType];
  }

  /**
   * Takes a TypeNode as an argument and returns a Schema instance.
   * Inside, it iterates over every type member and converts it to a
   * property or an event.
   */
  public getSchema(): string {
    const [componentName, typeNode] = this.findNativeModuleTypeNode();
    const schema = new Schema();
    const mod = new Module();
    const component = new Component(componentName, [], []);

    const symbol = this.checker.getTypeAtLocation(typeNode).getSymbol();
    if (symbol == null) {
      throw Error(
        `Something went wrong, type at (${typeNode.getStart() +
          typeNode.getEnd()}) wasn't found`
      );
    }

    symbol.members.forEach((value, key) => {
      const type = this.checker.getTypeOfSymbolAtLocation(value, typeNode);
      const isOptional = true;
      if (this.isEvent(value.getName(), type)) {
        const event = new Event(value.getName(), isOptional, {
          type: 'EventTypeAnnotation',
        });
        component.addEvent(event);
      } else {
        const prop = new Prop(value.getName(), isOptional, {
          type: this.getPropertyTypeAnnotation(type),
        });
        component.addProp(prop);
      }
    });

    mod.add(componentName, component);
    schema.add(Schema.genName(this.componentName), mod);

    return JSON.stringify(schema.render());
  }
}
