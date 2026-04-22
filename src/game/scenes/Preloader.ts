import { Scene, Math as PhaserMath } from 'phaser';

export class Preloader extends Scene
{
    constructor ()
    {
        super('Preloader');
    }

    preload ()
    {
        this.load.image('enemy1', 'assets/betclic.png');
        this.load.image('enemy2', 'assets/github.png');
        this.load.image('enemy3', 'assets/packmind.png');
    }

    create ()
    {
        this.generateTextures();
        this.scene.start('MainMenu');
    }

    private generateTextures ()
    {
        const gfx = this.add.graphics();

        // Player ship — white triangle pointing up (40x32)
        gfx.fillStyle(0xffffff);
        gfx.fillTriangle(20, 0, 0, 32, 40, 32);
        gfx.generateTexture('player', 40, 32);
        gfx.clear();

        // Player bullet — white rectangle (4x16)
        gfx.fillStyle(0xffffff);
        gfx.fillRect(0, 0, 4, 16);
        gfx.generateTexture('bullet', 4, 16);
        gfx.clear();

        // Enemy bullet — red rectangle (4x12)
        gfx.fillStyle(0xff4444);
        gfx.fillRect(0, 0, 4, 12);
        gfx.generateTexture('enemyBullet', 4, 12);
        gfx.clear();

        gfx.destroy();
        this.generateStarfield();
    }

    private generateStarfield ()
    {
        const gfx = this.add.graphics();
        const size = 512;

        // Black background
        gfx.fillStyle(0x000000);
        gfx.fillRect(0, 0, size, size);

        // Dim stars
        gfx.fillStyle(0x555555);
        for (let i = 0; i < 120; i++)
        {
            const x = PhaserMath.RND.integerInRange(0, size - 1);
            const y = PhaserMath.RND.integerInRange(0, size - 1);
            gfx.fillRect(x, y, 1, 1);
        }

        // Medium stars
        gfx.fillStyle(0xaaaaaa);
        for (let i = 0; i < 40; i++)
        {
            const x = PhaserMath.RND.integerInRange(0, size - 1);
            const y = PhaserMath.RND.integerInRange(0, size - 1);
            gfx.fillRect(x, y, 1, 1);
        }

        // Bright stars
        gfx.fillStyle(0xffffff);
        for (let i = 0; i < 20; i++)
        {
            const x = PhaserMath.RND.integerInRange(0, size - 1);
            const y = PhaserMath.RND.integerInRange(0, size - 1);
            gfx.fillRect(x, y, 1, 1);
        }

        // Accent 2×2 stars
        for (let i = 0; i < 8; i++)
        {
            const x = PhaserMath.RND.integerInRange(0, size - 2);
            const y = PhaserMath.RND.integerInRange(0, size - 2);
            gfx.fillRect(x, y, 2, 2);
        }

        gfx.generateTexture('starfield', size, size);
        gfx.destroy();
    }
}
