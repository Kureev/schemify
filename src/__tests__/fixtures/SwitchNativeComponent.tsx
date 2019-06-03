import { Platform, requireNativeComponent } from 'react-native';
import { Float } from '../../CodegenTypes';
import {
  CodegenNativeComponent,
  WithDefault,
  BubblingEvent
} from '../../CodegenTypes';

type CityName = string;

type Event = {
  someEventParameter?: boolean;
};

type Location = {
  name: CityName;
};

type Coord = {
  x: Float;
  y: Float;
  location?: WithDefault<Location, { name: 'London' }>;
};

type Props = {
  someBoolean?: boolean;
  onChange: (event: BubblingEvent<Event>) => void;
  coord: Coord;
};

const SwitchNativeComponent: CodegenNativeComponent<'Switch', Props> =
  Platform.OS === 'android'
    ? requireNativeComponent('AndroidSwitch')
    : requireNativeComponent('RCTSwitch');

export default SwitchNativeComponent;
