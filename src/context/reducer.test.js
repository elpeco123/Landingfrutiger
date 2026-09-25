// Chequeo mínimo del reducer: `npm test` (usa el runner nativo de Node, sin dependencias).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { reducer, loadState } from './reducer.js';

test('loadState cae en los datos de prueba si lo guardado no sirve', () => {
  for (const bad of [null, {}, { users: 'x', posts: [] }, { users: [], posts: [] }]) {
    const s = loadState(bad);
    assert.ok(s.users.length >= 3);
    assert.ok(s.posts.length > 0);
    assert.equal(s.currentUserId, null);
  }
});

test('login, likes, comentarios y logout', () => {
  let s = reducer(loadState(null), { type: 'LOGIN', userId: 'lucia', status: 'busy' });
  assert.equal(s.users.find((u) => u.id === 'lucia').status, 'busy');

  const postId = s.posts[0].id;
  const likes = () => s.posts[0].likes.filter((id) => id === 'lucia').length;

  s = reducer(s, { type: 'LIKE', postId, userId: 'lucia' });
  assert.equal(likes(), 1);
  s = reducer(s, { type: 'LIKE', postId, userId: 'lucia' });
  assert.equal(likes(), 0);
  s = reducer(s, { type: 'LIKE', postId, userId: 'lucia', value: true });
  s = reducer(s, { type: 'LIKE', postId, userId: 'lucia', value: true });
  assert.equal(likes(), 1, 'un like forzado no se duplica');

  const before = s.posts[0].comments.length;
  s = reducer(s, { type: 'ADD_COMMENT', postId, comment: { id: 'x', authorId: 'lucia', content: 'hola', createdAt: 1 } });
  assert.equal(s.posts[0].comments.length, before + 1);

  s = reducer(s, { type: 'LOGOUT' });
  assert.equal(s.currentUserId, null);
  assert.equal(s.users.find((u) => u.id === 'lucia').status, 'offline');
});

test('se restaura una sesión guardada válida', () => {
  const saved = { ...loadState(null), currentUserId: 'tomas' };
  assert.equal(loadState(saved).currentUserId, 'tomas');
  assert.equal(loadState({ ...saved, currentUserId: 'fantasma' }).currentUserId, null);
});
