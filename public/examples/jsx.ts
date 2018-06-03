// set JSX to "React" or "Preserve"

// fake bindings
declare namespace React {
  function createElement(): any;
}

declare function View(props: { text: string }): any;

const dom = <View text="hello world" />;
