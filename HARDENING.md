<!-- markdownlint-disable -->

# Hardening Report: mislav--bump-homebrew-formula-action/v4.2

> This file was generated automatically by the hardening agent.

**Policy SHA:** `d636be7e43ef829af6e853da6b3c7566db9f72fe`

**Test Policy SHA:** `843adf9e4b8f85d0c08b27b9d0b09dd094b54702`

**Harden Agent Version:** `1`

Action **mislav--bump-homebrew-formula-action/v4.2** was hardened automatically. 2 finding(s) were identified and resolved across 1 iteration(s).

## Findings Fixed

### unpinned-uses (severity: high)

Both workflow files use action references pinned to mutable version tags (@v6) rather than immutable 40-character commit SHAs. This exposes the workflow to supply-chain attacks if the tag is moved. Failing references: actions/checkout@v6, actions/setup-node@v6.

Locations:

- `.github/workflows/integration.yml:14`
- `.github/workflows/integration.yml:16`
- `.github/workflows/test.yml:9`
- `.github/workflows/test.yml:11`

### missing-permissions (severity: medium)

Neither workflow file defines a top-level `permissions:` block, and no job in either file defines job-level permissions. Without explicit permissions, GitHub Actions defaults to the repository's default token permissions, which may be overly broad (e.g., write access to contents). Explicit minimal permissions should be declared.

Locations:

- `.github/workflows/integration.yml:1`
- `.github/workflows/test.yml:1`

## Iteration Notes

### Iteration 1

**Fixes applied:** unpinned-uses, missing-permissions

**Notes:**

Fixed both workflow files (.github/workflows/integration.yml and .github/workflows/test.yml):
1. unpinned-uses: Pinned `actions/checkout@v6` to SHA `df4cb1c069e1874edd31b4311f1884172cec0e10` and `actions/setup-node@v6` to SHA `48b55a011bda9f5d6aeb4c2d9c7362e8dae4041e`, preserving the version tag as a comment for readability.
2. missing-permissions: Added `permissions: {}` top-level block to both workflow files to enforce least-privilege (no token permissions granted by default).

