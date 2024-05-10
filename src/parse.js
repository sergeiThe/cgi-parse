import {getMonthOfYearText} from "./utils.js";

export const parseLine = (line) => {
  const fields = line.split(",");
  const [meterID, timestamp, value, group, direction] = fields;

  const parserObject = {
    meterIDParser: new MeterIDParser(meterID),
    timestampParser: new TimestampParser(timestamp),
    valueParser: new ValueParser(value),
    groupParser: new GroupParser(group),
    directionParser: new DirectionParser(direction, ["UP", "DOWN"]),
  };

  const hasErrors = Object.values(parserObject).some(parser => parser.errorMessage !== null);

  return {hasErrors, parserObject}
}


class FieldParser {
  constructor() {
    this.parsedResult = null;
    this.errorMessage = null;
  }

  setResult(data) {
    this.parsedResult = data
  }

  setErrorMessage(errorMessage) {
    this.errorMessage = errorMessage;
  }
}
export class TimestampParser extends FieldParser {
  constructor(timestamp) {
    super();
    this.timestamp = timestamp
    this.month = null
    this.year = null
    TimestampParser.parse(this)
  }

  static format(parser) {
    if (parser.errorMessage) {
      return parser.errorMessage
    }

    return {epoch: parser.timestamp.toString(), month: parser.month.toString(), year: parser.year.toString()}
  }

  static parse(parser) {
    const num = parseInt(parser.timestamp);
    if (isNaN(num)) {
      parser.setErrorMessage("not_an_integer")
    } else {
      const date = new Date(num);
      parser.setResult(date)
      parser.month = getMonthOfYearText(date.getMonth())
      parser.year = date.getFullYear()
    }

  }
}

export class ValueParser extends FieldParser {
  constructor(value) {
    super();
    this.value = value
    ValueParser.parse(this)
  }

  static format(parser) {
    if (parser.errorMessage) {
      return parser.errorMessage
    }

    return parser.value.toString()
  }

  static parse(parser) {
    const num = parseFloat(parser.value);
    if (isNaN(num)) {
      parser.setErrorMessage("not_a_float")
    } else {
      parser.setResult(num)
    }
  }
}

export class GroupParser extends FieldParser {
  constructor(group) {
    super()
    this.group = group
    GroupParser.parse(this)
  }

  static format(parser) {
    if (parser.errorMessage) {
      return parser.errorMessage
    }

    return parser.parsedResult
  }

  static parse(parser) {
    parser.setResult(parser.group)
  };
}


export class DirectionParser extends FieldParser {
  constructor(direction, availableDirections) {
    super()
    this.direction = direction
    this.availableDirections = availableDirections
    this.printableResult = null;
    DirectionParser.parse(this)
  }

  static format(parser) {
    if (parser.errorMessage) {
      return parser.errorMessage
    }

    return parser.parsedResult
  }

  static parse(parser) {
    const found = parser.availableDirections.some(
      (item) => item.toUpperCase() === parser.direction,
    );

    if (!found) {
      parser.setErrorMessage("unknown")
    } else {
      parser.setResult(parser.direction.toUpperCase());
    }
  }
}


export class MeterIDParser extends FieldParser {
  constructor(meterID) {
    super()
    this.meterID = meterID;
    MeterIDParser.parse(this)
  }
  static format(parser) {
    if (parser.errorMessage) {
      return parser.errorMessage
    }

    return parser.meterID
  }
  static parse(parser) {
    const num = parseInt(parser.meterID, 10);
    if (isNaN(num)) {
      parser.setErrorMessage("not_an_integer")
    } else {
      parser.setResult(num)
    }
  }
}
