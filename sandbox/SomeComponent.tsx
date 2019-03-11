import * as React from 'react';
import { isPropertySignature } from 'typescript';

interface Props {
  someBoolean: boolean;
}

export default function SomeComponent(props: Props): JSX.Element {
  return (
    <div
      style={{
        backgroundColor: props.someBoolean ? 'green' : 'red',
        padding: 10,
      }}
    />
  );
}
