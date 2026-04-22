import { describe, expect, it, vi } from 'vitest';

import { Boot } from './Boot';

describe('Boot', () => {
    it('starts the Preloader scene during create', () => {
        const scene = new Boot();

        scene.create();

        expect((scene.scene.start as ReturnType<typeof vi.fn>).mock.calls).toEqual([
            ['Preloader']
        ]);
    });
});