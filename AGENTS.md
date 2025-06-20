# AGENTS.md

> **CodexCrafters – Multi‑Agent Prompting Conventions**
> *Last updated: 2025‑06‑19*

---

## 0. Purpose

This document defines **how we use OpenAI Codex in an *agent‑oriented* way** across the CodexCrafters monorepo.  It explains:

* What each agent is responsible for.
* The message tags and prompt templates that glue the agents together.
* How shared memory, tools, and workflows are orchestrated.
* How to extend or override the conventions safely.

> **Scope note:** These conventions are *repo‑local*.  Down‑stream forks or micro‑services should copy the parts they need and adapt terminology as required.

---

## 1. Agent Roster

| ID                      | Primary Responsibilities                                                               | Code / Artifact Domains                             | Typical Deliverables                                    |
| ----------------------- | -------------------------------------------------------------------------------------- | --------------------------------------------------- | ------------------------------------------------------- |
| **ARCHITECT**           | System design, ADRs, cross‑cutting concerns, decomposition of epics                    | `/adr/`, `/docs/architecture/`, GitHub Issues       | `ADR‑00X.md`, high‑level diagrams, refined user‑stories |
| **BACKEND**             | Node/Express routes, Twilio integration, DB schema & migrations, service layer tests   | `server/**`, `/prisma/`, `/tests/integration/`      | TypeScript/TSX diffs, Prisma migrations, Jest suites    |
| **FRONTEND**            | React/Vite UI, Tailwind CSS, i18n, web‑accessibility                                   | `client/**`, `/stories/`, `/cypress/`               | Components, hooks, Storybook stories, Cypress specs     |
| **INFRA**               | Containerisation, GitHub Actions CI, Helm/K8s manifests, Terraform, security hardening | `infra/**`, `.github/workflows/`, `docker/**`       | `Dockerfile`, Helm charts, `.tf` modules, CI pipelines  |
| **DOCS**                | Knowledge base, API reference, changelogs, onboarding guides                           | `/docs/`, `README.md`, `/CHANGELOG.md`              | Markdown docs, SVG/png diagrams, release notes          |
| **QA**                  | E2E flows, performance/load testing, exploratory test plans                            | `/tests/e2e/`, `/load/`, `/playwright.config.ts`    | Playwright scripts, Gatling configs, test matrices      |
| **SECURITY** *(opt‑in)* | Threat modelling, dependency audits, secret scanning                                   | `/.github/dependabot.yml`, `infra/**`, `/security/` | Risk reports, patched dependencies, SBOMs               |

> **Adding a new agent?**  Fork this table, pick a concise **upper‑snake‑case id**, document the responsibilities and deliverables, and reference the change in the **Change Log** (section 9).

---

## 2. Message Protocol

All Codex prompts exchanged in the repo follow the generic envelope:

```text
[<AGENT_ID>] (<optional context markers>) → "imperative‑style request"

# Example
[BACKEND] (PR‑42 context) → "Add a REST endpoint that returns active call statistics as JSON. Write unit tests too."
```

* **Sender Tags** – The agent *requesting* work precedes the arrow (`→`).
* **Recipient** – Derived from the tag; Codex is instructed to "think" as that agent.
* **One sentence summary first**, then bullet‑point acceptance criteria.
* **Max 120 chars** per line; hard‑wrap at 100 for body text.
* Always reference related issues/ADRs in the footer (`Refs #42, ADR‑007`).

### Response Contract

Codex replies with:

````
[<AGENT_ID>] ← "concise commit message"

```diff
<code or doc patch>
````

````

* Use conventional‑commit prefixes (`feat:`, `fix:`, `docs:` …).
* Responses larger than **400 tokens** should be broken into follow‑up chunks with `--chunk=N/total`.

---

## 3. Memory & Context Windows

| Memory Layer | Tech | Retention | What goes in | Retrieval Strategy |
|--------------|------|-----------|--------------|--------------------|
| **Short‑term** | Conversation buffer (8k tokens) | Single session | Recent prompt/response pairs | Always streamed to model |
| **Working** | Redis vector store | 7 days | Embeddings of last 50 commits & comments | Similarity ≥ 0.76 cosine |
| **Long‑term** | Supabase Postgres | ∞ | ADRs, design docs, release notes | Keyword search + vector rerank |

> The Memory Manager service (see `shared/memory.ts`) handles chunking, embedding, and eviction.

---

## 4. Tools & Plug‑ins

| Tool Name | Purpose | Invocation Tag | Notes |
|-----------|---------|----------------|-------|
| **TS‑PATCH** | Applies TypeScript diff without lint auto‑fix | `@patch` | Enforces `import/order` but skips prettier |
| **DB‑MIGRATE** | Generates SQL from Prisma schema diff | `@migrate` | Auto‑runs on dev DB, PR comment shows plan |
| **DIAGRAM‑GEN** | Turns `@plantuml` codeblocks into SVG | `@diagram` | Used heavily by ARCHITECT & DOCS |
| **LOAD‑TEST** | Runs Gatling scenario against staging | `@loadtest` | Requires a `STA_TOKEN` secret |

Tool calls must be **each on their own line**, directly under the request header, e.g.:

```text
[QA] → "Stress test the /calls endpoint"
@loadtest scenario=CallsPeak users=500 duration=120s
````

---

## 5. Standard Workflows

1. **Feature Pitch**
   `[ARCHITECT]` opens an ADR stub → `[FRONTEND]` & `[BACKEND]` estimate tasks → `[QA]` drafts test plan.
2. **Bug‑fix PR**
   `[BACKEND]` tags fix request → Codex patches code, auto‑runs `TS‑PATCH` → `[QA]` verifies in CI.
3. **Release Cut**
   `[INFRA]` triggers `release‑prep.yml` → `[DOCS]` generates changelog → Helm chart version bumped.

Sequence diagrams for each flow live under `/docs/architecture/agents/`.

---

## 6. Prompt Style Guide

* **Voice:** Imperative, present‑tense (“Add”, “Refactor”, “Document”).
* **Granularity:** One cohesive deliverable per prompt – avoid mega‑prompts.
* **Path Hints:** Prefix file paths when the location matters (`server/routes/calls.ts`).
* **Safety:** Avoid leaking secrets; Codex is stateless outside allowed memory layers.

---

## 7. Fallback & Error Handling

If a prompt **lacks an `[AGENT]` tag** Codex MUST:

1. Infer the most probable agent from file path and commit context.
2. Pre‑answer with:

```text
"⚠️ No agent tag found – defaulting to BACKEND.  Add [AGENT] if another scope is intended."
```

*The response then proceeds using the presumed agent role.*

---

## 8. Extensibility Checklist

* [ ] Agent added to **Roster** table.
* [ ] Responsibilities & Deliverables described.
* [ ] Any dedicated tools registered in **Tools**.
* [ ] Workflows updated if affected.
* [ ] Version note added to **Change Log**.

---

## 9. Change Log

| Date         | Author       | Summary                                                    |
| ------------ | ------------ | ---------------------------------------------------------- |
| 2025‑06‑19   | @gpt‑autogen | Major restructure; added Memory, Tools, Workflows sections |
| *YYYY‑MM‑DD* | *@you*       | *Add your entry here*                                      |

---

Happy coding! ✨
# AGENTS.md

> **CodexCrafters – Multi‑Agent Prompting Conventions**
> *Last updated: 2025‑06‑19*

---

## 0. Purpose

This document defines **how we use OpenAI Codex in an *agent‑oriented* way** across the CodexCrafters monorepo.  It explains:

* What each agent is responsible for.
* The message tags and prompt templates that glue the agents together.
* How shared memory, tools, and workflows are orchestrated.
* How to extend or override the conventions safely.

> **Scope note:** These conventions are *repo‑local*.  Down‑stream forks or micro‑services should copy the parts they need and adapt terminology as required.

---

## 1. Agent Roster

| ID                      | Primary Responsibilities                                                               | Code / Artifact Domains                             | Typical Deliverables                                    |
| ----------------------- | -------------------------------------------------------------------------------------- | --------------------------------------------------- | ------------------------------------------------------- |
| **ARCHITECT**           | System design, ADRs, cross‑cutting concerns, decomposition of epics                    | `/adr/`, `/docs/architecture/`, GitHub Issues       | `ADR‑00X.md`, high‑level diagrams, refined user‑stories |
| **BACKEND**             | Node/Express routes, Twilio integration, DB schema & migrations, service layer tests   | `server/**`, `/prisma/`, `/tests/integration/`      | TypeScript/TSX diffs, Prisma migrations, Jest suites    |
| **FRONTEND**            | React/Vite UI, Tailwind CSS, i18n, web‑accessibility                                   | `client/**`, `/stories/`, `/cypress/`               | Components, hooks, Storybook stories, Cypress specs     |
| **INFRA**               | Containerisation, GitHub Actions CI, Helm/K8s manifests, Terraform, security hardening | `infra/**`, `.github/workflows/`, `docker/**`       | `Dockerfile`, Helm charts, `.tf` modules, CI pipelines  |
| **DOCS**                | Knowledge base, API reference, changelogs, onboarding guides                           | `/docs/`, `README.md`, `/CHANGELOG.md`              | Markdown docs, SVG/png diagrams, release notes          |
| **QA**                  | E2E flows, performance/load testing, exploratory test plans                            | `/tests/e2e/`, `/load/`, `/playwright.config.ts`    | Playwright scripts, Gatling configs, test matrices      |
| **SECURITY** *(opt‑in)* | Threat modelling, dependency audits, secret scanning                                   | `/.github/dependabot.yml`, `infra/**`, `/security/` | Risk reports, patched dependencies, SBOMs               |

> **Adding a new agent?**  Fork this table, pick a concise **upper‑snake‑case id**, document the responsibilities and deliverables, and reference the change in the **Change Log** (section 9).

---

## 2. Message Protocol

All Codex prompts exchanged in the repo follow the generic envelope:

```text
[<AGENT_ID>] (<optional context markers>) → "imperative‑style request"

# Example
[BACKEND] (PR‑42 context) → "Add a REST endpoint that returns active call statistics as JSON. Write unit tests too."
```

* **Sender Tags** – The agent *requesting* work precedes the arrow (`→`).
* **Recipient** – Derived from the tag; Codex is instructed to "think" as that agent.
* **One sentence summary first**, then bullet‑point acceptance criteria.
* **Max 120 chars** per line; hard‑wrap at 100 for body text.
* Always reference related issues/ADRs in the footer (`Refs #42, ADR‑007`).

### Response Contract

Codex replies with:

````
[<AGENT_ID>] ← "concise commit message"

```diff
<code or doc patch>
````

````

* Use conventional‑commit prefixes (`feat:`, `fix:`, `docs:` …).
* Responses larger than **400 tokens** should be broken into follow‑up chunks with `--chunk=N/total`.

---

## 3. Memory & Context Windows

| Memory Layer | Tech | Retention | What goes in | Retrieval Strategy |
|--------------|------|-----------|--------------|--------------------|
| **Short‑term** | Conversation buffer (8k tokens) | Single session | Recent prompt/response pairs | Always streamed to model |
| **Working** | Redis vector store | 7 days | Embeddings of last 50 commits & comments | Similarity ≥ 0.76 cosine |
| **Long‑term** | Supabase Postgres | ∞ | ADRs, design docs, release notes | Keyword search + vector rerank |

> The Memory Manager service (see `shared/memory.ts`) handles chunking, embedding, and eviction.

---

## 4. Tools & Plug‑ins

| Tool Name | Purpose | Invocation Tag | Notes |
|-----------|---------|----------------|-------|
| **TS‑PATCH** | Applies TypeScript diff without lint auto‑fix | `@patch` | Enforces `import/order` but skips prettier |
| **DB‑MIGRATE** | Generates SQL from Prisma schema diff | `@migrate` | Auto‑runs on dev DB, PR comment shows plan |
| **DIAGRAM‑GEN** | Turns `@plantuml` codeblocks into SVG | `@diagram` | Used heavily by ARCHITECT & DOCS |
| **LOAD‑TEST** | Runs Gatling scenario against staging | `@loadtest` | Requires a `STA_TOKEN` secret |

Tool calls must be **each on their own line**, directly under the request header, e.g.:

```text
[QA] → "Stress test the /calls endpoint"
@loadtest scenario=CallsPeak users=500 duration=120s
````

---

## 5. Standard Workflows

1. **Feature Pitch**
   `[ARCHITECT]` opens an ADR stub → `[FRONTEND]` & `[BACKEND]` estimate tasks → `[QA]` drafts test plan.
2. **Bug‑fix PR**
   `[BACKEND]` tags fix request → Codex patches code, auto‑runs `TS‑PATCH` → `[QA]` verifies in CI.
3. **Release Cut**
   `[INFRA]` triggers `release‑prep.yml` → `[DOCS]` generates changelog → Helm chart version bumped.

Sequence diagrams for each flow live under `/docs/architecture/agents/`.

---

## 6. Prompt Style Guide

* **Voice:** Imperative, present‑tense (“Add”, “Refactor”, “Document”).
* **Granularity:** One cohesive deliverable per prompt – avoid mega‑prompts.
* **Path Hints:** Prefix file paths when the location matters (`server/routes/calls.ts`).
* **Safety:** Avoid leaking secrets; Codex is stateless outside allowed memory layers.

---

## 7. Fallback & Error Handling

If a prompt **lacks an `[AGENT]` tag** Codex MUST:

1. Infer the most probable agent from file path and commit context.
2. Pre‑answer with:

```text
"⚠️ No agent tag found – defaulting to BACKEND.  Add [AGENT] if another scope is intended."
```

*The response then proceeds using the presumed agent role.*

---

## 8. Extensibility Checklist

* [ ] Agent added to **Roster** table.
* [ ] Responsibilities & Deliverables described.
* [ ] Any dedicated tools registered in **Tools**.
* [ ] Workflows updated if affected.
* [ ] Version note added to **Change Log**.

---

## 9. Change Log

| Date         | Author       | Summary                                                    |
| ------------ | ------------ | ---------------------------------------------------------- |
| 2025‑06‑19   | @gpt‑autogen | Major restructure; added Memory, Tools, Workflows sections |
| *YYYY‑MM‑DD* | *@you*       | *Add your entry here*                                      |

---

Happy coding! ✨
