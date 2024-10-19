import { add } from './index';

describe('testing index file', () => {
    test('empty string should result in zero', () => {
        expect(add(3, 3)).toBe(6);
    });
});
