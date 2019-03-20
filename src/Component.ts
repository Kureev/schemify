import { Schema } from './types';

class Component implements Schema.Component {
  constructor(
    private name: string,
    private events: Schema.Event[],
    private props: Schema.Prop[],
    private extendedProps: {
      type: 'ReactNativeBuiltInType';
      knownTypeName: 'ReactNativeCoreViewProps';
    } = {
      type: 'ReactNativeBuiltInType',
      knownTypeName: 'ReactNativeCoreViewProps',
    }
  ) {}

  public render() {
    return {
      extendedProps: this.extendedProps,
      name: this.name,
      events: this.events,
      props: this.props,
    };
  }
}

export default Component;
