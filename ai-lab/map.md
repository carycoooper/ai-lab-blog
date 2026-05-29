# AI Lab — System Map

This page visualizes AI Lab as a connected content operating system.

---

## High-Level Architecture

```mermaid
flowchart TD

A["AI Lab Root"] --> B["Codex - Execution Core"]
A --> C["SEO Engine - Visibility Layer"]
A --> D["Blog - Output Layer"]
A --> E["AI Experiments - Testing Layer"]

B --> B1["Workflows"]
B --> B2["Prompts"]
B --> B3["Executions"]
B --> B4["Integrations"]

C --> C1["Keyword Clusters"]
C --> C2["Content Graph"]
C --> C3["Ranking Experiments"]

D --> D1["Articles"]
D --> D2["Case Studies"]
D --> D3["Reports"]

E --> E1["AI Automation Tests"]
E --> E2["Strategy Experiments"]
E --> E3["System Prototypes"]
```

---

## Content Lifecycle Flow

```mermaid
flowchart LR

P["Prompt"] --> W["Workflow"]
W --> X["Execution Run"]
X --> S["SEO Indexing"]
S --> B["Blog Publication"]
B --> G["Google / Search Traffic"]
```

---

## Codex Execution Graph

```mermaid
flowchart TD

C["Codex"] --> P["Prompts"]
C --> W["Workflows"]
C --> R["Executions"]

W --> W1["Content Generation"]
W --> W2["SEO Automation"]
W --> W3["AI Agent Systems"]

R --> R1["Run Logs"]
R --> R2["Experiments"]
```

Entry: `/codex`

---

## SEO Engine Structure

```mermaid
flowchart TD

SEO["SEO Engine"] --> K["Keyword Clusters"]
SEO --> G["Content Graph"]
SEO --> R["Ranking Experiments"]

K --> K1["AI Content Systems"]
K --> K2["Automation"]
K --> K3["Prompt Engineering"]
```

Entry: `/seo-engine`

---

## Blog Output Structure

```mermaid
flowchart TD

B["Blog"] --> A1["Articles"]
B --> A2["Case Studies"]
B --> A3["Reports"]

A1 --> C1["Codex Linked Posts"]
A2 --> C2["System Experiments"]
A3 --> C3["SEO Reports"]
```

Entry: `/blog`

---

## Experiment Layer

```mermaid
flowchart TD

E["AI Experiments"] --> E1["Automation Tests"]
E --> E2["Crypto Strategy Tests"]
E --> E3["Content System Prototypes"]
```

Entry: `/ai-experiments`

---

## Cross-System Links

### Codex -> Blog

Every blog post should reference:

- `workflow_id`
- `execution_id`
- `commit_hash` (optional)

### Blog -> SEO Engine

Each article contributes to:

- keyword cluster
- content graph node

### Execution -> GitHub

Each execution may map to:

- GitHub commit
- workflow version
- system snapshot

---

## Navigation Entry Points

- `/ai-lab`
- `/ai-lab/map` (you are here)
- `/codex`
- `/seo-engine`
- `/blog`
- `/ai-experiments`

---

## System Definition

AI Lab is a living content operating system:

- ideas are executed (Codex)
- visibility is structured (SEO Engine)
- outputs are published (Blog)
- systems are tested (Experiments)
