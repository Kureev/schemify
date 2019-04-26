import { Platform, requireNativeComponent } from 'react-native';
import { NativeComponent } from '../../../NativeComponentType';

type CityName = string;

type Event = {
  someEventParameter: boolean;
};

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
  readonly onChange: (event: Event) => void;
  readonly coord: Coord;
};

const SwitchNativeComponent1: NativeComponent<Props> =
  Platform.OS === 'android'
    ? requireNativeComponent('AndroidSwitch')
    : requireNativeComponent('RCTSwitch');

export default SwitchNativeComponent1;
