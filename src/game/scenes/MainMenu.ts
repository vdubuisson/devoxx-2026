import { Scene } from 'phaser';

export class MainMenu extends Scene
{
    constructor ()
    {
        super('MainMenu');
    }

    create ()
    {
        const centerX = 512;

        this.add.text(centerX, 180, 'DEVOXX INVADERS', {
            fontFamily: 'Courier New',
            fontSize: '64px',
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 4,
            align: 'center'
        }).setOrigin(0.5);

        // Decorative row of enemy shapes
        const enemyKeys = ['enemy1', 'enemy2', 'enemy3'];
        for (let i = 0; i < 5; i++)
        {
            this.add.image(centerX - 120 + i * 60, 300, enemyKeys[i % 3]).setDisplaySize(36, 32);
        }

        const startText = this.add.text(centerX, 420, 'CLICK TO START', {
            fontFamily: 'Courier New',
            fontSize: '28px',
            color: '#ffff44',
            align: 'center'
        }).setOrigin(0.5);

        this.tweens.add({
            targets: startText,
            alpha: 0.2,
            duration: 800,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });

        this.input.once('pointerdown', () => {
            this.scene.start('Game');
        });
    }
}
