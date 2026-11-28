# AI Kitchen — routing as configured and as used

Configured: `.claude/agents/` (12 agents; Haiku search/edits, Sonnet implement/test/cross-review, Opus design/3D/bugs/architecture/security/review/acceptance), routing in `CLAUDE.md`, project default `.claude/settings.json` = sonnet / medium. No Fable anywhere.

Project agents load at session start, so the first wave ran as `general-purpose` with `model: opus`; later waves used the named agents. Actual use is logged in 28.

Limits met: the Opus 5-hour and weekly usage limits stopped agents four times; each resumed from its saved transcript, nothing restarted from scratch. Worktrees under `.claude/worktrees` failed on Windows path length; short-path worktrees (`C:\w\*`) with a junction to `node_modules` were used instead.
