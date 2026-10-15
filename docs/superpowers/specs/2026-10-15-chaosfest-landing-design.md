# ChaosFest Landing Page — Design

**Date:** 2026-10-15
**Status:** Awaiting review

## Purpose

Replace the placeholder splash in `app/(core)/page.tsx` with a single-page
marketing landing for ChaosFest (9–11 July 2027, Singapore), structurally
cloned from the existing Wix site at
`https://mello977.wixsite.com/my-site-1`.

This is a **placeholder build**. A designer will be hired to reskin it. Two
consequences shape every decision below:

1. Layout fidelity to Wix matters more than visual originality — the designer
   needs a faithful structural reference, not our aesthetic opinions.
2. Marketing must be able to edit content and send campaigns without a
   developer. The site outlives this layout; the content model and the
   marketing tooling do not get thrown away in the reskin.

## Source analysis

The Wix site is a template with ChaosFest branding applied. It is not a
finished design. Defects carried by the source, and how we handle each:

| Wix defect | Handling |
|---|---|
| "Organized Play & Tournaments" body reads *"Describe one of your services"* | Empty in CMS; marketing writes it |
| "Learn To Play Sessions" body reads *"Describe one of your services"* | Empty in CMS; marketing writes it |
| Expo Hall body truncated: *"The floor combines enter"* | Empty in CMS; marketing writes it |
| CTA says `March 15, 2024 \| 123 Innovation Drive, New York` | **Corrected** to 9–11 July 2027, Singapore |
| All six Show Floor cards share one image | CMS field per card; marketing supplies art |
| Footer credits `© 2026 by WEAREWIREFRAME` | Replaced with existing `%20 × Chaotic Stupid GM` + `© 2026 ChaosFest` |
| Seven font families loaded (Averia, Baskerville, Work Sans, Corben, DIN Next, Avenir, Courier PS) | Not cloned; keep repo's existing Geist until designer decides |

The date contradiction is the one place we deliberately diverge from the
source: the Wix header already says July 2027 Singapore, so the CTA block is
unedited template default contradicting the site's own content. Cloning it
would clone a bug.

Copy that **is** real in the source and will be seeded verbatim: the hero
headline, the About paragraph, the Show Floor intro, and the Artist Alley,
Main Stage and Lending Library card bodies.

## Page structure

Single route. `app/(core)/layout.tsx` route group, `Header` and `Footer`
composition stay as they are.

```
Header       sticky · "9 - 11 July 2027 | Singapore" · Show Floor anchor · socials
Hero         "SOUTH EAST ASIA'S BIGGEST TABLETOP GAME & TTRPG EVENT" · banner · waitlist CTA
About        3-day convention · publishers, retailers, creators, fans
ShowFloor    intro + 6 cards (Expo Hall, Artist Alley, Organized Play,
             Main Stage, Lending Library, Learn To Play)
Waitlist     "JOIN US AT CF" · 9-11 July 2027 · Singapore · email form
Footer       %20 × Chaotic Stupid GM · © 2026 ChaosFest
```

Wix's `Agenda` and `More` nav items are **dropped** — there is no content
behind them and no second route. `Show Floor` remains as a working anchor.
When Agenda content exists it is a new section plus a nav entry, not a
rebuild.

Sections live in `components/sections/`, one file each, composed by
`page.tsx`. Each takes its content as props from the page's Sanity query —
sections do not fetch. This keeps them trivially reusable when the designer
reorders the page.

## Content: Sanity

### Why

Marketing currently edits in Wix. Moving them to a repo where copy is
hardcoded would make engineering the bottleneck for every word — a
regression in their day-to-day, and the reason the Resend-style
developer-first approach was rejected.

Sanity's Presentation tool with Visual Editing lets marketing click text on
a preview of the real page and edit in place. That is the closest available
analogue to the Wix editing model they already know.

The Sanity MCP connector is already configured for this project; no code in
the repo uses it yet.

### Plan tier — requires spend

Sanity's **free tier offers only Administrator and Viewer roles**. There is
no Editor role on free. Administrator includes full access to project
settings and dataset deletion; Viewer cannot edit. Neither is appropriate
for a non-technical marketer.

**Growth, $15/seat/month**, unlocks:

- **Editor** — edit and publish, no project settings access
- **Contributor** — draft and edit, cannot publish

Budget approximately **$30/month for two marketing seats**. Viewers remain
free. This is a deliberate, required cost: granting a non-technical marketer
Administrator on the free plan is how datasets get deleted.

### Schema

Singleton `landingPage` document, because there is one page and marketing
should not be able to create a second:

- `hero` — eyebrow, headline, subheadline, image
- `about` — heading, body
- `showFloor` — heading, intro, `cards[]`
- `card` (object) — title, body, image
- `waitlist` — heading, dateLine, locationLine, buttonLabel, successMessage,
  consentLabel
- `footer` — copyrightLine

Each field carries `description` helper text telling marketing what belongs
there and roughly how long. The three bodies Wix left as
*"Describe one of your services"* ship **empty**, so the Studio shows them
as visibly unfilled work rather than plausible-looking filler that nobody
notices. This replaces the earlier plan for in-page `TODO` badges — an empty
CMS field is a better signal, and it is marketing's to fill rather than
ours.

Sections render nothing for an empty optional body rather than collapsing or
erroring.

### Implementation notes

- Studio mounted at `/studio` in this app — one deploy, one URL, no second
  project to host.
- `next-sanity` for the client; Visual Editing needs Draft Mode plus a
  preview route.
- Images move to Sanity's CDN so marketing can swap the hero banner without
  git. `next/image` with the Sanity loader.
- Page data fetched in the Server Component with Next's cache; a webhook or
  tag revalidation keeps published edits fast without full rebuilds.

## Waitlist: Kit

### Why Kit

Replaces the "Get Tickets" CTA, since tickets do not exist yet.

Provider comparison as researched on 2026-10-15:

| | Free tier | Paid entry | Marketing self-service | Catch |
|---|---|---|---|---|
| **Kit** | **10,000 subscribers**, unlimited broadcasts | $33/mo | Visual builder, unlimited forms | Automations paid-only |
| Loops | 1,000 contacts | $49/mo | Good UI | Loops footer on free-tier emails |
| Brevo | ~300 emails/day | ~$9/mo | Decent builder | Bills per send; awkward for bursts |
| Mailchimp | 250 contacts | $16/mo | Familiar but degrading | Bills on stored contacts; feature-gating |
| Resend | 1,000 contacts | $20/mo | **None** — API-first | Every campaign is a dev task |

Kit is chosen because:

1. **10,000 free subscribers with unlimited broadcasts** — 40× Mailchimp's
   free tier. A waitlist building toward July 2027 may never incur cost.
2. **Marketing sends campaigns unaided** via the visual builder. This is the
   requirement that eliminated Resend.
3. **The API upserts**, which removes a design problem (see below).
4. **No vendor branding on emails at $0**, unlike Loops — this is an
   attendee's first contact with the event.

Known limitation: visual automation sequences require Creator tier
($33/mo). A single confirmation email is achievable below that; a welcome
drip is not. Acceptable, and a clear trigger for when to upgrade.

### Flow

Server Action in `app/actions/waitlist.ts`, called by a client form
component.

1. Client-side `type="email"` validation for immediate feedback
2. Server Action re-validates — the client is never trusted
3. `POST https://api.kit.com/v4/subscribers` with `X-Kit-Api-Key` header and
   `{ email_address }`
4. Return a typed result the form renders as success or error

Details:

- **Duplicates are a non-problem.** Kit's endpoint upserts: `201` for a new
  subscriber, `200` for an existing one. Both are success. No
  error-swallowing, and no disclosure of who is already signed up.
- **`422`** means a malformed address — show a field-level message.
- **`401`** or network failure — show a generic retry message and log
  server-side. Never surface provider internals to the visitor.
- **`useActionState` + `useFormStatus`** so the form works without JS and
  pending state comes free.
- The API key is **server-only**, never prefixed `NEXT_PUBLIC_`.
- Consent checkbox mirrors Wix's *"Yes, subscribe me to your newsletter."*
  Label text is CMS-driven so marketing can adjust wording for compliance.

### Environment

```
NEXT_PUBLIC_SANITY_PROJECT_ID=
NEXT_PUBLIC_SANITY_DATASET=
SANITY_API_READ_TOKEN=
KIT_API_KEY=
```

`.env.example` committed; `.env.local` git-ignored. No env files exist in the
repo yet.

## Interactions

Playful, per direction: this build's job is to feel alive even though the
visuals are placeholder. GSAP 3.14 is already a dependency and currently
unused.

- **Wordmark jitter on load** — letters settle with slight rotation, reusing
  the existing black/italic `Chaos`*fest* treatment
- **Tumbling d20 accents** — inline SVG dice rotating on scroll, as section
  dividers
- **Card hover** — lift plus a small per-card rotation, so the grid reads
  hand-placed rather than grid-rigid
- **Waitlist success** — dice-roll flourish on submit

Structure:

- All motion in `components/motion/`. Sections consume hooks; no inline GSAP
  calls in section files. The designer can delete the directory and the site
  still works.
- `ScrollTrigger` registered once in a client provider.
- One `useGsap` hook that **no-ops under `prefers-reduced-motion`**, so
  individual sections cannot forget to honour it. Content is never
  animation-dependent: everything is visible with motion disabled.
- Dice SVGs are `aria-hidden`; they are decorative.

## Repo fixes folded in

Pre-existing issues in files this work touches:

1. **Header seam** — `components/Header.tsx:3` hardcodes `#f7e7cb` while
   `app/globals.css:5` sets `--background: #f4f1ec`. The sticky header shows
   a visible seam on scroll. Use the token.
2. **Dead class** — `app/(core)/page.tsx:16` has both `inline-block` and
   `flex`; `flex` wins. Also `h-screen` with `py-16` overflows short
   viewports. Both disappear with the splash.
3. **Asset filenames** — `chaosfest03 -5a.png`, `ChaosFest01 copy - Copy.png`
   and similar contain spaces and `copy` suffixes, causing URL-encoding
   friction. Rename on migration into Sanity.
4. **Untracked images** — `public/images/` is absent from git, so a fresh
   clone builds broken. Commit the originals before migrating, so the assets
   have history even once Sanity serves them.
5. **README** — still `create-next-app` boilerplate. Needs setup steps for
   Sanity and Kit env vars, or the next person cannot run the project.

Out of scope: unrelated refactoring, dependency upgrades, test
infrastructure.

## Verification

No test runner is installed and this spec does not add one — the work is
presentational and the meaningful risk sits in the Server Action, not in
component rendering.

- `pnpm build` passes
- `pnpm lint` (biome) clean
- Waitlist: new address succeeds; repeat address succeeds; malformed address
  shows a field error; request with an invalid key shows the generic error
  and logs server-side
- Marketing-path check: edit copy in Studio, confirm it appears on the page
  without a deploy
- `prefers-reduced-motion: reduce` — all content readable, no motion
- Mobile width — no horizontal scroll; the six-card grid reflows
- Keyboard — Show Floor anchor and the waitlist form are reachable and
  submittable

## Open items for the reviewer

1. **Sanity Growth at ~$30/mo for two seats** is required for marketing to
   have the Editor role. Confirm the spend.
2. **A Sanity project and dataset** must exist, plus a Kit account and API
   key, before the integration work can be verified.
3. **Seat count** — how many marketing people need edit access?
4. **Confirmation email** — send one on signup, or collect addresses
   silently for now? Spec assumes a single confirmation email, no drip
   sequence.
