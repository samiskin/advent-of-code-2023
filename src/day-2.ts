import fs from "fs";

const testInput = `
Game 1: 3 blue, 4 red; 1 red, 2 green, 6 blue; 2 green
Game 2: 1 blue, 2 green; 3 green, 4 blue, 1 red; 1 green, 1 blue
Game 3: 8 green, 6 blue, 20 red; 5 blue, 4 red, 13 green; 5 green, 1 red
Game 4: 1 green, 3 red, 6 blue; 3 green, 6 red; 3 green, 15 blue, 14 red
Game 5: 6 red, 1 blue, 3 green; 2 blue, 1 red, 2 green
`;

const input = fs.readFileSync("./inputs/day-2.txt", "utf8");

const parsed = input
  .trim()
  .split("\n")
  .map((line) => {
    const [gameText, roundsText] = line.split(":");
    const gameNum = parseInt(gameText.split(" ")[1], 10);
    const rounds = roundsText.split(";").map((round) => {
      return round.split(",").reduce(
        (counts, roundText) => {
          const [count, color] = roundText.trim().split(" ");
          return {
            ...counts,
            [color]: (counts[color] ?? 0) + parseInt(count, 10),
          };
        },
        {} as Record<string, number>,
      );
    });
    return { gameNum, rounds };
  });

// P1
const totals = { red: 12, green: 13, blue: 14 };
const validGames = parsed.filter(
  ({ rounds }) =>
    !rounds.find(
      (round) =>
        !!Object.keys(round).find((color) => round[color] > totals[color]),
    ),
);
console.log(
  "P1:",
  validGames.map(({ gameNum }) => gameNum).reduce((a, b) => a + b, 0),
);

// P2
const powers = parsed.map(({ rounds }) => {
  const maxs = rounds.reduce(
    (max, round) => ({
      red: Math.max(max.red, round.red ?? 0),
      green: Math.max(max.green, round.green ?? 0),
      blue: Math.max(max.blue, round.blue ?? 0),
    }),
    { red: 0, green: 0, blue: 0 },
  );
  return maxs.red * maxs.green * maxs.blue;
});

console.log(
  "P2:",
  powers.reduce((a, b) => a + b, 0),
);
