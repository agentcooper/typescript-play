// https://github.com/tc39/proposal-async-iteration

async function* gen(limit = 10) {
  let i = 0;
  while (i < limit) {
    yield new Promise<number>(resolve => setTimeout(() => resolve(i++), 100));
  }
}

async function main() {
  for await (const n of gen()) {
    console.log(n);
  }
  console.log("Done!");
}

main();
