import { describe, test } from "node:test";
import { getMonthOfYearText } from "../utils";
import { ifError } from "node:assert";

describe("getMonthOfYearText function", () => {
  // Test for valid month indices
  test("Should return correct month names for valid month indices", () => {
    expect(getMonthOfYearText(0)).toBe("January");
    expect(getMonthOfYearText(1)).toBe("February");
    expect(getMonthOfYearText(2)).toBe("March");
    expect(getMonthOfYearText(3)).toBe("April");
    expect(getMonthOfYearText(4)).toBe("May");
    expect(getMonthOfYearText(5)).toBe("June");
    expect(getMonthOfYearText(6)).toBe("July");
    expect(getMonthOfYearText(7)).toBe("August");
    expect(getMonthOfYearText(8)).toBe("September");
    expect(getMonthOfYearText(9)).toBe("October");
    expect(getMonthOfYearText(10)).toBe("November");
    expect(getMonthOfYearText(11)).toBe("December");
  });
});
