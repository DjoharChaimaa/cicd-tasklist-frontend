import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import App from '../App';
import * as useTasksModule from '../hooks/useTasks';

vi.mock('../hooks/useTasks', () => ({
  useTasks: vi.fn(),
}));

const mockedUseTasks = vi.mocked(useTasksModule.useTasks);

describe('App', () => {
  it('renders header stats and task list when tasks exist', () => {
    mockedUseTasks.mockReturnValue({
      tasks: [
        {
          id: 1,
          title: 'Test',
          description: null,
          completed: true,
          createdAt: '2026-01-01T00:00:00Z',
          updatedAt: '2026-01-01T00:00:00Z',
        },
      ],
      loading: false,
      error: null,
      loadTasks: vi.fn(),
      addTask: vi.fn(),
      editTask: vi.fn(),
      removeTask: vi.fn(),
      toggleComplete: vi.fn(),
    });

    render(<App />);

    expect(screen.getByText('Mes Tâches')).toBeInTheDocument();
    expect(screen.getByText('Total')).toBeInTheDocument();
    expect(screen.getAllByText('1')).toHaveLength(2);
  });

  it('renders task form on empty state', () => {
    mockedUseTasks.mockReturnValue({
      tasks: [],
      loading: false,
      error: null,
      loadTasks: vi.fn(),
      addTask: vi.fn(),
      editTask: vi.fn(),
      removeTask: vi.fn(),
      toggleComplete: vi.fn(),
    });

    render(<App />);
    expect(screen.getByRole('heading', { name: 'Nouvelle tâche' })).toBeInTheDocument();
  });
});
