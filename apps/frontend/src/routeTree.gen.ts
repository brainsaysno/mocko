/* prettier-ignore-start */

/* eslint-disable */

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

// This file is auto-generated by TanStack Router

import { createFileRoute } from '@tanstack/react-router'

// Import Routes

import { Route as rootRoute } from './routes/__root'
import { Route as MockosNewImport } from './routes/mockos/new'

// Create Virtual Routes

const IndexLazyImport = createFileRoute('/')()
const MockosIndexLazyImport = createFileRoute('/mockos/')()

// Create/Update Routes

const IndexLazyRoute = IndexLazyImport.update({
  path: '/',
  getParentRoute: () => rootRoute,
} as any).lazy(() => import('./routes/index.lazy').then((d) => d.Route))

const MockosIndexLazyRoute = MockosIndexLazyImport.update({
  path: '/mockos/',
  getParentRoute: () => rootRoute,
} as any).lazy(() => import('./routes/mockos/index.lazy').then((d) => d.Route))

const MockosNewRoute = MockosNewImport.update({
  path: '/mockos/new',
  getParentRoute: () => rootRoute,
} as any)

// Populate the FileRoutesByPath interface

declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
    '/': {
      id: '/'
      path: '/'
      fullPath: '/'
      preLoaderRoute: typeof IndexLazyImport
      parentRoute: typeof rootRoute
    }
    '/mockos/new': {
      id: '/mockos/new'
      path: '/mockos/new'
      fullPath: '/mockos/new'
      preLoaderRoute: typeof MockosNewImport
      parentRoute: typeof rootRoute
    }
    '/mockos/': {
      id: '/mockos/'
      path: '/mockos'
      fullPath: '/mockos'
      preLoaderRoute: typeof MockosIndexLazyImport
      parentRoute: typeof rootRoute
    }
  }
}

// Create and export the route tree

export const routeTree = rootRoute.addChildren({
  IndexLazyRoute,
  MockosNewRoute,
  MockosIndexLazyRoute,
})

/* prettier-ignore-end */

/* ROUTE_MANIFEST_START
{
  "routes": {
    "__root__": {
      "filePath": "__root.tsx",
      "children": [
        "/",
        "/mockos/new",
        "/mockos/"
      ]
    },
    "/": {
      "filePath": "index.lazy.tsx"
    },
    "/mockos/new": {
      "filePath": "mockos/new.tsx"
    },
    "/mockos/": {
      "filePath": "mockos/index.lazy.tsx"
    }
  }
}
ROUTE_MANIFEST_END */
