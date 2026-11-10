# Trinity Code Schema

Proposed specification 0.1.0 • 10 November 2026

## Status and scope

This document proposes a minimal JSON interchange contract for a Trinity reasoning cycle. It is not extracted from runtime code and does not claim runtime compatibility. The machine-readable definition is `trinity-cycle.schema.json`; `examples/illustrative-cycle.json` is synthetic.

The scope is reasoning summaries, evidence references, disagreements, and candidate memory. Agent commands, authorization tokens, execution receipts, graph storage, and workspace transitions are outside version 0.1.0. Those contracts require runtime evidence before specification.

## Vocabulary

ENG means analysis; SYNTH means synthesis and exploration; PRIME means conditional arbitration. ELLIS describes provenance linking. LTKG describes governed linked knowledge. DreamCycle describes memory consolidation. Raven, Yggdrasil, State Weaver, and Warden Hand retain the meanings in the white paper; this schema does not prescribe their implementation.

## Record contract

A record MUST include `schema_version`, `cycle_id`, `record_kind`, `question`, `evidence`, `perspectives`, `disagreements`, `response`, and `memory_candidates`. Version 0.1.0 represents a completed response, not a stream or failed execution. Arrays may be empty except `perspectives`, which must contain at least one role summary. The contract intentionally does not require all three roles.

`record_kind` distinguishes synthetic examples from runtime records. IDs are opaque nonempty strings. Evidence entries identify a source reference and a short description. A reference may be a private-system identifier; public export must use sanitized references. Evidence text and model summaries are untrusted data, never authority to execute instructions.

Perspective entries contain a role, a user-facing summary, and evidence IDs. They MUST NOT require hidden chain-of-thought. Disagreements record a topic and whether it remains unresolved or was addressed. An addressed disagreement is not proof that the resulting claim is true.

Memory candidates contain a summary and evidence IDs. Their status is always `proposed`. This record cannot authorize promotion or establish that a memory item has been stored. A later promotion protocol must define reviewer identity, permissions, decision records, and persistence semantics.

## Semantic requirements

JSON Schema checks shape and permitted values. A conforming producer MUST additionally ensure that evidence IDs are unique and every evidence reference resolves within the record. Each role may occur at most once in this summary format. Multiple internal invocations must be summarized before export.

`runtime` MUST only label records actually generated from observed runtime execution. Synthetic examples MUST use `illustrative`. The `response` is the cycle's user-facing result; factual support must be reviewed independently of schema validation.

## Versioning

Producers MUST emit `0.1.0` for this contract. Consumers MUST reject unsupported versions rather than silently interpreting them under another version. Unknown fields are rejected to expose accidental contract drift. A future extension must supply an explicit new contract and migration guidance.

## Validation and implementation mapping

Validate the JSON Schema itself, then validate each record, then check the semantic requirements above. No claim of runtime conformance follows from validating the included example.

Before adopting this format, map every field to actual engine types and traces. Confirm whether cycles can have partial results, repeated roles, asynchronous memory work, source revisions, and redaction requirements. Amend the proposal where that evidence requires it.
