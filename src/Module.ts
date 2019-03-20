import { Schema } from './types';

class Module implements Schema.Module {
  private components: {
    [componentName: string]: Schema.Component;
  } = {};

  /**
   * Add a component to the module
   */
  public add(componentName: string, component: Schema.Component): void {
    this.components[componentName] = component;
  }

  public render() {
    return {
      components: this.components,
    };
  }
}

export default Module;
