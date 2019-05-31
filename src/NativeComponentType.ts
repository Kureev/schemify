import * as React from 'react';

export type MeasureOnSuccessCallback = (
  x: number,
  y: number,
  width: number,
  height: number,
  pageX: number,
  pageY: number
) => void;

export type MeasureInWindowOnSuccessCallback = (
  x: number,
  y: number,
  width: number,
  height: number
) => void;

export type MeasureLayoutOnSuccessCallback = (
  left: number,
  top: number,
  width: number,
  height: number
) => void;

export class NativeComponent<Props> extends React.Component<Props> {
  blur(): void {}
  focus(): void {}
  measure(callback: MeasureOnSuccessCallback): void {}
  measureInWindow(callback: MeasureInWindowOnSuccessCallback): void {}
  measureLayout(
    relativeToNativeNode: number,
    onSuccess: MeasureLayoutOnSuccessCallback,
    onFail?: () => void
  ): void {}
  setNativeProps(nativeProps: Object): void {}
}
