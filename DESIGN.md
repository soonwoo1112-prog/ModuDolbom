# Design: 모두돌봄

The locked system. Every Hallmark run reads this first and pages share it. Change it on purpose; the file is the rule.

- Brand book and live component previews: the Claude Design System artifact <https://claude.ai/artifact/E4ZG6scBSJ4dygGEngKh3E> (private until shared).
- Source of truth in this repo: `design/system/tokens.json`. `design/tokens.css` mirrors it; `design/system/components/bundle.css` holds the component rules; `design/system/README.md` is the brand book.
- Structure follows 당근's SEED Design (Apache-2.0) by the owner's request: see `design/seed-reference.md`. SEED's structure is borrowed, not its identity: no carrot orange, no 매너온도, no Karrot icons.

## System
- Genre: modern-minimal (SEED-structured mobile app)
- Shape of the first page: app screen (mobile, bottom navigation with 5 tabs)
- Theme: custom (vibe: "flat white neighbourhood app, one forest green"), replaces the earlier Hum deal by the owner's request
- Axes: light/system-sans/forest-green · posture: one accent · light and dark themes

## Tokens
`design/tokens.css` is what a page imports. Names follow SEED's role grammar `bg|fg|stroke`-`role`-`strength`:
```css
:root {
  --bg-layer-default: oklch(100% 0 150);  --bg-layer-basement: oklch(96.5% 0.004 150);  --bg-neutral-weak: oklch(95.5% 0.004 150);
  --fg-neutral: oklch(20% 0.01 150);  --fg-neutral-muted: oklch(40% 0.01 150);  --fg-neutral-subtle: oklch(52% 0.008 150);
  --bg-brand-solid: oklch(50% 0.13 152);  --bg-brand-weak: oklch(96.5% 0.025 152);  --fg-brand: oklch(46% 0.12 152);  --fg-on-brand-solid: oklch(100% 0 150);
  --bg-neutral-solid: oklch(25% 0.01 150);  --fg-critical: oklch(50% 0.19 27);  --fg-informative: oklch(50% 0.16 250);
  --stroke-neutral-subtle: oklch(92% 0.004 150);  --stroke-neutral-solid: oklch(60% 0.006 150);  --stroke-focus-ring: oklch(52% 0.16 250);
  --font-sans: -apple-system, BlinkMacSystemFont, "Apple SD Gothic Neo", "Pretendard Variable", Pretendard, "Noto Sans KR", "Malgun Gothic", sans-serif;
  --x1: 4px; --x2: 8px; --x3: 12px; --x4: 16px; --x5: 20px; --x6: 24px; --x14: 56px;
  --r2: 8px; --r3: 12px; --r4: 16px; --full: 9999px;
  --button-medium: 40px; --button-large: 52px; --input-large: 52px; --top-navigation: 56px; --bottom-navigation: 56px;
}
```
38 colour tokens in two themes; every text pair holds 4.5:1 and every control border and focus ring 3:1 in both. Forest green marks only the one primary action per screen, the 같은 아파트 badge and the checked checkbox; a selected list row is a neutral surface step (`bg-neutral-weak`); everything else is neutral. Type is the platform sans in 400/500/700 on SEED's t1–t10 scale, used through semantic styles: `screen-title` t8 Bold (700, never 800), `section-title` t6 Bold, `list-title` t5 Medium, `body` t5, `label` t4 Medium, `detail` t3, `tag` t2, `figure` t9 Bold.

## Controls
- Primary: `bg-brand-solid` flat fill · `r2` at Medium 40px, `r3` at Large 52px (full-width bottom CTA) · white label, Bold.
- Secondary: Neutral Solid (`bg-neutral-solid`), Neutral Weak (`bg-neutral-weak`, the default), Neutral Outline, Ghost · same radius and heights.
- Pressed: the pressed colour token plus a 2px shrink on basis max(height, width/4, 24); neighbours never move.
- Selected state: `bg-neutral-solid` fill or bold `fg-neutral`, never colour alone; checkbox is the one brand-filled control.
- Every data region draws loading (Skeleton), empty and error (Result Section) and full.
- Type sizes and line heights are written in rem (16px = 1rem), never px, so the system text size setting scales them; the app build maps them to Dynamic Type and Android font scale.
- Touch targets are at least 44px; the profile opens from a row's photo, the rest of the row selects.

## Motion
- No overshoot springs: lenses, checks and taps settle on `--ease-out-expo` without bouncing past their size.
- Character: brisk; colour 150ms on `--ease-easing`, press 150ms on `--ease-enter`; screen transitions only above 200ms; under reduced motion the shrink and shimmer stop.

## Feed posts (decided by blind test, 2026-11-09)
- A post keeps the shape of what it holds: a walk post leads with a 4:3 photo, then one fact line (dog name in Bold, then duration, distance, place), then the text; a guardian's note leads with the text and a smaller square photo; a short post sits as a thumbnail beside its text.
- The author is a small byline under the post (initial, name, time) that links to the profile; there is no per-post "ask this sitter" button.
- The feed opens with the dogs walked in the neighbourhood today, as photos with names; tapping one shows only that dog's posts. Posts sort by most likes by default, with latest as the other choice.
- The same post layout is used in the sitter profile's and the dog profile's walk-record tabs (no author byline on the sitter's own tab; on the dog's tab the bold name is who walked).
- The same test kept the form-led booking screen (1) and the tabbed sitter profile (2-1) over sentence-led and photo-led versions, so those patterns are not adopted.

## Direction under review (owner, 2026-11-09)
The owner finds the current screens unconvincing overall and wants the next pass to follow apps that feel obvious to use: Toss (bold motion that reads as professional), KREAM, Apple's built-in apps, Karrot. Plain, intuitive structure where each screen says exactly what it is.

## Signature (unslop pass, 2026-11-10)
- The logo's smiling path is the one signature: the walk route on the booking screen's preview card is drawn with the same arc. Short captions end without a period; text at 17px and under keeps zero tracking.

## Brand (decided 2026-11-09)
- Logo: the side-by-side mark (a neighbour, a paw, a smiling path); files and rules in `design/brand/logo/README.md`.
- Display type: SUIT (OFL) for headings, numbers and the wordmark, chosen for its rounder, friendlier figures and wide weight range; body text stays a plain Korean sans until the app's type tokens are switched.
- Research behind the system: `design/system-research.md`.

## Departures from the Hallmark floor, by the owner's SEED request
- System sans as the only face (Hallmark bans system-ui as a default; here it is the brief).
- SEED Tag Group separators between meta items in lists (`md-tags`), drawn as 2px dots, not typed middle dots.
- Lucide icons (ISC) in the bottom navigation, buttons and placeholders.

## Exports
`design/tokens.css` and `design/base.css` in this project; `design/system/` is a copy of the Design System artifact's files (tokens.json, README.md brand book, 11 component previews and guidelines, cover).
