from __future__ import annotations

import json
from collections import defaultdict
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
REGISTRY = ROOT / "data" / "execution-registry.json"
MAP_AUTO = ROOT / "ai-lab" / "map.auto.md"
GRAPH_AUTO = ROOT / "seo-engine" / "content-graph.auto.md"


def load_registry() -> list[dict]:
    raw = REGISTRY.read_text(encoding="utf-8")
    data = json.loads(raw)
    if not isinstance(data, list):
        raise ValueError("execution-registry.json root must be a list")
    return data


def sanitize_id(value: str) -> str:
    return value.replace("-", "_").replace("/", "_").replace(".", "_")


def build_graph(registry: list[dict]) -> str:
    clusters: dict[str, list[str]] = defaultdict(list)
    workflow_links: list[tuple[str, str]] = []

    for entry in registry:
        run_id = str(entry.get("execution_id", "unknown-run"))
        cluster = str(entry.get("cluster", "general"))
        workflow = str(entry.get("workflow_id", "unknown-workflow"))
        clusters[cluster].append(run_id)
        workflow_links.append((workflow, run_id))

    out = ["# SEO Engine — Auto Generated Content Graph", "", "```mermaid", "flowchart TD", ""]
    for cluster, runs in sorted(clusters.items()):
        cnode = f"C_{sanitize_id(cluster)}"
        out.append(f'{cnode}["{cluster}"]')
        for run in runs:
            rnode = f'R_{sanitize_id(run)}["{run}"]'
            out.append(rnode)
            out.append(f"{cnode} --> R_{sanitize_id(run)}")

    out.append("")
    for workflow, run in workflow_links:
        wnode = f'W_{sanitize_id(workflow)}["{workflow}"]'
        out.append(wnode)
        out.append(f"{wnode.split('[')[0]} --> R_{sanitize_id(run)}")

    out.extend(["```", "", f"Source: `{REGISTRY.as_posix().replace(str(ROOT).replace('\\\\', '/'), '').lstrip('/')}`"])
    return "\n".join(out) + "\n"


def build_map(registry: list[dict]) -> str:
    clusters = sorted({str(entry.get("cluster", "general")) for entry in registry})
    runs = [str(entry.get("execution_id", "unknown-run")) for entry in registry]

    out = ["# AI Lab — Auto System Map", "", "```mermaid", "flowchart TD", ""]
    out.extend(
        [
            'AI_Lab["AI Lab"] --> Codex["Codex"]',
            'AI_Lab --> SEO["SEO Engine"]',
            'AI_Lab --> Blog["Blog/Notes"]',
            'Codex --> Exec["Executions"]',
            'SEO --> Clu["Keyword Clusters"]',
            "",
        ]
    )

    for run in runs:
        out.append(f'Exec --> R_{sanitize_id(run)}["{run}"]')
    for cluster in clusters:
        out.append(f'Clu --> C_{sanitize_id(cluster)}["{cluster}"]')

    out.extend(["```", "", f"Auto-generated from `{REGISTRY.as_posix().replace(str(ROOT).replace('\\\\', '/'), '').lstrip('/')}`"])
    return "\n".join(out) + "\n"


def main() -> None:
    registry = load_registry()
    MAP_AUTO.write_text(build_map(registry), encoding="utf-8")
    GRAPH_AUTO.write_text(build_graph(registry), encoding="utf-8")
    print("Automation complete: map.auto.md + content-graph.auto.md updated")


if __name__ == "__main__":
    main()
