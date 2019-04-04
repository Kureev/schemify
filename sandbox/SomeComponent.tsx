import { Platform, requireNativeComponent } from 'react-native';
import { NativeComponent } from '../NativeComponentType';

type CityName = string;

type Location = {
  name: CityName;
};

type Coord = {
  x: number;
  y: number;
  location: Location;
};

type Props = {
  readonly someBoolean: boolean;
  readonly onChange: (text: string) => void;
  readonly coord: Coord;
};

const SwitchNativeComponent: NativeComponent<Props> =
  Platform.OS === 'android'
    ? requireNativeComponent('AndroidSwitch')
    : requireNativeComponent('RCTSwitch');

export default SwitchNativeComponent;
