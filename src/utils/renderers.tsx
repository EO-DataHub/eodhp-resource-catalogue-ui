import { ReactElement, ReactNode } from 'react';

import { RenderHookOptions, RenderHookResult, render, renderHook } from '@testing-library/react';

type WrapperParams = {
  children: ReactNode;
};

type Options = {
  initialEntries?: string[];
  renderHookOptions?: RenderHookOptions<unknown>;
};

/**
 * A custom testing-library component renderer that wraps the component being
 * rendered with any Providers used in the app. Any test can pre-configure the
 * Providers, to be in any state they wish.
 *
 * @param ui The component to render.
 * @param options The options to configure any providers.
 *
 * @returns The rendered component.
 */
const customRender = (ui: ReactElement, options?: Options) => {
  const { renderHookOptions } = options ?? {};

  return render(ui, {
    wrapper: ({ children }: WrapperParams): ReactElement => <>{children}</>,
    ...renderHookOptions,
  });
};

/**
 * A custom testing-library hook renderer that wraps the hook being rendered
 * with any Providers used in the app. Any test can pre-configure the
 * Providers, to be in any state they wish.
 *
 * @param callback A function wrapping the hook being rendered.
 * @param options The options to configure any providers.
 *
 * @returns The rendered hook.
 */
const customRenderHook = <T, P>(
  callback: () => unknown,
  options?: Options,
): RenderHookResult<T, P> => {
  const { renderHookOptions } = options ?? {};

  const wrapper = ({ children }: WrapperParams): ReactElement => <>{children}</>;

  const utils = renderHook(() => callback(), { wrapper, ...renderHookOptions });

  return utils as RenderHookResult<T, P>;
};

// eslint-disable-next-line react-refresh/only-export-components
export * from '@testing-library/react';
export { default as userEvent } from '@testing-library/user-event';

// Override render export with our custom render function.
export { customRender as render };

// Override renderHook export with our custom renderHook function.
export { customRenderHook as renderHook };
