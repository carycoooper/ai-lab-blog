const fs = require("fs");
const path = require("path");

const registryPath = path.join(__dirname, "..", "data", "execution-registry.json");
const requiredFields = [
  "execution_id",
  "date",
  "workflow_id",
  "prompt_id",
  "cluster",
  "status",
  "outputs",
  "commit_hash",
];

function fail(msg) {
  console.error(`INVALID: ${msg}`);
  process.exitCode = 1;
}

let raw;
try {
  raw = fs.readFileSync(registryPath, "utf8");
} catch (err) {
  fail(`cannot read ${registryPath}: ${err.message}`);
  process.exit();
}

let data;
try {
  data = JSON.parse(raw);
} catch (err) {
  fail(`invalid JSON: ${err.message}`);
  process.exit();
}

if (!Array.isArray(data)) {
  fail("registry root must be an array");
  process.exit();
}

if (data.length === 0) {
  fail("registry is empty");
}

data.forEach((entry, idx) => {
  const tag = `entry[${idx}]`;
  if (typeof entry !== "object" || !entry) {
    fail(`${tag} must be an object`);
    return;
  }

  requiredFields.forEach((field) => {
    if (!(field in entry)) fail(`${tag} missing field: ${field}`);
  });

  if (!Array.isArray(entry.outputs) || entry.outputs.length === 0) {
    fail(`${tag}.outputs must be a non-empty array`);
  } else {
    entry.outputs.forEach((v, i) => {
      if (typeof v !== "string") fail(`${tag}.outputs[${i}] must be a string path`);
    });
  }
});

if (process.exitCode) {
  process.exit();
}

console.log(`OK: execution registry valid (${data.length} run${data.length > 1 ? "s" : ""})`);
