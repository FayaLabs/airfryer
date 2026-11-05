# AGENTS.md — rules for everyone working in this repo

## Commit and PR titles

Every commit subject and every PR title follows [Conventional Commits](https://www.conventionalcommits.org/):

```
type(scope): description
```

- **type** — one of `feat` (new behaviour), `fix` (a bug), `docs`, `refactor` (no behaviour change), `perf`, `test`, `build`, `ci`, `chore`, `revert`.
- **scope** — optional, lower-case: the area the change lives in (`messaging`, `pos`, `crm`, `counter`, `observability`…). Leave it out when the change is repo-wide.
- **description** — lower-case start, no trailing period, in English. Say what changes for whoever uses it, not which file moved: `the outbox long-polls, so the dispatcher stops asking every 20 s`, not `update outbox.ts`.
- A breaking change adds `!` after the type or scope (`feat(api)!: …`) and a `BREAKING CHANGE:` line in the body.
- PRs are squash-merged, so the PR title becomes the commit on `main`: it follows the same rule.

Examples:

```
feat(pos): payment recovery on the service (ADR 0010)
fix(observability): HTTP metrics name the route; a long poll is its own
docs(counter): stop telling readers Artorius switches the PDV off
ci: deploy main to the local services on every green push, production by hand
```
