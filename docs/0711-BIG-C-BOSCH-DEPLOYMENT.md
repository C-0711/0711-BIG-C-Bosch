# 0711-BIG-C-Bosch Client Deployment

## Overview

**Client:** Bosch Power Tools  
**Repository:** `github.com/C-0711/0711-BIG-C-Bosch`  
**Base:** Fork of `0711-BIG-C` (V1)  
**Status:** 🔲 Pending Deployment

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│  0711-BIG-C-Bosch                                               │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  @0711/core (unchanged)                                         │
│  └── Framework code from BIG-C                                  │
│                                                                 │
│  @0711/templates (unchanged)                                    │
│  └── 10 standard widgets                                        │
│                                                                 │
│  @0711/bosch-config (NEW)                                       │
│  ├── MCP endpoint configuration                                 │
│  ├── Branding (colors, logo)                                    │
│  ├── Default dashboard templates                                │
│  └── Custom widgets (if any)                                    │
│                                                                 │
│  Connected to: Bosch MCP Server (H200V)                         │
│  └── 27 standard tools + Bosch-specific data                    │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## Task Checklist

### Phase 1: Repository Setup
- [ ] **REPO-001:** Create GitHub repository `C-0711/0711-BIG-C-Bosch`
- [ ] **REPO-002:** Clone from `0711-BIG-C` as starting point
- [ ] **REPO-003:** Update `package.json` name to `@0711/big-c-bosch`
- [ ] **REPO-004:** Create `packages/bosch-config/` directory structure
- [ ] **REPO-005:** Add `.env.example` with Bosch MCP endpoint template

### Phase 2: Configuration
- [ ] **CFG-001:** Create `bosch-config/mcp.config.ts` with MCP endpoint
- [ ] **CFG-002:** Create `bosch-config/branding.ts` with Bosch colors/logo
- [ ] **CFG-003:** Create `bosch-config/defaults.ts` with default dashboard
- [ ] **CFG-004:** Test MCP connection to Bosch data
- [ ] **CFG-005:** Verify all 27 standard tools work with Bosch data

### Phase 3: Branding
- [ ] **BRAND-001:** Obtain Bosch logo (SVG preferred)
- [ ] **BRAND-002:** Define color palette (primary, secondary, accent)
- [ ] **BRAND-003:** Set app title: "Bosch Product Intelligence"
- [ ] **BRAND-004:** Configure favicon
- [ ] **BRAND-005:** Update any hardcoded text/titles

### Phase 4: Default Dashboards
- [ ] **DASH-001:** Create "Product Research" dashboard for Bosch
- [ ] **DASH-002:** Create "Sales Assistant" dashboard for Bosch
- [ ] **DASH-003:** Create "Technical Analysis" dashboard for Bosch
- [ ] **DASH-004:** Pre-configure widget wiring for Bosch use cases
- [ ] **DASH-005:** Test all dashboards with real Bosch data

### Phase 5: Deployment
- [ ] **DEPLOY-001:** Build production bundle
- [ ] **DEPLOY-002:** Deploy to H200V (or designated server)
- [ ] **DEPLOY-003:** Configure reverse proxy / domain
- [ ] **DEPLOY-004:** Set up environment variables
- [ ] **DEPLOY-005:** Verify production deployment

### Phase 6: Validation
- [ ] **VAL-001:** Test product search with Bosch products
- [ ] **VAL-002:** Test product detail view
- [ ] **VAL-003:** Test similar products
- [ ] **VAL-004:** Test comparison table
- [ ] **VAL-005:** Test ETIM explorer with Bosch categories
- [ ] **VAL-006:** Test media gallery
- [ ] **VAL-007:** Test document center
- [ ] **VAL-008:** Test ecosystem map
- [ ] **VAL-009:** Test agent chat with Bosch context
- [ ] **VAL-010:** Performance check (load times, responsiveness)

---

## Configuration Details

### MCP Endpoint
```typescript
// bosch-config/mcp.config.ts
export const mcpConfig = {
  endpoint: process.env.BOSCH_MCP_ENDPOINT || 'http://localhost:3000/mcp',
  apiKey: process.env.BOSCH_MCP_API_KEY,
  timeout: 30000,
  retries: 3,
};
```

### Branding
```typescript
// bosch-config/branding.ts
export const branding = {
  appTitle: 'Bosch Product Intelligence',
  logo: '/assets/bosch-logo.svg',
  favicon: '/assets/bosch-favicon.ico',
  colors: {
    primary: '#E20015',    // Bosch Red
    secondary: '#005691',  // Bosch Blue
    accent: '#00A651',     // Bosch Green
    background: '#F5F5F5',
    text: '#333333',
  },
};
```

### Default Dashboard
```typescript
// bosch-config/defaults.ts
export const defaultDashboard = {
  name: 'Bosch Product Research',
  widgets: [
    { type: 'product-search', position: { x: 0, y: 0, w: 6, h: 2 } },
    { type: 'product-detail', position: { x: 6, y: 0, w: 6, h: 4 } },
    { type: 'similar-products', position: { x: 0, y: 2, w: 6, h: 2 } },
    { type: 'media-gallery', position: { x: 0, y: 4, w: 4, h: 3 } },
    { type: 'document-center', position: { x: 4, y: 4, w: 4, h: 3 } },
    { type: 'ecosystem-map', position: { x: 8, y: 4, w: 4, h: 3 } },
  ],
};
```

---

## File Structure

```
0711-BIG-C-Bosch/
├── packages/
│   ├── core/              # Unchanged from BIG-C
│   ├── templates/         # Unchanged from BIG-C
│   └── bosch-config/      # NEW: Bosch-specific
│       ├── package.json
│       ├── src/
│       │   ├── index.ts
│       │   ├── mcp.config.ts
│       │   ├── branding.ts
│       │   ├── defaults.ts
│       │   └── dashboards/
│       │       ├── product-research.ts
│       │       ├── sales-assistant.ts
│       │       └── technical-analysis.ts
│       └── assets/
│           ├── bosch-logo.svg
│           └── bosch-favicon.ico
├── apps/
│   └── web/               # Web application
│       ├── src/
│       │   └── App.tsx    # Uses bosch-config
│       └── public/
├── .env.example
├── package.json
└── README.md
```

---

## Timeline Estimate

| Phase | Tasks | Estimate |
|-------|-------|----------|
| 1. Repository Setup | 5 tasks | 30 min |
| 2. Configuration | 5 tasks | 1 hour |
| 3. Branding | 5 tasks | 30 min |
| 4. Default Dashboards | 5 tasks | 1 hour |
| 5. Deployment | 5 tasks | 1 hour |
| 6. Validation | 10 tasks | 1 hour |
| **Total** | **35 tasks** | **~5 hours** |

---

## Dependencies

- [x] BIG-C V1 complete (`github.com/C-0711/BIG-C`)
- [ ] Bosch MCP endpoint available
- [ ] Bosch logo/branding assets
- [ ] H200V deployment target ready

---

## Success Criteria

1. ✅ All 27 standard tools work with Bosch data
2. ✅ Bosch branding applied (logo, colors)
3. ✅ Default dashboards functional
4. ✅ All 10 widgets display Bosch products correctly
5. ✅ Agent can answer questions about Bosch products
6. ✅ Performance: <2s initial load, <500ms widget updates

---

## Notes

- **No code changes to @0711/core or @0711/templates** - only configuration
- If Bosch needs custom widgets, add to `bosch-config/widgets/`
- Template Library enables future updates from BIG-C to propagate easily

---

*Created: 2026-02-08*  
*Author: Bombas 💣*
