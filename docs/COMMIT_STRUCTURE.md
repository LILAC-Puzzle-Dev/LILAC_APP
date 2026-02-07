# LILAC APP - Commit Structure

To maintain a clean and organized codebase, all developers must follow the standardized commit message format. This ensures that changes to features are easy to track.

## Basic Structure
Every commit message must follow this syntax:
`<tag>: <message>`

## Approved Tags

| Tag | Usage | Example |
| :--- | :--- | :--- |
| **Feature** | Adding brand-new functionality or commands. | `Feature: add puzzle-mastery score tracking` |
| **Fix** | Repairing bugs, crashes, or logic errors. | `Fix: resolve role hierarchy error in score update` |
| **Improvement** | Refining existing code, UX, or performance. | `Improvement: add tiered role removal logic` |
| **Internal** | Documentation, comments, or repository maintenance. | `Internal: update COMMIT_STRUCTURE instructions` |
| **Backend** | Database schema changes or configuration updates. | `Backend: add FeatureSwitch model for toggles` |

## Best Practices
* **Use Present Tense:** Write "Add feature" instead of "Added feature."
* **Be Specific:** Instead of `Fix: bug`, use `Fix: Handle undefined channel in registerDailyCryptic`.
* **No Period at End:** Do not end the commit message with a period.

---

### Developer Checklist before Committing:
1.  **Check Models:** Ensure any schema changes are reflected in the `models/` directory.
2.  **Verify Permissions:** If adding commands, ensure `PermissionFlagsBits` are correctly set.
3.  **Check Feature Switches:** Ensure any new scheduled tasks or commands check the `FeatureSwitch` state before execution.