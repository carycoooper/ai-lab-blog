# AI Lab Map

This page is the system map for AI Lab v1.

---

## Information Architecture

```text
AI LAB (Root Hub)
├── /ai-lab
│   ├── overview
│   ├── map
│   └── principles (planned)
├── /codex
│   ├── overview
│   ├── workflows
│   ├── prompts
│   ├── executions
│   └── integrations
├── /seo-engine (planned)
├── /ai-experiments (planned)
└── /blog (planned)
```

---

## Clickable Entry Links

- Codex hub: `/codex/`
- Codex overview: `/codex/overview.html`
- Notes index: `/notes/`

---

## Relationship Graph

`Prompt -> Workflow -> Execution -> Commit -> Output`

- Prompt belongs to a prompt set.
- Workflow belongs to codex workflow family.
- Execution maps to run logs and optional commit hash.
- Output (notes/blog) maps back to workflow + execution id.

---

## Content Rules

1. No isolated pages.
2. Every page links upward to a hub.
3. Every output should preserve provenance.
4. System pages are stable; content pages evolve.

---

## Current Status

- Root terminal layer: active
- Codex hub: active
- Notes layer: active
- SEO engine: scaffold pending
- Blog output layer: scaffold pending
