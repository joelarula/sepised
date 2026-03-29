# Agent Instructions (Legacy)

> **Moved:** The canonical Copilot agent instructions now live in [`.github/copilot-instructions.md`](.github/copilot-instructions.md).  
> This file is kept for reference only. Update the new file instead.

---

# Agent Instructions: Jaani Sepikoda Portfolio (Vue 3 + Vuetify)

This document provides a comprehensive guide for AI agents working on the "Jaani Sepikoda" smithy portfolio project. It outlines the architecture, design philosophy, and component specifications.

## 🏗️ Project Architecture
- **Framework**: Vue 3 (Options API)
- **UI Library**: Vuetify 3
- **Build Tool**: Vite
- **Data Source**: Headless Drupal (JSON:API)
- **Routing**: Vue Router 4 (Multilingual: `/et`, `/en`, `/ru`)

## 🎨 Design System: "Forge & Steel"
The design is robust, minimalistic, and high-contrast, reflecting the craft of blacksmithing.

- **Colors**:
  - `Charcoal` (#121212): Deep background.
  - `Steel` (#2c2c2e): Secondary surfaces and cards.
  - `Silver` (#e0e0e0): Primary typography.
  - `Ember` (#ff6d00): Primary accent for action elements and highlights.
  - `Gold` (#FDDE7C): Specifically used for the brand title.
- **Typography**:
  - **Brand Title**: `arkhip` (42px, letter-spacing: 2px).
  - **Headings**: `arkhip` or `goudy` fallback.
  - **Body**: `Inter`, `Roboto`, sans-serif.
- **Visual Style**: Unified background image (`tuli2.jpg`) with fixed attachment. Transparent headers and footers to bridge the content.

## 🧩 Component Breakdown

### 1. `App.vue` (Main Layout)
- **Header**: Scrolling header (`v-app-bar absolute`) with `smithy-brand` title.
- **Navigation**: Desktop menu with categories as a submenu. Mobile drawer for smaller screens.
- **Data Lifecycle**: Fetched at the root to populate the global `nodes` and `categories` arrays.
- **Language Switcher**: Icon-button on the right handle state and route-based language switching.
- **Footer**: Minimalist transparent footer providing vertical "breath".

### 2. `Home.vue` (Landing Page)
- **Hero Section**: High-impact text over the global background.
- **Call to Action**: Direct link to the portfolio.

### 3. `Portfolio.vue` (Project Gallery)
- **Filtering**: Category-based chips with dynamic highlighting (`active-chip` class).
- **Search**: Real-time filtering across multiple languages.
- **Grid Layout**: Responsive card grid with hover effects (`v-card--reveal`) showing project names.

### 4. `Product.vue` (Detail View)
- **Image Gallery**: Large primary image with thumbnails for detail shots.
- **Sequential Navigation**: Chevron buttons to browse the entire portfolio (Prev/Next).
- **Lightbox**: Full-screen `v-dialog` for high-resolution image viewing.
- **Interactions**: Lead generation via "Inquiry" buttons linking to the contact page.

### 5. `Contact.vue` (Information)
- **Layout**: Clean cards displaying phone, email, and location.

## ⚙️ Core Functionality & Patterns
- **Multilingual Support (i18n)**: 
  - Static strings are externalized in `src/i18n/{et,en,ru}.json`.
  - **All built-in strings and UI texts MUST have translation support.**
  - **Avoid hardcoding any user-facing text** directly in templates; always use the `t` object.
  - components consume a reactive `t` prop passed from `App.vue`.
  - Mapping: `{{ t.category.key }}` (e.g., `{{ t.nav.home }}`).
  - Dynamic data (Drupal) still uses language-prefixed keys (e.g., `field_name_ru`).
- **Responsive Design**: Uses Vuetify's grid system (`v-row`, `v-col`) and breakpoint classes.
- **Path Aliasing**: `@/` points to the `src` directory.
- **Asset Loading**: Images and fonts are located in `src/assets/` and specific formats (like `.eot` with hashes) are handled carefully for compatibility.

## 🛠️ Maintenance & Development
- **Run Locally**: `npm run dev`
- **Build**: `npm run build`
- **Deployment**: Production build is generated in `dist/`.

---
*Note: Always maintain the "robust and minimalistic" aesthetic when adding new features.*
