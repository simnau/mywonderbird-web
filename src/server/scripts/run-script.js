async function runScript(...args) {
  try {
    if (!args.length) {
      process.exit(0);
    }

    const [scriptName] = args;

    const { run } = require(`./${scriptName}`);
    await run(...args.splice(1));

    process.exit(0);
  } catch (e) {
    console.log(e.message);
    process.exit(1);
  }
}

runScript(...process.argv.slice(2));
