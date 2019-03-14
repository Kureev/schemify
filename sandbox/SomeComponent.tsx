import { Platform, requireNativeComponent } from 'react-native';
import { NativeComponent } from '../NativeComponentType';

type Props = {
  readonly someBoolean: boolean;
  readonly onChange: (text: string) => void;
};

const SwitchNativeComponent: NativeComponent<Props> =
  Platform.OS === 'android'
    ? requireNativeComponent('AndroidSwitch')
    : requireNativeComponent('RCTSwitch');

export default SwitchNativeComponent;
