type WithoutExtention<T> = { [K in keyof T]: T[K] };

export declare namespace Schema {
  interface Printable<T> {
    render: () => T;
  }

  interface Event
    extends Printable<{
      name: string;
      arguments: {
        name: string;
        type: string;
        default: any;
      }[];
    }> {}

  interface Prop
    extends Printable<{
      name: string;
      optional: boolean;
      typeAnnotation: {
        type: string;
        default: any;
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
