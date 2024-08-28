import MockoDevtools from '@/components/MockoDevtools';
import { ProductTourContextProvider } from '@/context/ProductTourContext';
import ProductTourWrapper from '@/context/ProductTourWrapper';
import { Outlet, createRootRoute } from '@tanstack/react-router';
import React from 'react';

const TanStackRouterDevtools =
  process.env.NODE_ENV === 'production'
    ? () => null // Render nothing in production
    : React.lazy(() =>
      // Lazy load in development
      import('@tanstack/router-devtools').then((res) => ({
        default: res.TanStackRouterDevtools,
        // For Embedded Mode
        // default: res.TanStackRouterDevtoolsPanel
      }))
    );

export const Route = createRootRoute({
  component: () => (
    <ProductTourContextProvider>
      <ProductTourWrapper>
        <Outlet />
        <TanStackRouterDevtools />
        <MockoDevtools />
      </ProductTourWrapper>
    </ProductTourContextProvider>
  ),
});
