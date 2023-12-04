import fs from "fs";

const testInputP1 = `
1abc2
pqr3stu8vwx
a1b2c3d4e5f
treb7uchet
`;

const testInputP2 = `
two1nine
eightwothree
abcone2threexyz
xtwone3four
4nineeightseven2
zoneight234
7pqrstsixteen
`;

const strNums = [
  "one",
  "two",
  "three",
  "four",
  "five",
  "six",
  "seven",
  "eight",
  "nine",
];

const realInput = fs.readFileSync("inputs/day-1.txt", "utf8");
const lines = realInput.trim().split("\n");

const p1Results = lines.map((line) => {
  const numbers = line
    .split("")
    .map((char) => parseInt(char, 10))
    .filter((num) => !isNaN(num));
  const concat = `${numbers[0]}${numbers[numbers.length - 1]}`;
  return parseInt(concat, 10);
});

console.log(p1Results.reduce((acc, curr) => acc + curr, 0)); // 54331

const p2Results = lines.map((line) => {
  const numbers: number[] = [];
  for (let i = 0; i < line.length; i++) {
    const num = parseInt(line[i], 10);
    if (!isNaN(num)) {
      numbers.push(num);
    } else {
      for (let n = 0; n < strNums.length; n++) {
        if (line.slice(i).startsWith(strNums[n])) {
          numbers.push(n + 1);
          break;
        }
      }
    }
  }

  const concat = `${numbers[0]}${numbers[numbers.length - 1]}`;
  return parseInt(concat, 10);
});

console.log(p2Results.reduce((acc, curr) => acc + curr, 0)); // 54518
