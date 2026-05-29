# Internal Linking Template

Use this template for every new note, blog record, or experiment page.

---

## Required Link Blocks

Each page must include links to:

1. Hub page: `/ai-lab/overview`
2. Workflow page: `/codex/workflows/*`
3. Execution page: `/codex/executions/*`
4. SEO graph: `/seo-engine/content-graph.md`
5. Two related pages in the same cluster

---

## Metadata Block

```yaml
workflow_id: content-generation
execution_id: run-2026-05-29-01
prompt_id: persona-system-v1
cluster: ai-content-systems
internal_links:
  - /ai-lab/overview
  - /codex/workflows/content-generation.html
  - /codex/executions/run-2026-05-29-automation-layer-01.html
  - /seo-engine/content-graph.md
  - /notes/example-a.html
  - /notes/example-b.html
```

---

## Placement Rules

- Put metadata near the top of the page.
- Put three critical links (workflow, execution, graph) above main body.
- Put sibling links at the end for cluster reinforcement.

---

## Validation Checklist

- no orphan page
- cluster is defined
- workflow and execution both present
- at least 2 same-cluster links
- at least 1 hub link
