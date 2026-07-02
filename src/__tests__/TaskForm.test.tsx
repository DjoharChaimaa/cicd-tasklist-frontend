import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { TaskForm } from '../components/TaskForm';

describe('TaskForm', () => {
  it('renders create mode and calls onSubmit then resets fields', async () => {
    const onSubmit = vi.fn();
    const user = userEvent.setup();

    render(<TaskForm onSubmit={onSubmit} />);

    await user.type(screen.getByLabelText('Titre'), 'Nouvelle tâche');
    await user.type(screen.getByLabelText('Description'), 'Une description');
    await user.click(screen.getByRole('button', { name: 'Ajouter' }));

    expect(onSubmit).toHaveBeenCalledWith({
      title: 'Nouvelle tâche',
      description: 'Une description',
    });
    expect((screen.getByLabelText('Titre') as HTMLInputElement).value).toBe('');
    expect((screen.getByLabelText('Description') as HTMLTextAreaElement).value).toBe('');
  });

  it('shows validation error when title is empty', async () => {
    const onSubmit = vi.fn();
    const user = userEvent.setup();

    render(<TaskForm onSubmit={onSubmit} />);
    await user.click(screen.getByRole('button', { name: 'Ajouter' }));

    expect(screen.getByRole('alert')).toHaveTextContent('Le titre est requis');
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('renders edit mode and calls onCancel', async () => {
    const onSubmit = vi.fn();
    const onCancel = vi.fn();
    const user = userEvent.setup();

    render(
      <TaskForm
        onSubmit={onSubmit}
        initialValues={{ title: 'Tâche', description: 'Desc' }}
        onCancel={onCancel}
        mode="edit"
      />
    );

    expect(screen.getByRole('heading', { name: 'Modifier la tâche' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Modifier' })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Annuler' }));
    expect(onCancel).toHaveBeenCalled();
  });
});
