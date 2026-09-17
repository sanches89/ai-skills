# Listing on skills.sh

skills.sh is the directory and leaderboard fed by the `skills` CLI. There is no
submission step.

## How a skill appears

- A skill is listed automatically the first time someone installs it with
  `npx skills add`. The install is counted through the CLI's anonymous
  telemetry.
- The leaderboard ranks by install counts and by activity over the last eight
  weeks.
- A skill is defined by a GitHub repository holding a `SKILL.md` and a README.

## URLs

| What | Pattern |
| --- | --- |
| Repository page | `https://skills.sh/<owner>/<repo>` |
| Skill page | `https://skills.sh/<owner>/<repo>/<skill-name>` |

---

Reference: https://skills.sh/docs, https://skills.sh/docs/faq,
https://skills.sh/docs/api
