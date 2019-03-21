import { Schema } from './types';

class Prop implements Schema.Prop {
  constructor(
    readonly name: string,
    readonly optional: boolean,
    readonly typeAnnotation: {
      type: string;
      default?: boolean;
    }
  ) {}

  public render() {
    return {
      name: this.name,
      optional: this.optional,
      typeAnnotation: this.typeAnnotation,
    };
  }
}

export default Prop;
