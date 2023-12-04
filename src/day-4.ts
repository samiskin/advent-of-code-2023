import fs from "fs";

const testInput = `
Card 1: 41 48 83 86 17 | 83 86  6 31 17  9 48 53
Card 2: 13 32 20 16 61 | 61 30 68 82 17 32 24 19
Card 3:  1 21 53 59 44 | 69 82 63 72 16 21 14  1
Card 4: 41 92 73 84 69 | 59 84 76 51 58  5 54 83
Card 5: 87 83 26 28 32 | 88 30 70 12 93 22 82 36
Card 6: 31 18 13 56 72 | 74 77 10 23 35 67 36 11
`.trim();

const input = fs.readFileSync("./inputs/day-4.txt", "utf8").trim();

const parsed = input.split("\n").map((line) => {
  const [cardStr, rest] = line.split(":");
  const id = parseInt(cardStr.split(" ")[1], 10);
  const [cardNums, myNums] = rest.split("|").map((s) =>
    s
      .trim()
      .split(" ")
      .filter(Boolean)
      .map((n) => parseInt(n, 10)),
  );
  return {
    id,
    cardNums,
    myNums,
  };
});

const cardPoints = parsed.map(({ cardNums, myNums }) => {
  const cardNumsSet = new Set(cardNums);
  const common = myNums.filter((n) => cardNumsSet.has(n));
  return common.length > 0 ? Math.pow(2, common.length - 1) : 0;
});
console.log(cardPoints.reduce((a, b) => a + b, 0));

// p2
const cardCounts = parsed.map(() => 1);
for (let i = 0; i < parsed.length; i++) {
  const { cardNums, myNums } = parsed[i];
  const cardNumsSet = new Set(cardNums);
  const common = myNums.filter((n) => cardNumsSet.has(n));
  for (let j = 0; j < common.length; j++) {
    cardCounts[i + j + 1] += cardCounts[i];
  }
}
console.log(cardCounts.reduce((a, b) => a + b, 0));
