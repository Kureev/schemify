import Module from './Module';
import { Schemify } from './types';

class Schema implements Schemify.Schema {
  private modules = {};

  /**
   * Add a module to the schema
   */
  public add(moduleName: string, moduleContent: Module) {
    this.modules[moduleName] = moduleContent;
  }

  /**
   * Get a module by name from the schema
   */
  public get(moduleName: string) {
    return this.modules[moduleName];
  }

  public render() {
    return {
      modules: this.modules,
    };
  }
}

export default Schema;
