import { Schemify } from './types';

class Event implements Schemify.Event {
  constructor(
    readonly name: string,
    readonly optional: boolean,
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
      bubblingType: 'bubble',
      typeAnnotation: this.typeAnnotation,
    };
  }
}

export default Event;
