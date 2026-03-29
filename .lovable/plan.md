

# Add "Why Not ChatGPT?" Competitive Differentiation Section

## What we're building

A new section placed **after the Features bento grid** that positions SpecMirror against generic conversational AI. The core message: SpecMirror's AI is purpose-built and trained on thousands of technical documentation sources, not a generic chatbot.

## Section design: "Built different"

### Layout: Comparison table + training depth visual

**Top half: Side-by-side comparison strip**
A two-column layout contrasting "Generic AI" (left, dimmed/muted) vs "SpecMirror" (right, highlighted with accent glow). Each row shows a capability:

| Capability | Generic AI | SpecMirror |
|---|---|---|
| Output format | Freeform chat, copy-paste | Structured production spec |
| Domain knowledge | General purpose | Trained on 10,000+ technical docs |
| Consistency | Varies per prompt | Standardized every time |
| Security | Data sent to third parties | End-to-end encrypted, zero-knowledge |
| Integration | None | Syncs to your PM tools |

Each row animates in on scroll. Generic AI side uses `text-muted-foreground` and a subtle red/gray X icon. SpecMirror side uses accent-colored check icons with a faint glow.

**Bottom half: "Training depth" visual**
A horizontal bar or layered stack showing categories of documentation the AI was trained on: API references, RFC standards, infrastructure patterns, security best practices, database schemas, CI/CD pipelines. Each category is a small glass pill/chip that fades in staggered.

Tagline above: **"Not another chatbot."** with accent gradient highlight on "chatbot."

Subtext: *"SpecMirror's AI is hyper-trained on thousands of real-world technical documents, architecture patterns, and production specs. It doesn't guess. It knows."*

### Styling
- Same `FadeSection` wrapper for scroll animations
- Same `SectionHeader` component for consistent branding
- Glass card with `border-white/[0.06] bg-white/[0.02] backdrop-blur-xl`
- Comparison uses a subtle divider line between columns
- No em dashes in any copy

## Files changed

| File | Change |
|---|---|
| `src/pages/Landing.tsx` | Add new section after Features bento grid (~80 lines) |

## Section order after change
1. Nav
2. Hero
3. How it works
4. Features (bento grid)
5. **Why not ChatGPT? (NEW)**
6. Live preview / Mirror demo
7. For every team
8. FAQ
9. Footer CTA

