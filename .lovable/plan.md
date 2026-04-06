

## Make Mirror View Responsive on Mobile

The current mirror interface uses `ResizablePanelGroup` with a horizontal split and a drag handle — this doesn't work on small screens. On mobile, we need to stack the panels vertically with a tab switcher instead.

### Approach

**Single file change: `src/pages/ProjectMirror.tsx`**

1. **Import `useIsMobile`** from `@/hooks/use-mobile`

2. **Top bar (lines 179-245)**: Wrap the action buttons in a scrollable row and allow the title input to shrink. On mobile, move the confidence meter + buttons below the title row or make them horizontally scrollable.

3. **Approval banner (lines 248-272)**: Stack vertically on mobile — text on top, buttons below.

4. **Split panels → tabbed view on mobile (lines 274-317)**:
   - When `isMobile` is true, replace `ResizablePanelGroup` with a simple tab interface (two tabs: "Brief" / "Mirror") using state to toggle which panel is visible
   - Each tab shows the full-height textarea or spec content
   - When `isMobile` is false, keep the existing resizable side-by-side layout unchanged

### Technical details

- Use a `const [activeTab, setActiveTab] = useState<"brief" | "mirror">("brief")` for mobile tab state
- Tab bar: two buttons styled with border-bottom highlight, sitting where the panel headers currently are
- No new dependencies needed — just conditional rendering based on `useIsMobile()`
- The Generate button should be accessible from both tabs on mobile (keep it in the top bar)

