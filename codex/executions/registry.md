# Execution Registry

This file mirrors `data/execution-registry.json` in readable form.

---

## Current Runs

### run-2026-05-29-automation-layer-01

- date: 2026-05-29
- workflow_id: seo-automation
- prompt_id: automation-prompts-v1
- cluster: ai-seo-strategy
- status: success
- commit_hash: d9efa65
- outputs:
  - `/ai-lab/map.md`
  - `/seo-engine/content-graph.md`
  - `/codex/automation-layer.md`

---

## Logging Rule

For every new run:

1. Append one object in `data/execution-registry.json`.
2. Append one readable block in this file.
3. Link the run page in `codex/executions/run-logs.html`.

## Validation

Before pushing updates, run:

`node js/validate-execution-registry.js`

## Quick Create

Create a new run draft with:

`node js/new-execution-run.js <execution_id> <date> <workflow_id> <prompt_id> <cluster>`
