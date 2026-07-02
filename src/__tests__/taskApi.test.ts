import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getTasks, getTask, createTask, updateTask, deleteTask } from '../api/taskApi';

const mockTask = {
  id: 1,
  title: 'Test',
  description: null,
  completed: false,
  createdAt: '2026-01-15T10:00:00Z',
  updatedAt: '2026-01-15T10:00:00Z',
};

beforeEach(() => {
  vi.restoreAllMocks();
});

describe('taskApi', () => {
  it('getTasks returns array', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve([mockTask]),
    }));

    const tasks = await getTasks();
    expect(tasks).toEqual([mockTask]);
    expect(fetch).toHaveBeenCalledWith('/api/tasks');
  });

  it('getTask returns a single task', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockTask),
    }));

    const task = await getTask(1);
    expect(task).toEqual(mockTask);
    expect(fetch).toHaveBeenCalledWith('/api/tasks/1');
  });

  it('createTask sends correct payload', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockTask),
    }));

    const payload = { title: 'Test', description: 'Desc' };
    const task = await createTask(payload);

    expect(task).toEqual(mockTask);
    expect(fetch).toHaveBeenCalledWith('/api/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
  });

  it('updateTask sends correct payload', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockTask),
    }));

    const payload = { completed: true };
    const task = await updateTask(1, payload);

    expect(task).toEqual(mockTask);
    expect(fetch).toHaveBeenCalledWith('/api/tasks/1', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
  });

  it('deleteTask handles success correctly', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true }));

    await expect(deleteTask(1)).resolves.toBeUndefined();
    expect(fetch).toHaveBeenCalledWith('/api/tasks/1', {
      method: 'DELETE',
    });
  });

  it('throws when the server returns an error', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: false,
      status: 404,
      text: () => Promise.resolve('Not found'),
    }));

    await expect(getTask(1)).rejects.toThrow('HTTP 404: Not found');
  });
});
