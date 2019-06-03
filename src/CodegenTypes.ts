/**
 * Mirrors https://github.com/facebook/react-native/blob/057ea6a5c7f1ad5de24a7a465ba36d5f33c1c393/Libraries/Types/CodegenTypes.js
 */

'use strict';

import { SyntheticEvent } from './CoreEventTypes';
import { NativeComponent } from './NativeComponentType';
import { Schemify } from './types';

// Event types
export interface BubblingEvent<T> extends SyntheticEvent<T> { };
export interface DirectEvent<T> extends SyntheticEvent<T> { };

// Prop types
export interface Float extends Number { };
export interface Int32 extends Number { };

/**
 * WithDefault is supposed to be used for optional values.
 * If property is optional but on the native side we want
 * to generate code with a default value (instead of null_ptr),
 * we need to tell the codegen which value to use.
 */
export type WithDefault<T, V extends T /* used by codegen */> = T;

// We're not using ComponentName or Options in JS
// We only use these types to codegen native code
//
// eslint-disable-next-line no-unused-vars
export type CodegenNativeComponent<
  ComponentName extends string /* used by codegen */,
  Props extends { [key: string]: any },
  Options extends Schemify.CodegenOptions = {} /* used by codegen */
  > = NativeComponent<Props>;

export enum BubblingType {
  Direct = 'direct',
  Bubble = 'bubble',
};
