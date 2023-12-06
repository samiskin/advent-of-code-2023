import fs from "fs";
import { chunk } from "lodash";
import { intervalDifference, intervalOverlap } from "./utils";

const testInput = `
seeds: 79 14 55 13

seed-to-soil map:
50 98 2
52 50 48

soil-to-fertilizer map:
0 15 37
37 52 2
39 0 15

fertilizer-to-water map:
49 53 8
0 11 42
42 0 7
57 7 4

water-to-light map:
88 18 7
18 25 70

light-to-temperature map:
45 77 23
81 45 19
68 64 13

temperature-to-humidity map:
0 69 1
1 0 69

humidity-to-location map:
60 56 37
56 93 4
`;

const input = fs.readFileSync("./inputs/day-5.txt", "utf8").trim();

const sections = input.trim().split("\n\n");
const [seedsSection, ...rest] = sections;
const seeds = seedsSection.split(":")[1].trim().split(" ").map(Number);

const maps = rest.map((section) => {
  const [_, ...rest] = section.trim().split("\n");
  return rest.map((row) => row.trim().split(" ").map(Number));
});

const p1Dests = seeds.map((seed) => {
  for (let map of maps) {
    for (let [dest, start, size] of map) {
      if (seed >= start && seed < start + size) {
        seed = dest + (seed - start);
        break;
      }
    }
  }
  return seed;
});

console.log(Math.min(...p1Dests));

// P2
let ranges = chunk(seeds, 2).map(
  ([start, size]) => [start, start + size] as const,
);
for (let map of maps) {
  let mapWithFallback = [...map, [0, 0, Infinity]];
  let unmapped = ranges;
  let nextRanges: typeof ranges = [];
  while (unmapped.length > 0) {
    const [start, end] = unmapped.shift()!;
    for (let [dest, mapStart, mapSize] of mapWithFallback) {
      const overlap = intervalOverlap(
        [start, end],
        [mapStart, mapStart + mapSize],
      );
      if (overlap) {
        nextRanges.push([
          dest + (overlap[0] - mapStart),
          dest + (overlap[1] - mapStart),
        ]);
        const remaining = intervalDifference(
          [start, end],
          [mapStart, mapStart + mapSize],
        );
        unmapped.push(...remaining);
        break;
      }
    }
  }
  ranges = nextRanges;
}

console.log(Math.min(...ranges.map(([start]) => start)));
