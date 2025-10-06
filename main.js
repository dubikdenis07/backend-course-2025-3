const fs = require("fs");
const path = require("path");
const { Command } = require("commander");

const program = new Command();

program.option("-i, --input <path>", "input file (required)");
program.option("-o, --output <path>", "output file (optional)");
program.option("-d, --display", "display result to console (optional)");
program.option("-s, --survived", "show only survivors");
program.option("-a, --age", "display passenger age");

program.parse(process.argv);
const opts = program.opts();

if (!opts.input) {
  console.error("Please, specify input file");
  process.exit(1);
}

const inputPath = path.resolve(opts.input);

if (!fs.existsSync(inputPath)) {
  console.error("Cannot find input file");
  process.exit(1);
}

let passengers = [];
try {
  const rawData = fs.readFileSync(inputPath, "utf8");
  const lines = rawData.split("\n").filter((line) => line.trim() !== "");
  passengers = lines.map((line) => JSON.parse(line));
} catch (error) {
  console.error("Cannot read or parse input file");
  process.exit(1);
}

if (!opts.output && !opts.display) {
  process.exit(0);
}

let result = "";

passengers.forEach((passenger) => {
  if (opts.survived && passenger.Survived !== "1") {
    return;
  }

  let outputLine = "";

  if (passenger.Name) {
    outputLine += passenger.Name;
  }

  if (opts.age && passenger.Age !== undefined && passenger.Age !== null) {
    outputLine += ` ${passenger.Age}`;
  }

  if (passenger.Ticket) {
    outputLine += ` ${passenger.Ticket}`;
  }

  if (outputLine.trim() !== "") {
    result += outputLine + "\n";
  }
});

if (opts.display) {
  console.log(result);
}

if (opts.output) {
  try {
    fs.writeFileSync(opts.output, result, "utf8");
  } catch (err) {
    console.error("Failed to write to output file");
    process.exit(1);
  }
}