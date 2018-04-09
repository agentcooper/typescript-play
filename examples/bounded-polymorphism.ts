function logFoo<T extends { foo: string }>(obj: T): T {
  console.log(obj.foo);
  return obj;
}

logFoo({ foo: "foo", bar: "bar" }).bar;

logFoo({ bar: "bar" }); // Expected error
