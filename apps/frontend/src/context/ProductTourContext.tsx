import { createContext, useContext, useMemo } from 'react';

import { Step } from 'react-joyride';
import { useSetState } from 'react-use';

export interface ProductTourState {
  run: boolean;
  stepIndex: number;
  steps: Step[];
  tourActive: boolean;
}

const productTourState = {
  run: false,
  stepIndex: 0,
  steps: [],
  tourActive: false,
};

export const ProductTourContext = createContext({
  state: productTourState,
  setState: () => undefined,
});
ProductTourContext.displayName = 'ProductTourContext';

export function ProductTourContextProvider(props: any) {
  const [state, setState] = useSetState(productTourState);

  const value = useMemo(
    () => ({
      state,
      setState,
    }),
    [setState, state]
  );

  return <ProductTourContext.Provider value={value} {...props} />;
}

export function useProductTourContext(): {
  setState: (
    patch:
      | Partial<ProductTourState>
      | ((previousState: ProductTourState) => Partial<ProductTourState>)
  ) => void;
  state: ProductTourState;
} {
  const context = useContext(ProductTourContext);

  if (!context) {
    throw new Error(
      'useProductTourContext must be used within a ProductTourContextProvider'
    );
  }

  return context;
}
