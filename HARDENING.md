<!-- markdownlint-disable -->

# Hardening Report: mislav--bump-homebrew-formula-action/v3.3

> This file was generated automatically by the hardening agent.

**Policy SHA:** `d636be7e43ef829af6e853da6b3c7566db9f72fe`

**Test Policy SHA:** `843adf9e4b8f85d0c08b27b9d0b09dd094b54702`

**Harden Agent Version:** `2`

Action **mislav--bump-homebrew-formula-action/v3.3** was hardened automatically. 2 finding(s) were identified and resolved across 1 iteration(s).

## Findings Fixed

### unpinned-uses (severity: high)

The workflow file .github/workflows/test.yml references GitHub Actions using mutable tag refs (@v4) instead of full 40-character SHA commit hashes. This exposes the workflow to supply-chain attacks if the tag is moved to a different commit. Failing references: `actions/checkout@v4` and `actions/setup-node@v4`.

Locations:

- `.github/workflows/test.yml:10`
- `.github/workflows/test.yml:12`

### missing-permissions (severity: medium)

The workflow file .github/workflows/test.yml has no top-level `permissions:` key and no job-level `permissions:` key on the `test` job. Without explicit permissions, the workflow inherits the repository's default token permissions, which may be broader than necessary (e.g., write access to contents). A minimal explicit permissions block should be added.

Locations:

- `.github/workflows/test.yml:1`

## Iteration Notes

### Iteration 1

**Fixes applied:** unpinned-uses, missing-permissions

**Notes:**

Pinned actions/checkout@v4 to SHA 34e114876b0b11c390a56381ad16ebd13914f8d5 and actions/setup-node@v4 to SHA 49933ea5288caeca8642d1e84afbd3f7d6820020. Added top-level `permissions: {}` to restrict the workflow token to no permissions, which is appropriate for a test workflow that only runs npm ci, npm test, and npm run lint.

