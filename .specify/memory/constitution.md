<!--
Sync Impact Report
- Version change: template → 1.0.0 (MINOR: initial ratification)
- Modified principles: n/a (first version)
- Added sections: Core Principles I–IX, Technology Stack & Constraints (Phase 1 static site /
  Phase 2 Laravel), Development Workflow & Quality Gates, Governance
- Removed sections: none
- Templates requiring updates: none (plan/spec/tasks templates read this file at runtime);
  specs/001-serviglass-site-refresh/plan.md Constitution Check gates G1–G5 are superseded by
  Principles VIII and IX
- Follow-up TODOs: create docs/glossary.md when the first Laravel feature introduces business entities
-->

# Serviglass Girardot Platform Constitution

The product starts as the public website of Serviglass Girardot S.A.S. (a static site today) and
will grow into a Laravel application (quotations, catalog, customer self-service and other modules
defined by future feature specs). This constitution governs both phases. Rules marked **Phase 2**
apply from the moment the Laravel application is bootstrapped; everything else applies now.

## Core Principles

### I. Modular Layered Architecture (NON-NEGOTIABLE, Phase 2)

The application is a **modular monolith** on Laravel. Business capabilities live in bounded modules
under `app/Modules/<Module>`. The first modules are `Site` (public website pages and content),
`Identity` (auth, users, roles, permissions) and `Shared` (money, base enums, cross-cutting
contracts); every further module is introduced by a feature spec, never ad hoc.

Inside every module the dependency direction is fixed and MUST NOT be inverted:

`Http` (Controllers, FormRequests, Resources, Blade views) → `Actions` (one write use case each) /
`Queries` (read use cases) → `Domain` (Eloquent models, enums, value objects, pure domain services)
→ `Infrastructure` (mail, PDF, storage, external APIs, bound behind interfaces).

- Controllers MUST be thin: authorize (Policy), validate (FormRequest), call exactly one Action or
  Query, return a response. No business rules in controllers, routes, Blade views or migrations.
- Business rules live in Actions (`ConfirmQuotationAction`) and pure domain services.
- A module exposes its behaviour only through its Actions, Queries and domain events. Another module
  MUST NOT query its tables directly nor reach into its models from Blade or controllers.
- Each module owns its `ServiceProvider`, routes, migrations, policies, lang keys, factories and tests.
- The public website routes (`/`, `/nosotros`, `/servicios`, `/contacto`) are the first routes of the
  `Site` module and keep the same URIs the static site exposes today.

**Rationale**: the website is the entry point of a system that will add commercial and operational
modules. Explicit module boundaries let them be added without rewriting the core.

### II. SOLID & Explicit Design

- **SRP**: one class, one reason to change. Actions are verbs exposing a single public `handle()`.
- **OCP**: variable behaviour goes behind an interface with strategy implementations (numbering,
  pricing, PDF rendering, notification channels). New behaviour is a new class, not a new `switch`.
- **LSP / ISP**: interfaces are small and role-based; no fat "manager" or "helper" interfaces.
- **DIP**: Actions and domain services depend on interfaces registered in the module
  `ServiceProvider`. Domain code MUST NOT reference concrete infrastructure or Laravel Facades;
  dependencies are constructor-injected.
- Eloquent models contain relationships, casts, scopes, accessors and simple invariants only. No
  orchestration in models. Observers are limited to technical concerns (audit trail).
- Data crosses layer boundaries as readonly DTOs, never as raw request arrays.
- No god classes, no static helper classes holding business logic, no traits used to share
  behaviour between unrelated aggregates.
- In the static phase the same spirit applies to the front end: one responsibility per CSS layer
  (tokens, base, layout, components, sections, footer, responsive, reduced motion) and one
  responsibility per JavaScript module (today: section routing only).

**Rationale**: SOLID applied at the Action/Strategy level keeps the code testable and lets rules the
client will refine later change without touching the use cases.

### III. Ubiquitous English Naming & Domain Glossary

- Every identifier MUST be in English: classes, methods, variables, enums, DB tables and columns,
  route names, config keys, events, jobs, tests and code comments. Commit messages are in English
  from Phase 2 onwards.
- Spanish appears only in user-facing text through Laravel localization (`lang/es/*.php`, `__()`).
  Hardcoded UI strings in Blade, controllers or JS are forbidden in Phase 2.
- Route **URIs** are the exception: they are user-facing and stay in Spanish (`/servicios`,
  `/contacto`), while route **names** are English and dotted (`site.services`, `site.contact`).
- Conventions: `StudlyCase` classes and enums, `camelCase` methods and variables, `snake_case`
  plural table names and columns, `kebab-case` URIs, booleans `is_*` / `has_*` / `can_*`,
  timestamps `*_at`, dates `*_date`, money columns `*_amount` + `currency_code`.
- Abbreviations are forbidden unless documented in the glossary.
- Transitional rule: the static site (`index.html`, `styles.css`, `scripts.js`) uses Spanish class
  and function names. It is grandfathered until it is ported to Blade components, at which point the
  English names apply. New static-phase code SHOULD already use English identifiers.
- The glossary is the single mapping from business vocabulary to code and is extended whenever a new
  term appears (here, then in `docs/glossary.md`):

| Business term (ES) | Code term (EN) |
|---|---|
| Sección del sitio (Inicio, Sobre nosotros, Servicios, Contacto) | `SitePage::{Home, About, Services, Contact}` |
| Tarjeta de valor | `ValueProposition` |
| Servicio (línea de servicio con puntos clave) | `Service` with `ServiceHighlight` |
| Indicador | `Indicator` (optional `value`) |
| Miembro del equipo | `TeamMember` |
| Foto de la planta | `FacilityPhoto` |
| Aliado comercial | `Partner` |
| Experiencia de éxito / testimonio | `Testimonial` |
| Datos de contacto / horario de atención | `ContactDetails` / `BusinessHours` |
| Crédito del desarrollador | `DeveloperCredit` |
| Cotización (futuro) | `Quotation` |
| Cliente (futuro) | `Customer` |

**Rationale**: the client's vocabulary is Spanish and the codebase must remain unambiguous for any
developer or AI agent. One glossary prevents synonyms from coexisting in code.

### IV. Explicit Domain Model, State & Money (Phase 2)

- Every lifecycle is a PHP backed enum. Transitions happen only through dedicated Actions that
  validate the allowed transition against a single transition map. Direct status assignment outside
  those Actions is forbidden.
- Money is never a float. Amounts are stored as `DECIMAL(15,2)` next to a `currency_code` column and
  manipulated through a Money value object with explicit rounding.
- Derived figures (subtotals, taxes, totals, margins) are computed by one pure calculator class
  covered by unit tests. Persisted totals are a cache; the lines are the source of truth.
- Business identifiers are produced by strategy classes behind an interface, protected by a DB
  unique constraint and generated inside a transaction with row locking.
- State transitions and changes to key fields are recorded in an activity log with actor, timestamp,
  old value and new value.
- Catalog records are deactivated (`is_active`), not deleted. Soft deletes only where the business
  needs to recover records.

**Rationale**: prices, totals and identifiers are the rules the business will trust the system for;
they must be deterministic, testable and impossible to bypass.

### V. Security & Access Control by Default

- **Phase 1**: the site has no backend and no forms; the only data channels are outbound links
  (WhatsApp, phone, e-mail, maps). No analytics or third-party scripts beyond Google Fonts and the
  Google Maps embed. External links carry `rel="noopener"`.
- **Phase 2**: authentication uses Laravel's session guard with hashed passwords, login throttling
  and password reset; every internal route sits behind `auth` middleware. Authorization uses a
  role/permission model with permissions named `<module>.<resource>.<ability>`; every controller
  action is guarded by a Policy or permission middleware. Public routes are only the `Site` pages,
  login and password reset.
- Every write goes through a FormRequest. Models declare `$fillable` explicitly; `$guarded = []` is
  forbidden. Uploads are validated by MIME type and size and stored on a private disk.
- CSRF on every form, escaped Blade output, parameter binding only, rate limiting on authentication
  and public endpoints.
- Secrets live in `.env` only; `.env.example` is kept current; no credentials in code, docs, seeds,
  deployment files or the repository (the repository is public).

**Rationale**: the repository and the website are public; anything sensitive must never enter them.

### VI. Test-Backed Delivery

- **Phase 1 gates** (run before every deployment): `html-validate index.html`,
  `node tools/contrast-check.mjs` (WCAG AA pairs), `node tools/verify-site.mjs` (routes, images,
  overflow, floating button, keyboard access at 360/768/1024/1440 px) and a Lighthouse mobile run with
  Performance ≥ 90 and Accessibility ≥ 95.
- **Phase 2**: test framework Pest. Tests ship in the same pull request as the code they cover; a task
  is not done until its tests pass. Unit tests are mandatory for calculators, generators, state maps
  and money handling. Feature tests are mandatory for every HTTP endpoint and cover the happy path,
  an authorization denial and a validation failure. Every model has a factory; every catalog has an
  idempotent seeder. CI runs against MySQL, not SQLite.
- Merging with failing gates, static analysis errors or style violations is forbidden.

**Rationale**: the website is the client's storefront and the future system will replace manual
processes people already trust; regressions cost that trust immediately.

### VII. Data Integrity & Schema Discipline (Phase 2)

- MySQL 8.x, InnoDB, `utf8mb4_unicode_ci`. Schema changes happen only through migrations; merged
  migrations are immutable and are corrected by a new migration.
- Foreign keys with explicit `onDelete` behaviour, unique constraints on business identifiers,
  indexes on foreign keys and on filtered or sorted columns.
- Enumerated values are stored as strings validated by PHP enums (no MySQL `ENUM`).
- Every amount column carries `currency_code`; all tables carry `created_at` / `updated_at`.
- Reference catalogs are seeded idempotently. Demo data is a separate seeder never run in production.
- Any Action that writes to more than one table runs inside a database transaction.

**Rationale**: integrity rules at the database level are the last line of defence.

### VIII. Simplicity, Consistency & Observability

- YAGNI: build what the feature spec requires. No repositories on top of Eloquent unless a second
  data source exists, no CQRS, no event sourcing, no microservices, no front-end framework for the
  public site.
- Every added abstraction MUST be justified in the feature `plan.md` Complexity Tracking section.
- **Phase 1**: three source files (`index.html`, `styles.css`, `scripts.js`), no build step, design
  tokens declared once in `:root` and documented in
  `specs/001-serviglass-site-refresh/contracts/design-tokens.md`; images are generated by
  `tools/optimize-images.mjs` from the originals in `specs/.../assets/`, never edited by hand.
- **Phase 2**: Laravel Pint (Laravel preset) and Larastan level 6+; `strict_types=1`, typed
  properties, return types, constructor promotion, readonly DTOs. UI is server-rendered Blade with
  reusable components; the public site keeps its design tokens; a back office, if added, uses at most
  one CSS framework chosen in its feature plan. Interactivity uses Alpine.js; jQuery and inline
  business logic in JavaScript are forbidden.
- Logs carry structured context; exceptions are reported, never swallowed; side effects run as queued
  listeners of domain events.
- Each module has a `README.md` listing its responsibilities and public Actions. Significant
  decisions are recorded as short ADRs in `docs/adr/`.

**Rationale**: a small team must be able to read any part of the system in minutes; consistency beats
cleverness.

### IX. Public Website Quality (Performance, Accessibility, Brand)

- The public site loads in under 3 s on 4G: images optimized (WebP + JPEG fallback, `width`/`height`
  declared, lazy loading below the fold), no render-blocking third-party CSS, total initial payload
  under 1,5 MB.
- WCAG 2.1 AA: text contrast ≥ 4.5:1, components ≥ 3:1, visible focus, skip link, `alt` on every
  image, decorative SVG hidden from assistive technology, `prefers-reduced-motion` honoured.
- No horizontal scroll from 360 px up; the WhatsApp button never covers links or the footer credit.
- Brand rules: white background, Serviglass green/blue tokens for titles, buttons, icons and
  interactive elements; the ATRIO developer credit follows its brand guide and appears only in the
  footer. Client copy is published verbatim from the approved source document.
- Clean URLs: `/`, `/nosotros`, `/servicios`, `/contacto` (no `#section` URLs); old hash links
  redirect to the clean route.

**Rationale**: the website is the commercial face of the client; speed, accessibility and brand
fidelity are measurable and are verified on every deployment.

## Technology Stack & Constraints

### Phase 1 — static site (current)

- HTML5, CSS3 (custom properties, Grid, Flexbox), JavaScript ES2018 without modules or build.
- Node.js 24 only for development tooling in `tools/` (`sharp`, `html-validate`, `puppeteer-core`).
- Hosting: GoDaddy shared cPanel (Apache). Deployment via cPanel Git Version Control from the GitHub
  repository `andrestrivino1/serviglass-girardot`, branch `main`, using `.cpanel.yml` ("Update from
  Remote" → "Deploy HEAD Commit"). Only `index.html`, `styles.css`, `scripts.js`, `.htaccess` and
  `images/` are published; `specs/`, `tools/`, `.github/`, `.specify/` and `.claude/` never reach
  `public_html`.
- Clean routes are served by `.htaccess` rewrite rules; the local dev server must mirror them
  (`npx serve -s` or `tools/verify-site.mjs`).
- Domain `serviglassgirardot.com`; canonical and Open Graph URLs are absolute.

### Phase 2 — Laravel application (planned)

- **Runtime**: PHP 8.3+, the latest stable Laravel major at bootstrap time, pinned in `composer.json`.
  Verify the PHP version and Composer availability of the hosting before bootstrapping; the document
  root must point to Laravel's `public/` directory.
- **Database**: MySQL 8.0+. Time zone `America/Bogota` for display; timestamps stored in UTC.
- **Frontend**: Blade + Vite + Alpine.js. The public site is ported to Blade layouts and components
  keeping its design tokens and markup contract.
- **Approved packages**: `laravel/fortify` (headless authentication), `spatie/laravel-permission`,
  `spatie/laravel-activitylog` v5+, `laravel-lang/common`, `brick/money`, `laravel/pint`,
  `larastan/larastan`, `pestphp/pest` + `pestphp/pest-plugin-laravel`; npm: `alpinejs`, `vite`,
  `sass`, `@fontsource/chakra-petch` (developer wordmark only). Any other package requires
  justification in the feature plan.
- **Localization**: default locale `es`, fallback `en`; all copy in `lang/` files.
- **Layout**:

```text
app/Modules/<Module>/
  Actions/  Queries/  Domain/{Models,Enums,ValueObjects,Services,Events}/
  Http/{Controllers,Requests,Resources}/  Policies/  Infrastructure/
  Providers/<Module>ServiceProvider.php  routes/web.php  database/{migrations,factories,seeders}/
  resources/views/  lang/es/  tests/{Unit,Feature}/  README.md
```

- **Performance**: list views are paginated with server-side search and filters;
  `Model::preventLazyLoading()` is enabled outside production; N+1 queries are defects.

## Development Workflow & Quality Gates

- **Spec Kit flow is mandatory**: `/speckit-specify` → `/speckit-clarify` → `/speckit-plan` →
  `/speckit-tasks` → `/speckit-implement` for every feature. No application code is written without
  an approved spec and plan. Client-provided content lives under the feature's `assets/` and is the
  single source of truth for published copy.
- **Branching**: `main` is protected and is the only branch cPanel deploys. Features live on
  `NNN-feature-name` branches created by Spec Kit. Commits follow Conventional Commits
  (`feat(site): add clean routes`) and end with the agreed attribution trailer.
- **Pull requests** include: purpose, linked spec, screenshots for UI changes (from
  `tools/shots/` or Lighthouse), migration and seeding notes (Phase 2), and an explicit constitution
  compliance checklist (Principles I–IX).
- **CI gates on every PR**: Phase 1 — `html-validate`, `contrast-check`, `verify-site`. Phase 2 adds
  `composer validate`, `pint --test`, `phpstan`, `pest` against MySQL. A red gate blocks merge.
- **Deployment**: after merge to `main`, deploy from cPanel Git Version Control ("Update from
  Remote" → "Deploy HEAD Commit") or by the GitHub Actions FTP workflow, never by editing files on
  the server. Verify the live site with `tools/verify-site.mjs` pointed at production after each
  deployment.
- **Definition of Done** for a task: acceptance criteria met; gates green; images regenerated from
  originals when assets change; docs (`contracts/`, `quickstart.md`, glossary) updated; no `TODO`
  left without a tracked issue.
- **Releases** are tagged with semantic versions.

## Governance

- This constitution supersedes every other practice, template default or personal preference. When
  guidance conflicts, the constitution wins; when the constitution is silent, the feature plan decides
  and records the decision.
- **Amendments** are made by pull request to `.specify/memory/constitution.md` including: rationale,
  the version bump, and a migration plan for existing code when a rule tightens. The project owner
  (Andrés Triviño, ATRIO) approves amendments.
- **Versioning policy**: MAJOR for removing or redefining a principle in a backward-incompatible way;
  MINOR for adding a principle or section or materially expanding guidance; PATCH for clarifications
  and wording.
- **Compliance review**: every `/speckit-plan` Constitution Check gate and every PR review verifies
  Principles I–IX explicitly. Any violation is either fixed before merge or documented in the plan's
  Complexity Tracking with justification and an expiry.
- Runtime guidance for agents lives in `CLAUDE.md` (to be generated when the Laravel application is
  bootstrapped) and MUST stay consistent with this file.

**Version**: 1.0.0 | **Ratified**: 2026-10-06 | **Last Amended**: 2026-10-06
