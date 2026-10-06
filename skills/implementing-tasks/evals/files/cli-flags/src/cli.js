import { readFileSync } from "node:fs";

const file = process.argv[2];
const text = readFileSync(file, "utf8");
console.log(text.split("\n").length);
