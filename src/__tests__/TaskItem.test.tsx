import { act, fireEvent, render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { TaskItem } from '../components/TaskItem';

describe('TaskItem', () => {
  const task = {
    id: 1,
    title: 'Ma tâche',
    description: 'Description de la tâche',
    completed: false,
    createdAt: '2026-01-20T09:00:00Z',
    updatedAt: '2026-01-20T09:00:00Z',
  };

  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.clearAllTimers();
    vi.useRealTimers();
  });

  it('renders task details and toggles completion', () => {
    const onToggle = vi.fn();
    const onDelete = vi.fn();
    const onEdit = vi.fn();

    render(
      <TaskItem
        task={task}
        onToggle={onToggle}
        onDelete={onDelete}
        onEdit={onEdit}
      />
    );

    expect(screen.getByText('Ma tâche')).toBeInTheDocument();
    expect(screen.getByText('Description de la tâche')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('checkbox'));
    expect(onToggle).toHaveBeenCalledWith(1);
  });

  it('enters edit mode and saves changes', () => {
    const onToggle = vi.fn();
    const onDelete = vi.fn();
    const onEdit = vi.fn();

    render(
      <TaskItem
        task={task}
        onToggle={onToggle}
        onDelete={onDelete}
        onEdit={onEdit}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: 'Modifier' }));
    const titleInput = screen.getByLabelText('Modifier le titre');
    fireEvent.change(titleInput, { target: { value: 'Titre modifié' } });
    fireEvent.click(screen.getByRole('button', { name: 'Enregistrer' }));

    expect(onEdit).toHaveBeenCalledWith(1, {
      title: 'Titre modifié',
      description: 'Description de la tâche',
    });
  });

  it('prevents saving when the title is empty', () => {
    const onToggle = vi.fn();
    const onDelete = vi.fn();
    const onEdit = vi.fn();

    render(
      <TaskItem
        task={task}
        onToggle={onToggle}
        onDelete={onDelete}
        onEdit={onEdit}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: 'Modifier' }));
    fireEvent.change(screen.getByLabelText('Modifier le titre'), { target: { value: '   ' } });
    fireEvent.click(screen.getByRole('button', { name: 'Enregistrer' }));

    expect(onEdit).not.toHaveBeenCalled();
  });

  it('requires delete confirmation before deleting', () => {
    const onToggle = vi.fn();
    const onDelete = vi.fn();
    const onEdit = vi.fn();

    render(
      <TaskItem
        task={task}
        onToggle={onToggle}
        onDelete={onDelete}
        onEdit={onEdit}
      />
    );

    const deleteButton = screen.getByRole('button', { name: 'Supprimer' });
    fireEvent.click(deleteButton);
    expect(screen.getByRole('button', { name: 'Supprimer' })).toHaveTextContent('⚠️');
    fireEvent.click(screen.getByRole('button', { name: 'Supprimer' }));
    expect(onDelete).toHaveBeenCalledWith(1);

    fireEvent.click(screen.getByRole('button', { name: 'Supprimer' }));
    act(() => {
      vi.advanceTimersByTime(3001);
    });
    expect(screen.getByRole('button', { name: 'Supprimer' })).toHaveTextContent('🗑️');
  });
});
