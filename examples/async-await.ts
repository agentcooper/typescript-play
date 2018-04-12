// Target: ES2015^

async function delay(ms: number): Promise<void> {
  return new Promise<void>(resolve => {
    setTimeout(resolve, ms);
  });
}

async function main() {
  const ms = 1000;
  console.log(`Waiting for ${ms}ms...`);
  await delay(ms);
  console.log("Done!");
}

main();
