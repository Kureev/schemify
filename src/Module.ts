import { Schemify } from './types';

class Module implements Schemify.Module {
  private components: {
    [componentName: string]: Schemify.Component;
  } = {};

  /**
   * Add a component to the module
   */
  public add(componentName: string, component: Schemify.Component): void {
    this.components[componentName] = component;
  }

  public render() {
    return {
      components: this.components,
    };
  }
}

export default Module;
