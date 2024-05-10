import fs from "node:fs/promises";
import {DirectionParser, GroupParser, MeterIDParser, parseLine, TimestampParser, ValueParser} from "./parse.js";
import {aggregate} from "./utils.js";

const readFilePath = "data.csv";
const writeErrorsPath = "errors-4.csv";
const result1Path = "result-1.csv"
const result2Path = "result-2.csv"
const result3Path = "result-3.csv"

let data
try {
  data = await fs.readFile(readFilePath);
} catch (err) {
  console.log(err);
}

const lines = data.toString().split("\n");
const {errorParsers, successfulParsers} = lines.reduce((acc, currentLine, index) => {
  const {hasErrors, parserObject} = parseLine(currentLine)
  if (hasErrors) {
    acc.errorParsers.push({index, parserObject})
  } else {
    acc.successfulParsers.push({parserObject})
  }
  return acc
}, {
  errorParsers: [],
  successfulParsers: [],
})


// 1. Aggregate by direction and meterID per month
let records = successfulParsers.map(parser => {
  const result = {
    value: parser.parserObject.valueParser.parsedResult,
    meterID: parser.parserObject.meterIDParser.parsedResult,
    direction: parser.parserObject.directionParser.parsedResult,
    year: parser.parserObject.timestampParser.year,
    month: parser.parserObject.timestampParser.month,
  }

  return result
})


const formattedLines1 = aggregate(records, ["meterID", "direction", "month"], "value").map(record => {
  return `${record.meterID},${record.direction},${record.year},${record.month},${record.value}`
})

records = null;


try {
  await fs.writeFile(result1Path, formattedLines1.join("\n"), "utf8")

} catch (err) {
  console.error(err);
}

// 2. Aggregate per month per group and direction
records = successfulParsers.map(parser => {
  const result = {
    value: parser.parserObject.valueParser.parsedResult,
    direction: parser.parserObject.directionParser.parsedResult,
    year: parser.parserObject.timestampParser.year,
    month: parser.parserObject.timestampParser.month,
    group: parser.parserObject.groupParser.parsedResult,
  }

  return result
})


const formattedLines2 = aggregate(records, ["month", "group", "direction"], "value").map(record => {
  return `${record.group},${record.direction},${record.year},${record.month},${record.value}`
})
records = null;

try {
  await fs.writeFile(result2Path, formattedLines2.join("\n"), "utf8")

} catch (err) {
  console.error(err);
}
// 3. Aggregate direction per group

records = successfulParsers.map(parser => {
  const result = {
    value: parser.parserObject.valueParser.parsedResult,
    direction: parser.parserObject.directionParser.parsedResult,
    group: parser.parserObject.groupParser.parsedResult,
  }

  return result
})


const formattedLines3 = aggregate(records, ["direction", "group"], "value").map(record => {
  return `${record.group},${record.direction},${record.value}`
})
records = null
try {
  await fs.writeFile(result3Path, formattedLines3.join("\n"), "utf8")

} catch (err) {
  console.error(err);
}

// 4. Write errors to file
const formatErrorLines = (errorParsers) => {
  return errorParsers.map(({index, parserObject}) => {

    const meterID = MeterIDParser.format(parserObject.meterIDParser);
    const {epoch, month, year} = TimestampParser.format(parserObject.timestampParser);
    const group = GroupParser.format(parserObject.groupParser);
    const direction = DirectionParser.format(parserObject.directionParser);
    const value = ValueParser.format(parserObject.valueParser);

    const formattedLine = `${index},${meterID},${epoch},${value},${group},${direction}`;
    return formattedLine;
  })
}

try {
  await fs.writeFile(writeErrorsPath, formatErrorLines(errorParsers).join("\n"), "utf8")
} catch (err) {
  console.error(err);
}

// Notes: repetitive code -> move to standalone functions

