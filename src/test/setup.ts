import { vi } from 'vitest';

vi.mock('phaser', () => {
    class MockScene
    {
        public load = {
            image: vi.fn()
        };

        public scene = {
            start: vi.fn()
        };

        constructor (_key?: string)
        {
        }
    }

    return {
        Scene: MockScene
    };
});