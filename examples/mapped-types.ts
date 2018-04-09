interface State {
  text: string;
  counter: number;
}

const state: Readonly<State> = {
  text: "hello world",
  counter: 42,
};

state.text = "update"; // Expected error: state is readonly

const stateUpdate1: Partial<State> = {
  counter: 70,
};

const stateUpdate2: Partial<State> = {
  text: "update",
  flag: true, // Expected error: no `flag` in State
};
