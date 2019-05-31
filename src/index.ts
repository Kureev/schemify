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
type NativeModule = [string, ts.TypeNode, ts.TypeNode];

const types = {
  string: 'StringTypeAnnotation',
  boolean: 'BooleanTypeAnnotation',
  number: 'FloatTypeAnnotation',
};

export default class Transpiler {
  private program: ts.Program;
  private sourceFile: ts.SourceFile;
  private checker: ts.TypeChecker;
  /**
   * Type of the CodegenNativeComponent<ComponentName, Props, Options = {}>
   */
  private LOOKUP_TYPE_NAME = 'CodegenNativeComponent';
  /**
   * A variable statement consists of variable declaration
   * and optional type declaration. That said, we are looking for
   * a type declaration (TypeNode) so we can derive information
   * about the type or interface that user passed to NativeModule
   * generic.
   */
  private findComponentDeclarationWithLookupType(
    declaration: ts.VariableDeclaration
  ): NativeModule | null {
    if (ts.isTypeNode(declaration.type)) {
      const typeNode: ts.TypeNode = declaration.type;
      const typeName = typeNode.getFirstToken().getText();

      if (typeName === this.LOOKUP_TYPE_NAME) {
        const genericParams = typeNode.getChildAt(2);
        const componentName = genericParams.getChildAt(0).getText();
        const componentProps = <ts.TypeNode>genericParams.getChildAt(2);
        const codegenOptions = <ts.TypeNode>genericParams.getChildAt(4);

        console.log(codegenOptions);

        // return;
        return [componentName, componentProps, codegenOptions];
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
   *
   * There are few limitations:
   * - Recursion A -> B -> A or A -> A isn't supported
   * - Unions and intersections are not supported
   *
   * Simply put: any kind of weird shit is not supported. Be simple.
   */
  private getTypeAnnotation(type: ts.Type): Schemify.TypeAnnotation {
    /**
     * If type is one of the JS primitives (string, boolean, number),
     * return a "standard" object with a single "type" field taken
     * from the mapping dictionary
     */
    if (types[this.checker.typeToString(type)]) {
      return {
        type: types[this.checker.typeToString(type)],
      };
    }

    const typeNode: ts.TypeNode = this.checker.typeToTypeNode(type);
    if (ts.isFunctionTypeNode(typeNode)) {
      let argument: Schemify.PropTypeAnnotation;
      this.checker
        .getSignaturesOfType(type, ts.SignatureKind.Call)
        /**
         * At this moment, react-native doesn't support more than one argument
         * (Event) passed back from the native side, however the implementation
         * I wrote was designed to support multiple parameters (just in case).
         *
         * That said, I assume the "getParameters" to always return an array
         * of one element (unless the schema in react-native is changed).
         * Otherwise, the latter one will override the first one
         */
        .forEach(signature => {
          signature.getParameters().forEach(parameter => {
            const type = this.checker.getTypeOfSymbolAtLocation(
              parameter,
              parameter.valueDeclaration
            );
            argument = this.getTypeAnnotation(type);
          });
        });
      return {
        type: 'FunctionTypeAnnotation',
        argument,
      };
    }
    /**
     * If it's a type reference, things getting more complicated.
     * Currently, we recursively unwrap type annotations and for an
     * object that contains nested types.
     *
     * However, I didn't implement circle references yet.
     * Basically, if A has B where B has A, it'll lead to infinite
     * loop and therefore, maximum call stack size exception.
     * Probably, the best way to handle it would be to improve type
     * definition of Schemify.PropTypeAnnotation and make "properties"
     * lazy using typescript getters.
     *
     * Unless then, recursive properties are not supported.
     */
    if (ts.isTypeReferenceNode(typeNode)) {
      const properties: Schemify.PropTypeAnnotation[] = [];
      this.checker.getPropertiesOfType(type).forEach(property => {
        const type = this.checker.getTypeOfSymbolAtLocation(
          property,
          property.valueDeclaration
        );

        const parameterDeclaration = <ts.ParameterDeclaration>(
          property.valueDeclaration
        );
        const isOptional = this.checker.isOptionalParameter(
          parameterDeclaration
        );

        const annotation = this.getTypeAnnotation(type);
        const prop: Schemify.PropTypeAnnotation = {
          name: property.getName(),
          type: annotation.type,
          optional: isOptional,
        };
        if (annotation.properties != null) {
          prop.properties = annotation.properties;
        }
        properties.push(prop);
      });

      return {
        type: 'ObjectTypeAnnotation',
        name: this.checker.typeToString(type),
        properties,
      };
    }

    /**
     * If you're looking for a good place to add handling for
     * union or intersection types, this is it.
     */

    console.error("This type  annotation isn't supported yet");
  }

  constructor(readonly filenames: Array<string>) {
    this.program = ts.createProgram(filenames, {
      noEmitOnError: true,
      noImplicitAny: true,
      target: ts.ScriptTarget.ES5,
    });
  }

  /**
   * Searches for a TypeNode with a search-for type
   * CodegenNativeComponent<ComponentName, Props, Options = {}>
   */
  private findNativeModules(): NativeModule[] {
    const nativeModules = [];

    this.program.getRootFileNames().forEach(filename => {
      this.sourceFile = this.program.getSourceFile(filename);
      this.checker = this.program.getTypeChecker();
      /**
       * We are looking for variable statements with a lookup type.
       * Once found, add them to the nativeModules array so we can
       * iterate over them later (and generate corresponding schema)
       */
      this.sourceFile.forEachChild((node: ts.Node) => {
        if (ts.isVariableStatement(node)) {
          const variableStatement: ts.VariableStatement = node;
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
    });

    return nativeModules;
  }

  private getComponent(nativeModule: NativeModule): Component {
    /**
     * We currently don't support multiple modules inside one file
     */
    const [componentName, componentProps] = nativeModule;
    const component = new Component(componentName, [], []);
    const symbol = <ts.Symbol>(
      this.checker.getTypeAtLocation(componentProps).getSymbol()
    );

    symbol.members.forEach((value, key) => {
      const type = this.checker.getTypeOfSymbolAtLocation(
        value,
        componentProps
      );
      const parameterDeclaration = <ts.ParameterDeclaration>(
        value.valueDeclaration
      );
      const isOptional = this.checker.isOptionalParameter(parameterDeclaration);
      if (this.isEvent(value.getName(), type)) {
        /**
         * Handling Events
         */
        const typeAnnotation = <Schemify.EventTypeAnnotation>(
          this.getTypeAnnotation(type)
        );
        const event = new Event(value.getName(), isOptional, typeAnnotation);
        component.addEvent(event);
      } else {
        /**
         * Handling Props
         */
        const typeAnnotation = <Schemify.PropTypeAnnotation>(
          this.getTypeAnnotation(type)
        );
        const prop = new Prop(value.getName(), isOptional, typeAnnotation);
        component.addProp(prop);
      }
    });

    return component;
  }

  /**
   * Takes a TypeNode as an argument and returns a Schema instance.
   * Inside, it iterates over every type member and converts it to a
   * property or an event.
   */
  public getSchema(): Object {
    const nativeModules: NativeModule[] = this.findNativeModules();
    if (nativeModules.length === 0) {
      return {};
    }
    const schema = new Schema();

    nativeModules.map((nativeModule: NativeModule) => {
      const component: Component = this.getComponent(nativeModule);
      const mod = new Module();
      const componentName = nativeModule[0];
      mod.add(componentName, component);
      schema.add(componentName, mod);
    });

    return schema.render();
  }
}
