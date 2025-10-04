# Mocko Firefox Extension

Firefox extension for Mocko.

## Development

Build the extension:

```bash
nx build extension
```

The built extension will be in `dist/apps/extension/`.

## Loading in Firefox

1. Build the extension using the command above
2. Open Firefox and navigate to `about:debugging#/runtime/this-firefox`
3. Click "Load Temporary Add-on"
4. Navigate to `dist/apps/extension/` and select `manifest.json`

## Structure

- `src/popup.tsx` - Popup UI entry point
- `src/App.tsx` - Main popup component
- `src/background.ts` - Background service worker
- `src/content.ts` - Content script injected into pages
- `manifest.json` - Extension manifest
