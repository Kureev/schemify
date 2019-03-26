import { Platform, requireNativeComponent } from 'react-native';
import { NativeComponent } from '../NativeComponentType';

type Baz = {
  meaningOfLife: 42;
};

type Bar = {
  bar: Baz;
};

type Foo = {
  foo: Bar;
};

type Props = {
  readonly someBoolean: boolean;
  readonly onChange: (text: string) => void;
  readonly complexType: Foo;
};

const SwitchNativeComponent: NativeComponent<Props> =
  Platform.OS === 'android'
    ? requireNativeComponent('AndroidSwitch')
    : requireNativeComponent('RCTSwitch');

export default SwitchNativeComponent;
