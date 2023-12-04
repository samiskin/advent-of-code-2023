import fs from "fs";
import { groupBy, range } from "lodash";
import { getNeighbors, hash } from "./utils";

const testInput = `
467..114..
...*......
..35..633.
......#...
617*......
.....+.58.
..592.....
......755.
...$.*....
.664.598..
`.trim();

const input = fs.readFileSync("./inputs/day-3.txt", "utf8").trim();

const grid = input
  .trim()
  .split("\n")
  .map((line) => line.split(""));
const [width, height] = [grid[0].length, grid.length];

const numbers: { num: number; points: [number, number][] }[] = [];
for (let y = 0; y < height; y++) {
  let numStr = "";
  // <= to catch the last number
  for (let x = 0; x <= width; x++) {
    if (!Number.isNaN(parseInt(grid[y][x], 10))) {
      numStr = numStr.concat(grid[y][x]);
    } else if (numStr.length > 0) {
      numbers.push({
        num: parseInt(numStr, 10),
        points: range(x - numStr.length, x).map((px) => [px, y]),
      });
      numStr = "";
    }
  }
}

const partNumbers = numbers
  .map((n) => {
    const adjacentSymbol = n.points
      .flatMap((p) => getNeighbors(p, true))
      .filter(([x, y]) => grid[y]?.[x])
      .filter(([x, y]) => grid[y][x] !== ".")
      .find(([x, y]) => isNaN(parseInt(grid[y][x], 10)));
    return (adjacentSymbol && {
      ...n,
      symbolPos: adjacentSymbol,
      symbol: grid[adjacentSymbol[1]][adjacentSymbol[0]],
    })!;
  })
  .filter(Boolean);

// P1
console.log(partNumbers.map(({ num }) => num).reduce((a, b) => a + b, 0));

// P2
const gearCandidates = groupBy(
  partNumbers.filter((n) => n.symbol === "*"),
  ({ symbolPos }) => hash(symbolPos),
);
const gears = Object.values(gearCandidates).filter((g) => g.length === 2);
const ratios = gears.map((parts) => parts.reduce((a, b) => a * b.num, 1));

console.log(ratios.reduce((a, b) => a + b, 0));
