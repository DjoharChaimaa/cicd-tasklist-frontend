import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as taskApi from '../api/taskApi';
import { useTasks } from '../hooks/useTasks';

const initialTask = {
  id: 1,
  title: 'Initial task',
  description: 'Initial description',
  completed: false,
  createdAt: '2026-01-01T00:00:00Z',
  updatedAt: '2026-01-01T00:00:00Z',
};

function TestComponent() {
  const { tasks, loading, error, addTask, editTask, removeTask, toggleComplete } = useTasks();

  return (
    <div>
      <div data-testid="loading">{loading ? 'loading' : 'ready'}</div>
      <div data-testid="error">{error || ''}</div>
      <div data-testid="tasks">
        {tasks.map((task) => (
          <div key={task.id} data-testid={`task-${task.id}`}>
            {task.title} - {String(task.completed)}
          </div>
        ))}
      </div>
      <button onClick={() => addTask({ title: 'New task' })}>add</button>
      <button onClick={() => editTask(1, { title: 'Updated task' })}>edit</button>
      <button onClick={() => removeTask(1)}>remove</button>
      <button onClick={() => toggleComplete(1)}>toggle</button>
    </div>
  );
}

describe('useTasks', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('loads tasks and supports task operations', async () => {
    const getTasksSpy = vi.spyOn(taskApi, 'getTasks').mockResolvedValue([initialTask]);
    const createTaskSpy = vi.spyOn(taskApi, 'createTask').mockResolvedValue({
      ...initialTask,
      id: 2,
      title: 'New task',
    });
    const updateTaskSpy = vi.spyOn(taskApi, 'updateTask').mockResolvedValue({
      ...initialTask,
      title: 'Updated task',
    });
    const deleteTaskSpy = vi.spyOn(taskApi, 'deleteTask').mockResolvedValue();

    const user = userEvent.setup();
    render(<TestComponent />);

    await waitFor(() => expect(getTasksSpy).toHaveBeenCalled());
    await waitFor(() => expect(screen.getByTestId('task-1')).toBeInTheDocument());

    await user.click(screen.getByRole('button', { name: 'add' }));
    await waitFor(() => expect(createTaskSpy).toHaveBeenCalled());
    expect(screen.getByTestId('task-2')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'edit' }));
    await waitFor(() => expect(updateTaskSpy).toHaveBeenCalledWith(1, { title: 'Updated task' }));

    await user.click(screen.getByRole('button', { name: 'toggle' }));
    await waitFor(() => expect(updateTaskSpy).toHaveBeenCalledWith(1, { completed: true }));

    await user.click(screen.getByRole('button', { name: 'remove' }));
    await waitFor(() => expect(deleteTaskSpy).toHaveBeenCalledWith(1));
  });

  it('sets an error when loading tasks fails', async () => {
    vi.spyOn(taskApi, 'getTasks').mockRejectedValue(new Error('Network error'));

    render(<TestComponent />);

    await waitFor(() => expect(screen.getByTestId('error')).toHaveTextContent('Network error'));
  });
});
