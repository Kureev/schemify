import { Platform, requireNativeComponent } from 'react-native';
import { NativeComponent } from '../../../NativeComponentType';

type CityName = string;

type Event = {
  someEventParameter?: boolean;
};

type Location = {
  name: CityName;
};

type Coord = {
  x: number;
  y: number;
  location?: Location;
};

type Props = {
  someBoolean?: boolean;
  onChange: (event: Event) => void;
  coord: Coord;
};

const SwitchNativeComponent: NativeComponent<Props> =
  Platform.OS === 'android'
    ? requireNativeComponent('AndroidSwitch')
    : requireNativeComponent('RCTSwitch');

export default SwitchNativeComponent;
