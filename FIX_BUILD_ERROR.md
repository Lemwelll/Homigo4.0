# Fix Build Error - "Cannot access 'Kn' before initialization"

## Problem
Build error: `Uncaught ReferenceError: Cannot access 'Kn' before initialization`

This is a circular dependency or module initialization issue in the production build.

## Solution

### Step 1: Clean Build Cache
```bash
# Delete build artifacts
rmdir /s /q dist
rmdir /s /q node_modules\.vite

# Or on PowerShell:
Remove-Item -Recurse -Force dist
Remove-Item -Recurse -Force node_modules\.vite
```

### Step 2: Rebuild
```bash
npm run build
```

### Step 3: If Error Persists - Update Vite Config

Add this to `vite.config.js`:

```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: undefined,
      },
    },
    commonjsOptions: {
      include: [/node_modules/],
      transformMixedEsModules: true
    }
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom']
  }
})
```

### Step 4: Alternative - Check for Circular Dependencies

The error might be caused by circular imports. Check if any files import each other.

## Quick Fix Commands

```bash
# Clean and rebuild
rmdir /s /q dist & npm run build

# Or if that fails, reinstall dependencies
rmdir /s /q node_modules & npm install & npm run build
```

## If Still Failing

Try building with source maps to see the actual error:

```bash
npm run build -- --sourcemap
```

Then check the browser console for the actual file causing the issue.
