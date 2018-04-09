type TypeA = string;

let obj: TypeA;
let otherObject: any;

obj = <TypeA>otherObject;
obj = otherObject as TypeA;
