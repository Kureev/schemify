import { Schema } from './types';

class Event implements Schema.Event {
  constructor(
    readonly name: string,
    readonly optional: boolean,
    readonly typeAnnotation: {
      type: 'EventTypeAnnotation';
    }
  ) {}

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
