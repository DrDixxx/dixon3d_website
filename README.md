# Dixon3D

Engineering design and additive-manufacturing website maintained by [Thomas Dixon (@DrDixxx)](https://github.com/DrDixxx).

[Website: dixon3d.com](https://dixon3d.com) · [Source](https://github.com/DrDixxx/dixon3d_website)

This repository connects a public project gallery, a design-inquiry interface, a product catalog and short manufacturing information entries. It provides examples of CAD communication and web development alongside the Dixon3D business.

## Project examples

The existing gallery includes technical drawings, CAD renders and printed-part photographs. These assets document different stages of design; they do not establish measured tolerances, load ratings or production qualification.

| Example | Existing evidence |
| --- | --- |
| Enclosure | [Drawing](public/assets/img/Enclosure_Drawing.png) and [render](public/assets/img/Enclosure_Render.png) |
| Wall mount | [Drawing](public/assets/img/HuskeyWallMount_Drawing.png), [render](public/assets/img/HuskyWallMount-Render.png) and [printed part](public/assets/img/HuskeyWallMount-1.jpeg) |
| Pegboard system | [Assembly render](public/assets/img/PegBoard_Full.PNG), [panel](public/assets/img/PegBoard_Panel.png) and [tool holder](public/assets/img/PegBoard_ToolHolder.PNG) |
| Window attachment | [Technical drawing](public/assets/img/WindowSlide_Drawing.png) |

Drawings and images remain in their existing locations. Native CAD files, manufacturing settings and measurement records are not included with these examples. Confirm drawing units and revision status before using a drawing for fabrication.

## Software structure

- Next.js App Router and React provide the pages, navigation and interactive gallery.
- Tailwind CSS provides styling.
- TypeScript types and local JSON entries support the information library.
- Netlify Functions contain inquiry-email and PayPal integration code.
- Nodemailer supports the server-side email integration.

See [package.json](package.json) for the current dependency versions and scripts; older planning documents may describe earlier versions.

```text
app/                   Pages and layouts
components/            Shared interface components
content/info/          Manufacturing information metadata
lib/                   Content helpers and integration code
public/assets/img/     Existing drawings, renders and photographs
netlify/functions/     Server-side inquiry and payment handlers
docs/                  Workflow and implementation roadmap
```

Representative source: [typed gallery entries](lib/examples.ts), [local information loader](lib/info.ts) and [information filters](components/InfoFilters.tsx).

## Local development

Use Node.js 22.x and npm, following the repository's documented development baseline.

```bash
npm ci
npm run dev
```

Open http://localhost:3000. To check the production build locally:

```bash
npm run build
npm start
```

Local page previews do not establish that Netlify Functions, email, checkout or uploads work. Do not submit production inquiries or payment requests as a development check.

## Current status and limits

The gallery and application source are available for review. Inquiry, checkout and upload workflows are under stabilization; this repository should not be presented as a fully validated commerce or file-intake system.

The [roadmap](docs/ROADMAP.md) records outstanding work on payment validation, diagnostic endpoints, inquiry abuse controls, private file intake, accessibility and information-page assets. Information entries currently contain brief metadata, rather than full technical test reports.

No dedicated lint, typecheck or test scripts are defined in the current package scripts. A successful build alone does not validate manufacturing claims, customer workflows or browser accessibility.

## Development documentation

- [Development workflow](docs/WORKFLOW.md)
- [Roadmap and known limitations](docs/ROADMAP.md)
- [Repository instructions](AGENTS.md)

## Attribution and reuse

The repository is maintained under Thomas Dixon's GitHub account. Public availability is not a blanket permission to reuse every design, image or dependency. Confirm authorship, any customer or employer restrictions, and applicable third-party terms before copying materials into another project.

For the professional project index, see [Thomas Dixon's GitHub profile](https://github.com/DrDixxx). Business information is available at [dixon3d.com](https://dixon3d.com).
