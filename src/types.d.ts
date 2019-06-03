import { BubblingType } from './CodegenTypes';

type ObjectPropertyType =
  | Readonly<{
    type: 'BooleanTypeAnnotation',
    name: string,
    optional: boolean,
  }>
  | Readonly<{
    type: 'StringTypeAnnotation',
    name: string,
    optional: boolean,
  }>
  | Readonly<{
    type: 'FloatTypeAnnotation',
    name: string,
    optional: boolean,
  }>
  | Readonly<{
    type: 'Int32TypeAnnotation',
    name: string,
    optional: boolean,
  }>
  | Readonly<{
    type: 'ObjectTypeAnnotation',
    name: string,
    optional: boolean,
    properties: ReadonlyArray<ObjectPropertyType>,
  }>;

type ExtendsProps = {
  type: 'ReactNativeBuiltInType';
  knownTypeName: 'ReactNativeCoreViewProps';
}

export declare namespace Schemify {
  interface Printable<T> {
    render: () => T;
  }

  type PropTypeAnnotation = {
    type: string;
    name?: string;
    default?: any;
    optional?: boolean;
    properties?: TypeAnnotation[];
    argument?: TypeAnnotation;
  };

  type EventTypeAnnotation = Readonly<{
    type: 'EventTypeAnnotation';
    argument?: Readonly<{
      type: 'ObjectTypeAnnotation';
      properties: ReadonlyArray<ObjectPropertyType>;
    }>;
  }>;

  type TypeAnnotation = PropTypeAnnotation | EventTypeAnnotation;

  type TypeProperty = {
    type: string;
    name: string;
    optional: boolean;
  };

  interface Event
    extends Printable<{
      name: string,
      bubblingType: BubblingType,
      optional: boolean,
      typeAnnotation: EventTypeAnnotation;
    }> { }

  interface Prop
    extends Printable<{
      name: string;
      optional: boolean;
      typeAnnotation: PropTypeAnnotation;
    }> { }

  interface Component
    extends Printable<{
      extendsProps: Array<ExtendsProps>;
      name: string;
      events: Event[];
      props: Prop[];
    }> { }

  interface Module
    extends Printable<{
      components: {
        [componentName: string]: Component;
      };
    }> { }

  interface Schema
    extends Printable<{
      modules: Readonly<{
        [moduleName: string]: Module;
      }>;
    }> {
    add(moduleName: string, moduleContent: Module): void;
    get(moduleName: string): Module;
  }

  interface CodegenOptions {
    interfaceOnly?: boolean;
    isDeprecatedPaperComponentNameRCT?: boolean;
  }
}
