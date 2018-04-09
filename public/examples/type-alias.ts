type Name = string;

type IdentityCallback<T> = (p: T) => T;

const callback: IdentityCallback<Name> = (p: Name) => p;
