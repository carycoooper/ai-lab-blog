# Automation Layer — Phase 2

Automation Layer turns AI Lab from manual publishing into repeatable runs.

---

## Scope

This layer automates three things:

1. Content generation run
2. SEO graph update
3. Internal link reinforcement

---

## Run Pipeline

`Prompt -> Workflow -> Execution -> Blog Output -> SEO Graph Update -> Link Update`

---

## Required Metadata

Every generated output should include:

```yaml
workflow_id:
execution_id:
cluster:
commit_hash:
```

---

## Minimum Automation Contract

### Step 1: Generate

- pick one workflow from `/codex/workflows`
- produce one output draft

### Step 2: Record

- append execution snapshot in `/codex/executions`
- include timestamp and outcome

### Step 3: Publish

- push output into `/notes` or `/blog`
- keep source trace in front matter

### Step 4: Reinforce

- update `/seo-engine/content-graph.md` node links
- add at least two internal links to related nodes

---

## Failure States

- `execution_incomplete`
- `metadata_missing`
- `cluster_unmapped`
- `link_loop_broken`

Failed runs should still be logged.

---

## Weekly Rhythm

- 3 execution runs per week
- 1 graph cleanup pass per week
- 1 internal linking pass per week

---

## Success Signal

Automation layer is healthy when:

- no orphan content
- all new outputs have workflow + execution mapping
- graph links grow without breaking cluster structure
