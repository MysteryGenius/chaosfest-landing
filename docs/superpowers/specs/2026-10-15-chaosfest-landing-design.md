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

Sections live in `components/sections/`, one file each. `page.tsx` maps over
the CMS `sections[]` array and renders each block by `_type`. Each section
takes its content as props — sections do not fetch. The order above is the
seeded default, not a hardcoded sequence: marketing can reorder it by
dragging in the Presentation tool, and the designer can reorder it without
touching data.

## Content: Sanity

### Why

Marketing currently edits in Wix. Moving them to a repo where copy is
hardcoded would make engineering the bottleneck for every word — a
regression in their day-to-day, and the reason the Resend-style
developer-first approach was rejected.

Sanity's Presentation tool gives marketing substantially more than
click-to-edit text. Verified against Sanity's editor documentation on
2026-10-15, the Presentation tool provides:

- **Click-to-edit overlays** — hover any element on a live preview of the
  real page, click it, and the editor jumps to that exact field, however
  deep in the structure
- **Drag-and-drop page building** — reorder sections by dragging them on the
  preview. Right-click a block for a context menu to reposition, remove or
  add content. Hold Shift while dragging for a zoomed-out minimap
- **Real-time preview** — the page updates as they type
- **Mobile viewport toggle** — check responsive behaviour without leaving
  the Studio
- **Shareable draft previews** — a link or QR code so others can review
  unpublished changes on a phone; revocable, and regenerating invalidates
  the old link

That is a genuine Wix-equivalent editing experience, not a developer tool
with a preview pane bolted on.

The Sanity MCP connector is already configured for this project; no code in
the repo uses it yet.

### Plan tier: Growth

Direction given: **cost is not a constraint; optimise for marketing's
experience.** Growth is therefore the floor, not a stretch.

Sanity's **free tier offers only Administrator and Viewer roles** — no
Editor. Administrator carries full project settings access including dataset
deletion; Viewer cannot edit. Neither suits a non-technical marketer, so
free is ruled out on capability, independent of budget.

**Growth, $15/seat/month**, unlocks the roles:

- **Editor** — edit and publish, no project settings access
- **Contributor** — draft and edit, cannot publish

and the editorial workflow features that matter for an event campaign:

- **Content Releases** — bundle edits across several documents and schedule
  them to go live together. The natural fit for a lineup, guest or
  ticket-release announcement, where a dozen changes must land at one
  moment, not trickle out.
- **Scheduled drafts** — queue a single document for a future publish time
- **Comments with @mentions** — marketing and reviewers resolve copy
  feedback inside the Studio instead of over chat screenshots
- **Tasks** — assign and track outstanding content work, e.g. the three card
  bodies Wix left blank

Budget: **$15/seat/month for each editing seat**; viewers are free. Seat
count is an open item below.

### Schema

Designed so marketing can restructure the page, not merely retype it.

Singleton `landingPage` document — one page, and marketing should not be
able to create a second. It holds:

- `hero` — eyebrow, headline, subheadline, image
- `sections[]` — an **ordered array of section blocks**, drag-and-drop
  reorderable in the Presentation tool
- `footer` — copyrightLine

Section block types available in `sections[]`:

- `aboutSection` — heading, body
- `showFloorSection` — heading, intro, `cards[]` (itself reorderable)
- `waitlistSection` — heading, dateLine, locationLine, buttonLabel,
  successMessage, consentLabel
- `card` (object, used inside `showFloorSection`) — title, body, image

The array-of-blocks shape rather than fixed named fields is what enables
drag-and-drop reordering and lets marketing add a second waitlist prompt or
drop About entirely without a developer. It costs a little more work now and
is the difference between a CMS they can compose in and one they can only
fill in.

Each field carries `description` helper text stating what belongs there and
roughly how long it should be. Each block type gets a `preview` config so
the array lists readable titles rather than "Untitled". Field-level
validation caps headline lengths so a long entry cannot visually break a
layout the designer has not finalised.

The three bodies Wix left as *"Describe one of your services"* ship
**empty**, so the Studio shows them as visibly unfilled work rather than
plausible filler nobody notices. Paired with a Task assigned to marketing,
the gaps are tracked rather than forgotten. This replaces the earlier
in-page `TODO` badge idea — an empty CMS field is the better signal, and
the copy is marketing's to write, not ours.

Sections render nothing for an empty optional body rather than collapsing or
erroring. `page.tsx` maps over `sections[]` and renders each block by
`_type`, so an unrecognised or empty block is skipped rather than crashing
the page.

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

Provider comparison as researched on 2026-10-15. Cost is explicitly **not**
a deciding factor per the direction given, so the comparison is on
marketing's day-to-day experience; prices are listed for planning only.

| | Marketing self-service | Automations | Vendor branding | Price for planning |
|---|---|---|---|---|
| **Kit** (Creator) | Visual builder, unlimited forms + landing pages | Visual automation canvas | None | $33/mo |
| Loops | Modern, clean UI | Visual loops | **Footer on free tier** | $49/mo |
| Brevo | Decent builder | Yes | None on paid | ~$9/mo, bills per send |
| Mailchimp | Familiar but degrading | Yes, tier-gated | None on paid | $16/mo |
| Resend | **None** — API-first | No | None | $20/mo |

**Kit on the Creator plan ($33/mo)** is chosen:

1. **Marketing runs campaigns unaided** — visual email builder, unlimited
   forms and landing pages. This requirement alone eliminates Resend, whose
   dashboard is developer-facing and would make every send a dev ticket.
2. **Visual automations** come with Creator, so marketing can build a
   welcome sequence and later a pre-event reminder series themselves. On the
   free tier these are locked; since cost is not a constraint, we take
   Creator from the start rather than discovering the ceiling mid-campaign.
3. **Audience tagging and segmentation** — segment by signup date or
   interest to message, say, artists separately from attendees.
4. **No vendor branding**, unlike Loops' free tier. This is an attendee's
   first contact with the event.
5. **The API upserts**, which removes a design problem (see below).

Mailchimp is rejected on your assessment, which the research supports: it
bills on stored rather than engaged contacts and gates features upward.
Brevo's per-send billing is awkward for announcement bursts, which is
exactly this site's usage pattern.

Because we start on Creator rather than free, there is no automation
ceiling to work around: marketing can build the welcome email and any later
sequences in Kit's own canvas, with no engineering involvement. The site's
only job is to get a verified address into the right Kit audience.

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

```sh
NEXT_PUBLIC_SANITY_PROJECT_ID=
NEXT_PUBLIC_SANITY_DATASET=
NEXT_PUBLIC_SANITY_API_VERSION=
SANITY_API_READ_TOKEN=      # drafts for Visual Editing; server-only
SANITY_REVALIDATE_SECRET=   # verifies the publish webhook
KIT_API_KEY=                # X-Kit-Api-Key; server-only
KIT_FORM_ID=                # or audience/tag id for waitlist signups
```

`.env.example` committed; `.env.local` git-ignored. No env files exist in the
repo yet. Only the `NEXT_PUBLIC_*` values may reach the browser; the tokens
and the Kit key are server-only.

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
- **Marketing-path checks** — the acceptance criteria that matter most,
  since the whole design is justified by them. Performed in the Studio with
  no code changes and no deploy:
  - Edit a heading in the Presentation tool; it appears on the page
  - Click an element on the preview; the editor jumps to that field
  - Drag a section to reorder it; the live page reflects the new order
  - Fill one of the three empty card bodies; it renders
  - Swap the hero image; it renders at the right size
  - Toggle the mobile viewport; the layout holds
  - Publish, then confirm the public page updates without a rebuild
- `prefers-reduced-motion: reduce` — all content readable, no motion
- Mobile width — no horizontal scroll; the six-card grid reflows
- Keyboard — Show Floor anchor and the waitlist form are reachable and
  submittable

## Division of ownership

Stated explicitly, because it is the point of these tool choices:

| Concern | Owner | Needs a developer? |
|---|---|---|
| Page copy, headings, images | Marketing, in Sanity | No |
| Section order, adding/removing sections | Marketing, in Sanity | No |
| Scheduling a coordinated announcement | Marketing, Content Releases | No |
| Welcome email and any sequences | Marketing, in Kit | No |
| Campaign sends and segmentation | Marketing, in Kit | No |
| Layout, styling, motion | Designer, then engineering | Yes |
| New section *types* | Engineering | Yes |

The confirmation email is deliberately **Kit's job, not the site's**. The
Server Action adds the subscriber and returns; Kit's own automation sends
the welcome. One place to edit that email, owned by the people who write it,
and no email template in the codebase to go stale.

## Open items for the reviewer

1. **Seat count** — how many marketing people need edit access? Sanity
   Growth bills $15/seat/month for editors; viewers are free.
2. **Accounts and credentials** — a Sanity project and dataset, and a Kit
   account on Creator with an API key, must exist before the integrations
   can be verified end to end.
3. **Sending domain** — Kit sending from `@chaos-fest.com` needs that
   domain's DNS records added. Who administers DNS?
4. **Welcome email content** — the spec assumes marketing writes and owns
   it in Kit. If they would rather the site send a plain confirmation, say
   so; it is a small addition but moves ownership back to engineering.
