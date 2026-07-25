<!-- markdownlint-disable -->

# Hardening Report: mislav--bump-homebrew-formula-action/v4.2

> This file was generated automatically by the hardening agent.

**Policy SHA:** `d636be7e43ef829af6e853da6b3c7566db9f72fe`

**Test Policy SHA:** `843adf9e4b8f85d0c08b27b9d0b09dd094b54702`

**Harden Agent Version:** `2`

Action **mislav--bump-homebrew-formula-action/v4.2** was hardened automatically. 2 finding(s) were identified and resolved across 1 iteration(s).

## Findings Fixed

### unpinned-uses (severity: high)

Both workflow files reference GitHub Actions using mutable version tags (@v6) instead of pinned 40-character commit SHAs. This exposes the workflow to supply-chain attacks if the tag is moved to a malicious commit. Affected references: `actions/checkout@v6` and `actions/setup-node@v6` in both files.

Locations:

- `.github/workflows/integration.yml:18`
- `.github/workflows/integration.yml:20`
- `.github/workflows/test.yml:10`
- `.github/workflows/test.yml:12`

### missing-permissions (severity: medium)

Neither workflow file defines a top-level `permissions:` block, and neither job defines a job-level `permissions:` block. Without explicit permissions, workflows run with the default (potentially broad) token permissions, violating the principle of least privilege.

Locations:

- `.github/workflows/integration.yml:1`
- `.github/workflows/test.yml:1`

## Iteration Notes

### Iteration 1

**Fixes applied:** unpinned-uses, missing-permissions

**Notes:**

Fixed both workflow files (.github/workflows/integration.yml and .github/workflows/test.yml):
1. Pinned `actions/checkout@v6` to full SHA `d23441a48e516b6c34aea4fa41551a30e30af803` with `# v6` comment for readability.
2. Pinned `actions/setup-node@v6` to full SHA `249970729cb0ef3589644e2896645e5dc5ba9c38` with `# v6` comment for readability.
3. Added top-level `permissions: contents: read` block to both workflow files, granting only the minimum permissions needed for checkout and npm operations.

