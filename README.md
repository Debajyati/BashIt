# BashIt 📟

[![Hugo Extended](https://img.shields.io/badge/Hugo%20Extended-%3E%3D0.146.0-blue?style=flat-square&logo=hugo)](https://gohugo.io/)
[![WebTUI CSS](https://img.shields.io/badge/CSS-WebTUI-teal?style=flat-square)](https://github.com/webtui/webtui)
[![Theme](https://img.shields.io/badge/Palette-Catppuccin%20Mocha-mauve?style=flat-square)](https://github.com/catppuccin/catppuccin)
[![Icons](https://img.shields.io/badge/Icons-Symbols%20Nerd%20Font-peach?style=flat-square)](https://www.nerdfonts.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)
[![Zero Trackers](https://img.shields.io/badge/Privacy-0%20Tracking%20%E2%80%A2%200%20Ads-brightgreen?style=flat-square)]()

A distraction-free, lightning-fast retro-modern terminal UI theme for [Hugo](https://gohugo.io/), built entirely on the [WebTUI CSS framework](https://github.com/webtui/webtui).

Designed for developers, sysadmins, and command-line enthusiasts who appreciate authentic monospace aesthetics, keyboard-centric minimalism, and modern web performance.

---

## ✨ Features

- **Pure WebTUI CSS Components**: Buttons, badges, ASCII box borders, progress meters, and popovers built with native CSS layers (`@layer base, utils, components`) — zero heavy JS or CSS runtimes.
- **3-Tier Typography Engine**: Independent customization for global UI font, prose/paragraph font, and code block font with built-in **JetBrains Mono Nerd Font** & **Symbols Nerd Font** support.
- **Dual-Mode Unified Comments**:
  - **Terminal BBS**: Self-hosted serverless bulletin board system backed by **Cloudflare Workers + D1 SQLite**, featuring zero trackers, zero ads, and honeypot spam defense.
  - **Giscus**: GitHub Discussions-powered discussions with Catppuccin dark mode styling.
- **Privacy-First Media & Social Embeds**:
  - **YouTube CRT Player**: Monospace video terminal with privacy-enhanced mode (`youtube-nocookie.com`).
  - **Social Cards**: Official dark widgets and clean cards for **X (Twitter)**, **Instagram**, **Peerlist**, **Reddit**, **Dev.to**, **Daily.dev**, and **GitHub** repository cards.
  - **Universal OpenGraph Linkcards**: Auto-scrapes metadata at build time via configurable OpenGraph microservices.
- **Rich Technical Shortcodes**:
  - 14 distinct Admonition callouts (Note, Tip, Warning, Danger, Terminal, Git, etc.).
  - Interactive Mermaid.js diagrams & Apache ECharts data visualizations (lazy-loaded).
  - Dark theme Leaflet & Mapbox GL geographic maps.
  - KaTeX mathematical formula rendering.
  - Interactive Tabbed panels and Typewriter text animation (`typeit`).
  - WebTUI styled tables with flexible delimiters (`;;`, `\n`, `|`) and Markdown cell rendering.
- **Blazing Fast**: Compiles 60+ pages in under 55ms via Hugo Pipes asset bundling.

---

## 🚀 Installation

You can add this repo as a submodule of your Hugo site directory:

```bash
git submodule add https://github.com/Debajyati/BashIt.git themes/BashIt
```

And later you can update the submodule in your site directory to the latest commit using this command:

```bash
git submodule update --remote --merge
```

Next, install the local WebTUI dependencies for offline asset bundling:

```bash
cd themes/BashIt
npm install
```

---

## ⚙️ Quickstart Configuration

Add `BashIt` to your site's `hugo.toml`:

```toml
baseURL = 'https://yoursite.org/'
title = 'My Terminal Blog'
theme = 'BashIt'

[params]
  webtuiTheme = 'catppuccin' # Options: catppuccin, gruvbox, nord, everforest

# Brand Icon / Logo in Navbar (Vim glyph by default)
[params.navbar]
  icon = "󰞷"             # Nerd font glyph, Unicode emoji ("⚡"), or path to SVG/PNG logo
  # disableIcon = true    # Set to true for text-only navbar

# Typography Customization
[params.font]
  # global = "JetBrainsMono Nerd Font"
  # paragraph = "JetBrainsMono Nerd Font"
  # code = "JetBrainsMono Nerd Font"

# Comments Configuration
[params.comment]
  enable = true
  provider = "cloudflare" # "cloudflare" (Terminal BBS) | "giscus" | "disabled"

  [params.comment.cloudflare]
    api = "https://bashit-comments.<your-subdomain>.workers.dev"
    mockMode = false      # Set to true for offline local testing via localStorage

  [params.comment.giscus]
    repo = "username/repo"
    repoId = "R_kgD..."
    category = "Announcements"
    categoryId = "DIC_kwD..."
    mapping = "pathname"
    theme = "catppuccin_mocha"

# OpenGraph Link Preview Scraper API (Optional)
[params.opengraph]
  scraperApi = "https://xogapi.ddebajyati.workers.dev"
```

---

## 🧩 Shortcode Overview

| Shortcode | Purpose | Example Syntax |
|---|---|---|
| `{{< webtui-box >}}` | Terminal ASCII border box | `{{< webtui-box style="square" >}}Content{{< /webtui-box >}}` |
| `{{< webtui-callout >}}` | Admonition box (14 variants) | `{{< webtui-callout variant="tip" title="Pro Tip" >}}Text{{< /webtui-callout >}}` |
| `{{< webtui-table >}}` | WebTUI table with divider lines | `{{< webtui-table headers="A \| B" rows="1 \| 2 ;; 3 \| 4" divide="both" >}}` |
| `{{< youtube >}}` | CRT TV YouTube player | `{{< youtube "dQw4w9WgXcQ" >}}` |
| `{{< github >}}` | GitHub repo card with live stats | `{{< github "Debajyati/BashIt" >}}` |
| `{{< peerlist >}}` | Peerlist embed with auto-resize | `{{< peerlist "ACTHOK8A7BG66JBGR17ALNR98QPL7Q" >}}` |
| `{{< dailydev >}}` | Daily.dev curated article card | `{{< dailydev "https://dly.to/g9vaRB1agcs" >}}` |
| `{{< linkcard >}}` | OpenGraph link card | `{{< linkcard "https://gohugo.io" >}}` |
| `{{< mermaid >}}` | Mermaid flowchart / sequence | `{{< mermaid >}}graph LR; A-->B;{{< /mermaid >}}` |
| `{{< echarts >}}` | Apache ECharts visualization | `{{< echarts >}}{"series":[...]}{{< /echarts >}}` |
| `{{< math >}}` | KaTeX math equation block | `{{< math >}}\int_{-\infty}^{\infty} e^{-x^2} dx = \sqrt{\pi}{{< /math >}}` |

---

## 🛠️ Development & Contributing

To run tests or preview the theme locally:

```bash
# 1. Clone the theme repository
git clone https://github.com/Debajyati/BashIt.git
cd BashIt

# 2. Install dependencies
npm install

# 3. Test build
hugo --source .
```

Pull requests and issues are welcome! Feel free to report bugs, suggest new shortcodes, or submit styling improvements.

---

## 📄 License

This theme is open-source software licensed under the [MIT License](LICENSE).
Built on top of the open-source [WebTUI CSS framework](https://github.com/webtui/webtui) and [Catppuccin](https://github.com/catppuccin/catppuccin) color palettes.
