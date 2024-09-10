import { render, screen, userEvent } from '@/utils/renderers';

import { AccordionItem } from './AccordionItem';

describe('AccordionItem Component', () => {
  const mockOnClick = vi.fn();

  it('should render the accordion item with label and plus icon when inactive', () => {
    render(
      <AccordionItem isActive={false} label="Test Label" onClick={mockOnClick}>
        <p>Test Content</p>
      </AccordionItem>,
    );

    expect(screen.getByRole('listitem')).toBeInTheDocument();
    const button = screen.getByRole('button', { name: /test label/i });
    expect(button).toBeInTheDocument();
    expect(button).not.toHaveClass('active');

    expect(screen.queryByText('Test Content')).not.toBeInTheDocument();

    expect(button?.querySelector('svg')).toBeInTheDocument();
  });

  it('should render the accordion item with minus icon and content when active', () => {
    render(
      <AccordionItem isActive={true} label="Test Label" onClick={mockOnClick}>
        <p>Test Content</p>
      </AccordionItem>,
    );

    expect(screen.getByRole('listitem')).toBeInTheDocument();
    const button = screen.getByRole('button', { name: /test label/i });
    expect(button).toHaveClass('active');
    expect(screen.getByText('Test Content')).toBeInTheDocument();

    expect(button?.querySelector('svg')).toBeInTheDocument();
  });

  it('should trigger onClick when clicked', async () => {
    const user = userEvent.setup();

    render(
      <AccordionItem isActive={false} label="Test Label" onClick={mockOnClick}>
        <p>Test Content</p>
      </AccordionItem>,
    );

    await user.click(screen.getByRole('button', { name: /test label/i }));

    expect(mockOnClick).toHaveBeenCalled();
  });
});
