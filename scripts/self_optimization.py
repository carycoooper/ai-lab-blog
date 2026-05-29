from __future__ import annotations

import re
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
NOTES_DIR = ROOT / "notes"
REPORT_FILE = ROOT / "seo-engine" / "self-optimization-report.auto.md"
CLUSTER_SCORING_FILE = ROOT / "seo-engine" / "cluster-scoring.md"

CLUSTER_HINTS = {
    "prompt-engineering": ("repeat", "repetition", "prompt", "pattern"),
    "ai-content-systems": ("persona", "drift", "session", "continuity"),
    "ai-seo-strategy": ("seo", "coasting", "ranking", "graph"),
    "automation-systems": ("automation", "workflow", "execution", "pipeline"),
}


def detect_cluster(text: str) -> str:
    lower = text.lower()
    best_cluster = "ai-content-systems"
    best_score = -1
    for cluster, keys in CLUSTER_HINTS.items():
        score = sum(1 for k in keys if k in lower)
        if score > best_score:
            best_score = score
            best_cluster = cluster
    return best_cluster


def score_note(text: str) -> int:
    words = len(re.findall(r"[A-Za-z0-9]+", text))
    link_count = text.count('class="note-link"')
    metadata_count = text.count("workflow_id:") + text.count("execution_id:") + text.count("cluster:")
    score = 0
    score += min(35, words // 8)
    score += min(30, link_count * 6)
    score += min(20, metadata_count * 8)
    if "../ai-lab/overview.md" in text:
        score += 10
    if "../seo-engine/content-graph.md" in text:
        score += 5
    return max(0, min(100, score))


def suggestion_for(score: int) -> str:
    if score < 60:
        return "add 2 related links and tighten workflow/execution metadata"
    if score < 80:
        return "add one same-cluster cross-link and refresh operator summary"
    return "keep as reference node and use as linking target"


def analyze_notes() -> list[dict]:
    rows = []
    for note in sorted(NOTES_DIR.glob("*.html")):
        if note.name == "index.html":
            continue
        text = note.read_text(encoding="utf-8", errors="ignore")
        score = score_note(text)
        cluster = detect_cluster(text)
        rows.append(
            {
                "name": note.name,
                "score": score,
                "cluster": cluster,
                "suggestion": suggestion_for(score),
            }
        )
    return rows


def write_report(rows: list[dict]) -> None:
    timestamp = datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M UTC")
    lines = [
        "# Self-Optimization Report (Auto)",
        "",
        f"Generated: {timestamp}",
        "",
        "## Note Scores",
        "",
        "| note | cluster | score | action |",
        "| --- | --- | ---: | --- |",
    ]
    for r in rows:
        lines.append(f"| {r['name']} | {r['cluster']} | {r['score']} | {r['suggestion']} |")

    weak = [r for r in rows if r["score"] < 70]
    lines.extend(
        [
            "",
            "## Weak Nodes",
            "",
        ]
    )
    if weak:
        for r in weak:
            lines.append(f"- `{r['name']}` -> {r['suggestion']}")
    else:
        lines.append("- none")

    lines.extend(
        [
            "",
            "## Next Pass",
            "",
            "- update weak nodes first",
            "- rerun `scripts/automation.py` after structural edits",
            "- keep persona tone stable while improving link graph",
            "",
        ]
    )
    REPORT_FILE.write_text("\n".join(lines), encoding="utf-8")


def ensure_cluster_scoring_link() -> None:
    marker = "Latest self-optimization report: `/seo-engine/self-optimization-report.auto.md`"
    text = CLUSTER_SCORING_FILE.read_text(encoding="utf-8", errors="ignore")
    if marker not in text:
        if not text.endswith("\n"):
            text += "\n"
        text += "\n" + marker + "\n"
        CLUSTER_SCORING_FILE.write_text(text, encoding="utf-8")


def main() -> None:
    rows = analyze_notes()
    write_report(rows)
    ensure_cluster_scoring_link()
    print(f"Self-optimization complete: {len(rows)} notes analyzed")


if __name__ == "__main__":
    main()
