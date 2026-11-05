# Design: 모두돌봄

The locked system. Every Hallmark run reads this first and pages share it. Change it on purpose; the file is the rule.

- Brand book and live component previews: the Claude Design System artifact <https://claude.ai/artifact/E4ZG6scBSJ4dygGEngKh3E> (private until shared).
- Source of truth in this repo: `design/system/tokens.json`. `design/tokens.css` mirrors it; `design/system/components/bundle.css` holds the component rules.

## System
- Genre: playful
- Shape of the first page: app screen (mobile, bottom tab bar)
- Theme: Hum (deal 3/3, seed gps-3ff9·b0667241·2026-11-05·r0), faces swapped for Hangul: Chillax has no Hangul and its host is unreachable from artifacts
- Axes: light/rounded-sans/chromatic-yellow · posture: full-palette · dark theme: navy ink paper

## Tokens
`design/tokens.css` is what a page imports. The roles:
```css
:root {
  --paper: oklch(97% 0.012 95);  --paper-2: oklch(94.5% 0.018 95);  --paper-3: oklch(91% 0.022 95);  --card: oklch(98.8% 0.007 95);
  --ink: oklch(20% 0.014 255);  --ink-2: oklch(29% 0.014 255);  --muted: oklch(47% 0.014 255);  --rule: oklch(87% 0.016 95);  --edge: oklch(83% 0.04 88);
  --pear: oklch(87% 0.175 96);  --pear-deep: oklch(72% 0.16 92);  --on-fill: oklch(20% 0.014 255);
  --blue: oklch(50% 0.17 250);  --coral: oklch(70% 0.2 22);  --mint: oklch(82% 0.15 152);  --mint-deep: oklch(48% 0.12 155);
  --error: oklch(52% 0.19 27);  --focus: oklch(50% 0.17 250);
  --font-display: "Jua", ui-rounded, "Apple SD Gothic Neo", sans-serif;
  --font-body: "IBM Plex Sans KR", "Apple SD Gothic Neo", "Malgun Gothic", sans-serif;
  --radius-input: 14px;  --radius-stock: 16px;  --radius-card: 24px;  --radius-pill: 999px;
  --control-lg: 54px;  --control-md: 44px;  --control-sm: 36px;  --tabbar: 64px;
}
```
Each accent owns one job: `pear` the one primary action, `blue` links, route lines and focus, `coral` one loud moment per screen (new request, urgent, unread count), `mint` growth and done. Text on any fill is `on-fill`. Every text pair holds 4.5:1 in both themes. Type: Jua only for `display` 28, `title-1` 22, `title-2` 18 and `figure` 32; IBM Plex Sans KR 400/500/600 for `body` 16, `body-lg` 17, `label` 14 and `caption` 13. Spacing 4, 8, 12, 16, 24, 32, 48.

## Controls
- Primary: `pear` card stock with grain · `radius-stock` · `control-lg` 54px pinned at the bottom of a screen, or `control-md` 44px inline · a 5px `pear-deep` edge below that rises to 7px on hover and presses to 1px.
- Secondary: `card` with a 1px `rule` ring and a 5px `edge` below · same radius and height. Text button: `blue`, underlined.
- Selected state (tab, chip, checkbox): `ink` fill with `paper` text, never colour alone.
- Every data region draws loading (shaped skeleton), empty (one sentence, one action), error (what broke, what to do) and full.

## Motion
- Character: brisk; `--dur-micro` 120ms and `--dur-short` 220ms on `--ease-snap`, the spring on the primary button only; state, never decoration; under reduced motion everything ends at once.

## Exports
`design/tokens.css` and `design/base.css` in this project; `design/system/` is a copy of the Design System artifact's files (tokens.json, README.md brand book, component previews and guidelines). Tailwind, DTCG or shadcn blocks are added here on request.
