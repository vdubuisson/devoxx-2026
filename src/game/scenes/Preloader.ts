import { Scene } from 'phaser';

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
    }
}
