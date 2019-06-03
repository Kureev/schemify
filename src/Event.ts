import { Schemify } from './types';
import { BubblingType } from './CodegenTypes';

class Event implements Schemify.Event {
  constructor(
    readonly name: string,
    readonly optional: boolean,
    readonly bubblingType: BubblingType,
    readonly typeAnnotation: Schemify.EventTypeAnnotation
  ) {
    this.typeAnnotation = {
      ...this.typeAnnotation,
      type: 'EventTypeAnnotation',
    };
  }

  public render() {
    return {
      name: this.name,
      optional: this.optional,
      bubblingType: this.bubblingType,
      typeAnnotation: this.typeAnnotation,
    };
  }
}

export default Event;
