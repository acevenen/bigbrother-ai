import { readFileSync, writeFileSync, existsSync } from "fs";
import { join } from "path";

const COUNTER_PATH = join(process.cwd(), "counter.json");

function readCount(): number {
  if (!existsSync(COUNTER_PATH)) return 0;
  try {
    return JSON.parse(readFileSync(COUNTER_PATH, "utf-8")).count ?? 0;
  } catch {
    return 0;
  }
}

function writeCount(n: number) {
  writeFileSync(COUNTER_PATH, JSON.stringify({ count: n }), "utf-8");
}

export async function GET() {
  return Response.json({ count: readCount() });
}

export async function POST() {
  const next = readCount() + 1;
  writeCount(next);
  return Response.json({ count: next });
}
