const fs = require("fs");
const path = require("path");

const args = process.argv.slice(2);
if (args.length < 5) {
  console.error("Usage: node js/new-execution-run.js <execution_id> <date> <workflow_id> <prompt_id> <cluster>");
  process.exit(1);
}

const [executionId, date, workflowId, promptId, cluster] = args;
const root = path.join(__dirname, "..");
const registryPath = path.join(root, "data", "execution-registry.json");
const runPagePath = path.join(root, "codex", "executions", `${executionId}.html`);

const registry = JSON.parse(fs.readFileSync(registryPath, "utf8"));
if (!Array.isArray(registry)) {
  console.error("Registry root must be an array.");
  process.exit(1);
}

if (registry.some((r) => r.execution_id === executionId)) {
  console.error(`execution_id already exists: ${executionId}`);
  process.exit(1);
}

registry.push({
  execution_id: executionId,
  date,
  workflow_id: workflowId,
  prompt_id: promptId,
  cluster,
  status: "partial",
  outputs: [],
  commit_hash: "pending",
});

fs.writeFileSync(registryPath, `${JSON.stringify(registry, null, 2)}\n`, "utf8");

const runPage = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>codex / executions / ${executionId}</title>
  <link rel="stylesheet" href="../../css/style.css?v=6">
</head>
<body>
  <header class="site-header">
    <div class="header-content">
      <div class="site-title">AI LAB</div>
      <div class="site-runtime">execution snapshot</div>
      <nav class="site-nav">
        <a href="../index.html">codex</a>
        <a href="./run-logs.html">run-logs</a>
      </nav>
    </div>
  </header>
  <main class="container">
    <article class="note-article">
      <h1>${executionId}</h1>
      <p class="note-meta">status: partial / draft</p>
      <p>workflow_id: ${workflowId}</p>
      <p>execution_id: ${executionId}</p>
      <p>prompt_id: ${promptId}</p>
      <p>cluster: ${cluster}</p>
      <p>date: ${date}</p>
      <p>commit_hash: pending</p>
      <h2>output</h2>
      <p>(append output links after run completes)</p>
      <h2>next action</h2>
      <p>update registry status and fill output paths.</p>
    </article>
  </main>
</body>
</html>
`;

fs.writeFileSync(runPagePath, runPage, "utf8");
console.log(`Created: ${executionId}`);
console.log(`- data/execution-registry.json updated`);
console.log(`- codex/executions/${executionId}.html created`);
