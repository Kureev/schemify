/**
 * Mirrors https://github.com/facebook/react-native/blob/057ea6a5c7f1ad5de24a7a465ba36d5f33c1c393/Libraries/Types/CoreEventTypes.js
 */

export interface SyntheticEvent<T> {
  bubbles: boolean | null | undefined;
  cancelable: boolean | null | undefined;
  currentTarget: number;
  defaultPrevented: boolean | null | undefined;
  dispatchConfig: Readonly<{
    registrationName: string;
  }>;
  eventPhase: number | null | undefined;
  preventDefault: () => void;
  isDefaultPrevented: () => boolean;
  stopPropagation: () => void;
  isPropagationStopped: () => boolean;
  isTrusted: boolean | null | undefined;
  nativeEvent: T;
  persist: () => void;
  target: number | null | undefined;
  timeStamp: number;
  type: string | null | undefined;
}

export interface ResponderSyntheticEvent<T> extends SyntheticEvent<T> {
  touchHistory: Readonly<{
    indexOfSingleActiveTouch: number;
    mostRecentTimeStamp: number;
    numberActiveTouches: number;
    touchBank: ReadonlyArray<
      Readonly<{
        touchActive: boolean;
        startPageX: number;
        startPageY: number;
        startTimeStamp: number;
        currentPageX: number;
        currentPageY: number;
        currentTimeStamp: number;
        previousPageX: number;
        previousPageY: number;
        previousTimeStamp: number;
      }>
    >;
  }>;
}

export type Layout = Readonly<{
  x: number;
  y: number;
  width: number;
  height: number;
}>;

export interface TextLayout extends Layout {
  ascender: number;
  capHeight: number;
  descender: number;
  text: string;
  xHeight: number;
}

export type LayoutEvent = SyntheticEvent<Readonly<{ layout: Layout }>>;

export type TextLayoutEvent = SyntheticEvent<
  Readonly<{
    lines: Array<TextLayout>;
  }>
>;

export type PressEvent = ResponderSyntheticEvent<
  Readonly<{
    changedTouches: ReadonlyArray<Pick<PressEvent, 'nativeEvent'>>;
    force: number;
    identifier: number;
    locationX: number;
    locationY: number;
    pageX: number;
    pageY: number;
    target: number | null | undefined;
    timestamp: number;
    touches: ReadonlyArray<Pick<PressEvent, 'nativeEvent'>>;
  }>
>;

export type ScrollEvent = SyntheticEvent<
  Readonly<{
    contentInset: Readonly<{
      bottom: number;
      left: number;
      right: number;
      top: number;
    }>;
    contentOffset: Readonly<{
      y: number;
      x: number;
    }>;
    contentSize: Readonly<{
      height: number;
      width: number;
    }>;
    layoutMeasurement: Readonly<{
      height: number;
      width: number;
    }>;
    targetContentOffset?: Readonly<{
      y: number;
      x: number;
    }>;
    velocity?: Readonly<{
      y: number;
      x: number;
    }>;
    zoomScale?: number;
    responderIgnoreScroll?: boolean;
  }>
>;

export type SwitchChangeEvent = SyntheticEvent<
  Readonly<{
    value: boolean;
  }>
>;
