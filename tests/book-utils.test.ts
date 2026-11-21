import { describe, expect, it } from 'vitest';
import { getBookById } from '../src/utils/book-utils';

describe('getBookById', () => {
    it('returns a book when the ID exists', () => {
        const book = getBookById('1');

        expect(book?.title).toBe('The Great Gatsby');
    });
    it('returns undefined when the ID does not exist', () => {
        const book = getBookById('999');
        expect(book).toBeUndefined();
    });
});