import { Schemify } from './types';

class Component implements Schemify.Component {
  constructor(
    private name: string,
    private events: Schemify.Event[],
    private props: Schemify.Prop[],
    private extendsProps: Array<{
      type: 'ReactNativeBuiltInType';
      knownTypeName: 'ReactNativeCoreViewProps';
    }> = [
      {
        type: 'ReactNativeBuiltInType',
        knownTypeName: 'ReactNativeCoreViewProps',
      },
    ]
  ) {}

  public addEvent(event: Schemify.Event) {
    this.events.push(event);
  }

  public addProp(prop: Schemify.Prop) {
    this.props.push(prop);
  }

  public render() {
    return {
      extendsProps: this.extendsProps,
      name: this.name,
      events: this.events,
      props: this.props,
    };
  }
}

export default Component;
