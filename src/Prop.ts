import { Schemify } from './types';

class Prop implements Schemify.Prop {
  constructor(
    readonly name: string,
    readonly optional: boolean,
    readonly typeAnnotation: Schemify.PropTypeAnnotation
  ) { }

  public render() {
    return {
      name: this.name,
      optional: this.optional,
      typeAnnotation: this.typeAnnotation,
    };
  }
}

export default Prop;
