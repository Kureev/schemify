import * as ts from 'typescript';
import Schema from './Schema';
import Module from './Module';
import Prop from './Prop';
import Event from './Event';
import Component from './Component';

import { Schemify } from './types';

/**
 * First parameter is a component name, second one is a component type
 */
type NativeModule = [string, ts.TypeNode];

export default class Transpiler {
  private program: ts.Program;
  private checker: ts.TypeChecker;
  /**
   * Type of the NativeComponent<T>
   */
  private LOOKUP_TYPE_NAME = 'NativeComponent';
  /**
   * A variable statement consists of variable declaration
   * and optional type declaration. That said, we are looking for
   * a type declaration (TypeNode) so we can derive information
   * about the type or interface that user passed to NativeModule
   * generic. For example, NativeModule<Props> where Props
   * is a type literal (or an interface) that we will use to
   * generate a React Native Schema.
   */
  private findComponentDeclarationWithLookupType(
    declaration: ts.VariableDeclaration
  ): NativeModule | null {
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
         * This is a hacky way to get the first type argument.
         * In our case, we are dealing with NativeComponent<Props>
         * signature that implies a single argument with no variety.
         *
         * If you know a better way to get type parameters (generics),
         * please make sure to tell me so I can replace this bit with
         * a more elegant solution ;)
         */
        const componentType = <ts.TypeNode>typeNode.getChildAt(2).getChildAt(0);
        /**
         * Along with the reference to component type, we need to pull
         * a component name that will be used in the schema
         */
        const componentName = declaration.name.getText();

        return [componentName, componentType];
      }

      return null;
    }
  }

  /**
   * Returns a boolean that indicates if given name:type pair
   * represents an event. Under the hood, it uses pattern matching
   * for the name an isFunctionTypeNode valudation for the type.
   */
  private isEvent(propertyName: string, type: ts.Type): boolean {
    return (
      propertyName.match(/on[A-Z]/) != null &&
      ts.isFunctionTypeNode(this.checker.typeToTypeNode(type))
    );
  }

  /**
   * Maps TypeScript types to the Schema types that RN will understand
   */
  private getTypeAnnotation(type: ts.Type): Schemify.TypeAnnotation {
    switch (this.checker.typeToString(type)) {
      case 'boolean':
        return {
          type: 'BooleanTypeAnnotation',
        };
      case 'number':
        return {
          type: 'FloatTypeAnnotation',
        };
      default:
        if (ts.isFunctionTypeNode(this.checker.typeToTypeNode(type))) {
          return {
            type: 'FunctionTypeAnnotation',
          };
        }
        if (ts.isTypeReferenceNode(this.checker.typeToTypeNode(type))) {
          return {
            type: 'TypeReferenceAnnotation',
          };
        }
        console.error("I don't know this type annotation");
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
  private findNativeModules(): NativeModule[] {
    const nativeModules = [];

    for (let sourceFile of this.program.getSourceFiles()) {
      if (!sourceFile.isDeclarationFile) {
        sourceFile.forEachChild((sourceFile: ts.SourceFile) => {
          if (ts.isVariableStatement(sourceFile)) {
            const variableStatement: ts.VariableStatement = sourceFile;
            variableStatement.declarationList.forEachChild(
              (declarationNode: ts.VariableDeclaration) => {
                const componentDeclaration = this.findComponentDeclarationWithLookupType(
                  declarationNode
                );

                if (componentDeclaration != null) {
                  const [componentName, componentType] = componentDeclaration;
                  nativeModules.push([componentName, componentType]);
                }
              }
            );
          }
        });
      }
    }

    return nativeModules;
  }

  /**
   * Takes a TypeNode as an argument and returns a Schema instance.
   * Inside, it iterates over every type member and converts it to a
   * property or an event.
   */
  public getSchema(): Object {
    const modules = this.findNativeModules();
    if (modules.length === 0) {
      return {};
    }
    const schema = new Schema();
    const mod = new Module();

    // TODO: We currently don't support multiple modules inside one file
    const [componentName, componentType] = modules[0];
    const component = new Component(componentName, [], []);
    const symbol = <ts.Symbol>(
      this.checker.getTypeAtLocation(componentType).getSymbol()
    );

    symbol.members.forEach((value, key) => {
      const type = this.checker.getTypeOfSymbolAtLocation(value, componentType);
      const isOptional = true;
      if (this.isEvent(value.getName(), type)) {
        const typeAnnotation = <Schemify.EventTypeAnnotation>(
          this.getTypeAnnotation(type)
        );
        const event = new Event(value.getName(), isOptional, typeAnnotation);
        component.addEvent(event);
      } else {
        const typeAnnotation = <Schemify.PropTypeAnnotation>(
          this.getTypeAnnotation(type)
        );
        const prop = new Prop(value.getName(), isOptional, typeAnnotation);
        component.addProp(prop);
      }
    });

    mod.add(componentName, component);
    schema.add(Schema.genName(componentName), mod);

    return schema.render();
  }
}
