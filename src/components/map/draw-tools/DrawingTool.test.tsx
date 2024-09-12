import { render, screen, userEvent } from '@/utils/renderers';

import { DrawingTool } from './DrawingTool';

describe('DrawingTool', () => {
  it('should render children and in an inactive state', async () => {
    const mockOnClick = vi.fn();

    render(
      <DrawingTool isActive={false} onClick={mockOnClick}>
        <span>Test Tool</span>
      </DrawingTool>,
    );

    const tool = screen.getByRole('button', { name: /test tool/i });
    expect(tool).toBeInTheDocument();
    expect(tool).not.toHaveClass('active');
  });

  it('should render children and in an active state', async () => {
    const mockOnClick = vi.fn();

    render(
      <DrawingTool isActive={true} onClick={mockOnClick}>
        <span>Test Tool</span>
      </DrawingTool>,
    );

    const tool = screen.getByRole('button', { name: /test tool/i });
    expect(tool).toBeInTheDocument();
    expect(tool).toHaveClass('active');
  });

  it('should respond to click events', async () => {
    const user = userEvent.setup();
    const mockOnClick = vi.fn();

    render(
      <DrawingTool isActive={false} onClick={mockOnClick}>
        <span>Test Tool</span>
      </DrawingTool>,
    );

    await user.click(screen.getByRole('button', { name: /test tool/i }));

    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });
});
