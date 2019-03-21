export declare namespace Schema {
  interface Printable<T> {
    render: () => T;
  }

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
      typeAnnotation: {
        type: string;
      };
    }> {}

  interface Prop
    extends Printable<{
      name: string;
      optional: boolean;
      typeAnnotation: {
        type: string;
        default?: any;
      };
    }> {}

  interface Component
    extends Printable<{
      extendedProps: {
        type: 'ReactNativeBuiltInType';
        knownTypeName: 'ReactNativeCoreViewProps';
      };
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
