const calculateAverageNumbers = (numbers) => {
  if (!numbers.length) return 0;
  const actualVotes = numbers.filter((n) => n !== undefined && n !== null);
  const sum = actualVotes.reduce((total, num) => total + num, 0);

  return (sum / actualVotes.length)?.toFixed(0);
};

export const highestOccurenceOfValues = (arr) => {
  const counts = arr
    .filter((x) => x !== undefined && x !== null)
    .reduce((res, next) => {
      res[next] = (res[next] ?? 0) + 1;
      return res;
    }, {});

  return Object.entries(counts)?.sort((a, b) => b[1] - a[1])?.[0]?.[0];
};

export const VoteOptions = {
  fibonacci: {
    values: [0, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144, 233, 377, 610, 987],
    calculateAverage: calculateAverageNumbers,
  },
  tshirt: {
    values: ["XS", "S", "M", "L", "XL", "XXL"],
    calculateAverage: highestOccurenceOfValues,
  },
  yesNo: { values: ["Yes", "No"], calculateAverage: highestOccurenceOfValues },
  boolean: {
    values: ["True", "False"],
    calculateAverage: highestOccurenceOfValues,
  },
  thumbs: {
    values: ["👍", "👎", "🫰", "🤌"],
    calculateAverage: highestOccurenceOfValues,
  },
  naturalNumbers: {
    values: Array.from(Array(50).keys()),
    calculateAverage: calculateAverageNumbers,
  },
  deficientNumbers: {
    values: [
      1, 2, 3, 4, 5, 7, 8, 9, 10, 11, 13, 14, 15, 16, 17, 19, 21, 22, 23, 25,
      26, 27, 29, 31, 32, 33, 34, 35, 37, 38, 39, 41, 43, 44, 45, 46, 47, 49,
      50,
    ],
    calculateAverage: calculateAverageNumbers,
  },
  abundantNumbers: {
    values: [
      12, 18, 20, 24, 30, 36, 40, 42, 48, 54, 56, 60, 66, 70, 72, 78, 80, 84,
      88, 90, 96, 100, 102, 104, 108,
    ],
    calculateAverage: calculateAverageNumbers,
  },
  foodEmojis: {
    values: ["🍕", "🍟", "🌭", "🍔", "🧀", "🥔", "🌮", "🥩", "🍖", "🍺", "🥪"],
    calculateAverage: highestOccurenceOfValues,
  },
};

export const VoteOptionsLabels = {
  fibonacci: "Fibonacci",
  tshirt: "T-Shirt Sizes",
  yesNo: "Yes/No",
  boolean: "True/False",
  thumbs: "Thumbs",
  naturalNumbers: "Natural Numbers",
  deficientNumbers: "Deficient Numbers",
  abundantNumbers: "Abundant Numbers",
  foodEmojis: "Food Emojis",
};
