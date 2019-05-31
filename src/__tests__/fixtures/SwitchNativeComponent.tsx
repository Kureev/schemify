import { Platform, requireNativeComponent } from 'react-native';
import { CodegenNativeComponent, WithDefault } from '../../CodegenTypes';

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
  location?: WithDefault<Location, { name: 'London' }>;
};

type Props = {
  someBoolean?: boolean;
  onChange: (event: Event) => void;
  coord: Coord;
};

const SwitchNativeComponent: CodegenNativeComponent<'Switch', Props> =
  Platform.OS === 'android'
    ? requireNativeComponent('AndroidSwitch')
    : requireNativeComponent('RCTSwitch');

export default SwitchNativeComponent;
