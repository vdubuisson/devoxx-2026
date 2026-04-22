import { Scene } from 'phaser';

export class GameOver extends Scene
{
    constructor ()
    {
        super('GameOver');
    }

    create (data: { score?: number })
    {
        const centerX = 512;
        const finalScore = data.score ?? 0;

        this.add.tileSprite(512, 384, 1024, 768, 'starfield').setDepth(-1);

        this.add.text(centerX, 250, 'GAME OVER', {
            fontFamily: 'Courier New',
            fontSize: '72px',
            color: '#ff4444',
            stroke: '#000000',
            strokeThickness: 4,
            align: 'center'
        }).setOrigin(0.5);

        this.add.text(centerX, 360, 'SCORE: ' + finalScore, {
            fontFamily: 'Courier New',
            fontSize: '36px',
            color: '#ffffff',
            align: 'center'
        }).setOrigin(0.5);

        const restartText = this.add.text(centerX, 460, 'CLICK TO RESTART', {
            fontFamily: 'Courier New',
            fontSize: '24px',
            color: '#ffff44',
            align: 'center'
        }).setOrigin(0.5);

        this.tweens.add({
            targets: restartText,
            alpha: 0.2,
            duration: 800,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });

        this.input.once('pointerdown', () => {
            this.scene.start('MainMenu');
        });
    }
}
