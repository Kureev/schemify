import * as React from 'react';
import { isPropertySignature } from 'typescript';

interface Props {
  someBoolean: boolean;
}

interface State {
  justInCase: number;
}

export default function SomeComponent(props: Props, state: State): JSX.Element {
  return (
    <div
      style={{
        backgroundColor: props.someBoolean ? 'green' : 'red',
        padding: 10,
      }}
    />
  );
}
