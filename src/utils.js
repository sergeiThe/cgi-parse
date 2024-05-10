export const getMonthOfYearText = (monthIndex) =>  {
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  if (monthIndex >= 0 && monthIndex <= 11) {
    return months[monthIndex];
  } else {
    throw new Error("Invalid month index. Month index should be between 0 and 11.");
  }
}

export const aggregate = (records, groupByFields, sumField) => {
  const aggregatedResults = new Map();

  // Iterate through each object
  records.forEach(obj => {
    // Generate a key based on the fields to group by
    const key = groupByFields.map(field => obj[field]).join('_');

    // If the key does not exist in the map, initialize it with the sumField value
    if (!aggregatedResults.has(key)) {
      aggregatedResults.set(key, { ...obj });
      aggregatedResults.get(key)[sumField] = obj[sumField];
    } else {
      // If the key already exists, sum the value of sumField
      aggregatedResults.get(key)[sumField] += obj[sumField];
    }
  });

  // Return the aggregated results as an array
  return Array.from(aggregatedResults.values());
}
