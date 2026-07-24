<!-- markdownlint-disable -->

# Hardening Report: mislav--bump-homebrew-formula-action/v3.6

> This file was generated automatically by the hardening agent.

**Policy SHA:** `d636be7e43ef829af6e853da6b3c7566db9f72fe`

**Test Policy SHA:** `843adf9e4b8f85d0c08b27b9d0b09dd094b54702`

**Harden Agent Version:** `2`

Action **mislav--bump-homebrew-formula-action/v3.6** was hardened automatically. 2 finding(s) were identified and resolved across 1 iteration(s).

## Findings Fixed

### unpinned-uses (severity: high)

Both workflow files reference GitHub Actions using mutable version tags instead of full 40-character SHA commit hashes. This exposes the workflow to supply-chain attacks if the referenced tag is moved or overwritten. Failing references: `actions/checkout@v5` and `actions/setup-node@v4` in both files.

Locations:

- `.github/workflows/integration.yml:15`
- `.github/workflows/integration.yml:17`
- `.github/workflows/test.yml:9`
- `.github/workflows/test.yml:11`

### missing-permissions (severity: medium)

Neither workflow file defines a top-level `permissions:` block, and neither job defines its own `permissions:` block. Without explicit permissions, workflows run with the default (potentially broad) token permissions. Each workflow should declare minimal required permissions (e.g. `permissions: read-all` or specific scopes).

Locations:

- `.github/workflows/integration.yml:1`
- `.github/workflows/test.yml:1`

## Iteration Notes

### Iteration 1

**Fixes applied:** unpinned-uses, missing-permissions

**Notes:**

Fixed both workflow files (.github/workflows/integration.yml and .github/workflows/test.yml): (1) Pinned `actions/checkout@v5` to full SHA `fbc6f3992d24b796d5a048ff273f7fcc4a7b6c09` and `actions/setup-node@v4` to full SHA `49933ea5288caeca8642d1e84afbd3f7d6820020`, preserving the version tags as comments. (2) Added top-level `permissions: contents: read` block to both workflow files, granting only the minimal read access needed for checkout.

