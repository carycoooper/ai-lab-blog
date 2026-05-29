from pathlib import Path

changes_file = Path("changes.txt")

events = {
    "execution_created": [],
    "workflow_updated": [],
    "prompt_updated": [],
    "blog_updated": [],
}

if changes_file.exists():
    changed_files = [
        line.strip().lstrip("\ufeff")
        for line in changes_file.read_text(encoding="utf-8-sig").splitlines()
        if line.strip()
    ]
else:
    changed_files = []

for file_path in changed_files:
    if "codex/executions" in file_path:
        events["execution_created"].append(file_path)
    elif "codex/workflows" in file_path:
        events["workflow_updated"].append(file_path)
    elif "codex/prompts" in file_path:
        events["prompt_updated"].append(file_path)
    elif "blog/" in file_path:
        events["blog_updated"].append(file_path)


def handle_execution_event(files):
    for f in files:
        print(f"Execution triggered: {f}")


def handle_workflow_event(files):
    for f in files:
        print(f"Workflow updated: {f}")


def handle_prompt_event(files):
    for f in files:
        print(f"Prompt updated: {f}")


def handle_blog_event(files):
    for f in files:
        print(f"Blog updated: {f}")


handle_execution_event(events["execution_created"])
handle_workflow_event(events["workflow_updated"])
handle_prompt_event(events["prompt_updated"])
handle_blog_event(events["blog_updated"])

print("Event Engine completed.")
