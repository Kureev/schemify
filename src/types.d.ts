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

  type EventTypeAnnotation = {
    type: 'EventTypeAnnotation';
    bubblingType: 'bubble';
    name?: string;
    default?: any;
    optional?: boolean;
    properties?: TypeAnnotation[];
    argument?: TypeAnnotation;
  };

  type TypeAnnotation = PropTypeAnnotation | EventTypeAnnotation;

  type TypeProperty = {
    type: string;
    name: string;
    optional: boolean;
  };

  interface Event
    extends Printable<{
      name: string;
      optional: boolean;
      bubblingType: string;
      typeAnnotation: Schemify.EventTypeAnnotation;
    }> {}

  interface Prop
    extends Printable<{
      name: string;
      optional: boolean;
      typeAnnotation: Schemify.PropTypeAnnotation;
    }> {}

  interface Component
    extends Printable<{
      extendsProps: Array<{
        type: 'ReactNativeBuiltInType';
        knownTypeName: 'ReactNativeCoreViewProps';
      }>;
      name: string;
      events: Event[];
      props: Prop[];
    }> {}

  interface Module
    extends Printable<{
      components: {
        [componentName: string]: Component;
      };
    }> {}

  interface Schema
    extends Printable<{
      modules: {
        [moduleName: string]: Module;
      };
    }> {
    add(moduleName: string, moduleContent: Module): void;
    get(moduleName: string): Module;
  }
}
