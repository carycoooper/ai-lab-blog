# SEO Engine — Cluster Scoring

Cluster scoring keeps content growth structured and comparable over time.

---

## Score Model

Each cluster is scored from 0 to 100.

`Total = Link Density + Traceability + Hub Coverage + Freshness + Execution Depth`

---

## Metrics

## 1) Link Density (0-25)

- average internal links per node
- cross-link balance inside same cluster

## 2) Traceability (0-25)

- pages with workflow_id + execution_id
- pages mapped to a concrete execution run

## 3) Hub Coverage (0-20)

- percentage of nodes linking back to `/ai-lab/overview`
- percentage of nodes linked from at least one hub page

## 4) Freshness (0-15)

- new or updated nodes in the last 14 days
- stale-node ratio

## 5) Execution Depth (0-15)

- ratio of outputs that can be traced from prompt -> workflow -> execution -> output

---

## Score Bands

- 85-100: Strong authority cluster
- 70-84: Stable but expandable
- 50-69: Weak structure, needs linking pass
- <50: Fragmented cluster, requires rebuild

---

## Weekly Scoring Routine

1. Collect cluster nodes.
2. Count link and metadata coverage.
3. Compute score by metric.
4. Log weak points.
5. Schedule repair actions.

---

## Repair Actions

- low link density -> add 2-3 sibling links per weak node
- low traceability -> backfill workflow_id / execution_id
- low hub coverage -> add hub references
- low freshness -> run new execution for that cluster

---

## Reporting Template

```txt
cluster: ai-content-systems
week: 2026-W22
score: 78
link_density: 20/25
traceability: 18/25
hub_coverage: 16/20
freshness: 10/15
execution_depth: 14/15
actions:
- add links to 4 orphan notes
- backfill metadata in 2 records
```
