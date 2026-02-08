# 0711-BIG-C-Bosch

**Bosch Product Intelligence** - AI-powered product information platform for Bosch Power Tools.

Built on [0711-BIG-C](https://github.com/C-0711/BIG-C) framework.

## Features

- 🔍 **Product Search** - Full-text search across Bosch catalog
- 📊 **Product Details** - Complete specifications and datasheets
- 🔄 **Similar Products** - Find alternatives and related items
- 📈 **Comparison Tables** - Side-by-side spec comparison
- 🗂️ **ETIM Classification** - Browse by product categories
- 📷 **Media Gallery** - Product images and videos
- 📄 **Document Center** - Datasheets, manuals, certificates
- 🌐 **Ecosystem Map** - Visualize product relationships
- 🤖 **AI Agent** - Chat-based product assistance

## Architecture

```
@0711/big-c-bosch
├── @0711/core           # Framework (unchanged)
├── @0711/templates      # Standard widgets (unchanged)
└── @0711/bosch-config   # Bosch-specific configuration
    ├── mcp.config.ts    # MCP endpoint settings
    ├── branding.ts      # Bosch colors & logo
    └── dashboards/      # Pre-built dashboards
        ├── product-research.ts
        ├── sales-assistant.ts
        └── technical-analysis.ts
```

## Quick Start

```bash
# Install dependencies
pnpm install

# Configure environment
cp .env.example .env
# Edit .env with your MCP endpoint

# Build
pnpm build

# Run development server
pnpm dev
```

## Dashboards

### Product Research
Complete workspace for researching products with search, details, similar products, media, documents, and ecosystem visualization.

### Sales Assistant
Streamlined view for sales conversations with quick search, product info, images, and alternatives.

### Technical Analysis
Deep-dive into specifications with ETIM classification, comparison tables, and compatibility checking.

## Configuration

### MCP Endpoint
```typescript
// packages/bosch-config/src/mcp.config.ts
export const mcpConfig = {
  endpoint: process.env.BOSCH_MCP_ENDPOINT,
  apiKey: process.env.BOSCH_MCP_API_KEY,
  timeout: 30000,
  retries: 3,
};
```

### Branding
```typescript
// packages/bosch-config/src/branding.ts
export const branding = {
  appTitle: 'Bosch Product Intelligence',
  colors: {
    primary: '#E20015',    // Bosch Red
    secondary: '#005691',  // Bosch Blue
    accent: '#00A651',     // Bosch Green
  },
};
```

## MCP Tools

All 27 standard MCP tools are available:

| Category | Tools |
|----------|-------|
| Search | `search_products`, `search_similar_products`, `find_similar_products`, `search_by_etim_group`, `search_catalogs_semantic` |
| Details | `get_product`, `get_product_media`, `get_product_documents`, `get_factsheet_data` |
| Classification | `get_etim_groups`, `resolve_product_family`, `get_product_class_terminology` |
| Analytics | `aggregate_product_specs`, `check_product_compatibility`, `analyze_product_ecosystem` |

## License

Proprietary - 0711 Intelligence GmbH

---

*Powered by 0711-BIG-C v1.0.0*
