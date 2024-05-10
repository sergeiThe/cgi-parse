import { deepEqual, strict, strictEqual } from "node:assert";
import { describe, test } from "node:test";
import { aggregate } from "./../utils.js";

// Import the function to be tested

describe("aggregateAndSum function", () => {
  // Test for aggregation and summation with provided fields
  test("Should aggregate objects by meterID, direction, month, year, and group and sum value field", () => {
    const objects = [
      {
        meterID: "1",
        direction: "A",
        value: 10,
        month: 1,
        year: 2022,
        group: "Country1",
      },
      {
        meterID: "1",
        direction: "A",
        value: 20,
        month: 1,
        year: 2022,
        group: "Country1",
      },
      {
        meterID: "2",
        direction: "B",
        value: 30,
        month: 1,
        year: 2022,
        group: "Country1",
      },
      {
        meterID: "1",
        direction: "A",
        value: 40,
        month: 2,
        year: 2022,
        group: "Country2",
      },
    ];

    const result = aggregate(
      objects,
      ["meterID", "direction", "month", "year", "group"],
      "value",
    );

    // Expected aggregated result
    const expectedResult = [
      {
        meterID: "1",
        direction: "A",
        value: 30,
        month: 1,
        year: 2022,
        group: "Country1",
      },
      {
        meterID: "2",
        direction: "B",
        value: 30,
        month: 1,
        year: 2022,
        group: "Country1",
      },
      {
        meterID: "1",
        direction: "A",
        value: 40,
        month: 2,
        year: 2022,
        group: "Country2",
      },
    ];

    deepEqual(result, expectedResult);
  });

  // Test for empty input array
  test("Should return an empty array for empty input array", () => {
    const result = aggregate(
      [],
      ["meterID", "direction", "month", "year", "group"],
      "value",
    );
    deepEqual(result, []);
  });

  test("Should aggregate objects by meterID and direction and sum value field", () => {
    const objects = [
      { meterID: "1", direction: "A", value: 10 },
      { meterID: "1", direction: "A", value: 20 },
      { meterID: "2", direction: "B", value: 30 },
      { meterID: "1", direction: "B", value: 40 },
    ];

    const result = aggregate(objects, ["meterID", "direction"], "value");

    // Expected aggregated result
    const expectedResult = [
      { meterID: "1", direction: "A", value: 30 },
      { meterID: "2", direction: "B", value: 30 },
      { meterID: "1", direction: "B", value: 40 },
    ];

    deepEqual(result, expectedResult);
  });
  // Add more test cases as needed
});
