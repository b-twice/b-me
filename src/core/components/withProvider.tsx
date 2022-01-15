import React from "react";

export default function withProvider(
  WrappedComponent: any,
  Provider: any,
  context?: any,
  api?: any
) {
  return (props: any) => (
    <Provider>
      <WrappedComponent {...{ ...props, context: context, api: api }} />
    </Provider>
  );
}
