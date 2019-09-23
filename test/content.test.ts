import * as test from 'tape';
import { authorVote } from '../src/content';

test('authorVote in self MR', t => {
  const mrAuthor = 'you';
  t.true(authorVote('you, Alex Doe, and Alix Dae', mrAuthor));
  t.true(authorVote('you and Alex Doe', mrAuthor));
  t.true(authorVote('Alex Doe and you', mrAuthor));
  t.end();
});

test('authorVote in others MR', t => {
  const mrAuthor = 'Alex Doe';
  t.true(authorVote('you, Alex Doe, and Alix Dae', mrAuthor));
  t.true(authorVote('you and Alex Doe', mrAuthor));
  t.true(authorVote('Alex Doe and you', mrAuthor));
  t.end();
});
