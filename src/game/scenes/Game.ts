import { Scene, Physics, Input, GameObjects, Math as PhaserMath } from 'phaser';

export class Game extends Scene
{
    private player!: Physics.Arcade.Image;
    private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
    private spaceKey!: Input.Keyboard.Key;

    private enemies!: Physics.Arcade.Group;
    private playerBullets!: Physics.Arcade.Group;
    private enemyBullets!: Physics.Arcade.Group;

    private scoreText!: GameObjects.Text;
    private livesText!: GameObjects.Text;

    private score = 0;
    private lives = 3;
    private isGameOver = false;
    private isInvulnerable = false;

    private enemyDirection = 1;
    private enemySpeed = 60;
    private enemyFireTimer!: Phaser.Time.TimerEvent;
    private starfield!: GameObjects.TileSprite;

    constructor ()
    {
        super('Game');
    }

    create ()
    {
        this.score = 0;
        this.lives = 3;
        this.isGameOver = false;
        this.isInvulnerable = false;
        this.enemyDirection = 1;
        this.enemySpeed = 60;

        this.starfield = this.add.tileSprite(512, 384, 1024, 768, 'starfield').setDepth(-1);

        // Player
        this.player = this.physics.add.image(512, 700, 'player');
        this.player.setCollideWorldBounds(true);

        // Input
        this.cursors = this.input.keyboard!.createCursorKeys();
        this.spaceKey = this.input.keyboard!.addKey(Input.Keyboard.KeyCodes.SPACE);

        // Bullet pools
        this.playerBullets = this.physics.add.group({
            defaultKey: 'bullet',
            maxSize: 5
        });

        this.enemyBullets = this.physics.add.group({
            defaultKey: 'enemyBullet',
            maxSize: 10
        });

        // Enemy grid
        this.createEnemyGrid();

        // Collisions
        this.physics.add.overlap(this.playerBullets, this.enemies, this.hitEnemy, undefined, this);
        this.physics.add.overlap(this.enemyBullets, this.player, this.hitPlayer, undefined, this);

        // Enemy shooting timer
        this.enemyFireTimer = this.time.addEvent({
            delay: 1500,
            callback: this.enemyFire,
            callbackScope: this,
            loop: true
        });

        // HUD
        this.scoreText = this.add.text(16, 16, 'SCORE: 0', {
            fontFamily: 'Courier New',
            fontSize: '24px',
            color: '#ffffff'
        });

        this.livesText = this.add.text(1008, 16, 'LIVES: 3', {
            fontFamily: 'Courier New',
            fontSize: '24px',
            color: '#ffffff'
        }).setOrigin(1, 0);
    }

    private createEnemyGrid ()
    {
        this.enemies = this.physics.add.group();

        const rows = 5;
        const cols = 8;
        const spacingX = 60;
        const spacingY = 50;
        const startX = 512 - ((cols - 1) * spacingX) / 2;
        const startY = 80;

        const textures = ['enemy1', 'enemy1', 'enemy2', 'enemy2', 'enemy3'];

        for (let row = 0; row < rows; row++)
        {
            for (let col = 0; col < cols; col++)
            {
                const x = startX + col * spacingX;
                const y = startY + row * spacingY;
                const enemy = this.enemies.create(x, y, textures[row]) as Physics.Arcade.Image;
                enemy.setDisplaySize(36, 32);
                enemy.setData('points', (rows - row) * 10);
            }
        }
    }

    update ()
    {
        this.starfield.tilePositionY += 0.5;

        if (this.isGameOver) return;

        // Player movement
        if (this.cursors.left.isDown)
        {
            this.player.setVelocityX(-300);
        }
        else if (this.cursors.right.isDown)
        {
            this.player.setVelocityX(300);
        }
        else
        {
            this.player.setVelocityX(0);
        }

        // Player shooting
        if (Input.Keyboard.JustDown(this.spaceKey))
        {
            this.firePlayerBullet();
        }

        // Move enemies
        this.moveEnemies();

        // Clean up off-screen bullets
        this.cleanBullets();
    }

    private firePlayerBullet ()
    {
        const bullet = this.playerBullets.get(this.player.x, this.player.y - 20) as Physics.Arcade.Image | null;
        if (bullet)
        {
            bullet.setActive(true);
            bullet.setVisible(true);
            bullet.body!.enable = true;
            (bullet.body as Physics.Arcade.Body).setVelocityY(-400);
        }
    }

    private enemyFire ()
    {
        if (this.isGameOver) return;

        const activeEnemies = this.enemies.getChildren().filter(e => e.active);
        if (activeEnemies.length === 0) return;

        const shooter = PhaserMath.RND.pick(activeEnemies) as Physics.Arcade.Image;
        const bullet = this.enemyBullets.get(shooter.x, shooter.y + 16) as Physics.Arcade.Image | null;
        if (bullet)
        {
            bullet.setActive(true);
            bullet.setVisible(true);
            bullet.body!.enable = true;
            (bullet.body as Physics.Arcade.Body).setVelocityY(200);
        }
    }

    private moveEnemies ()
    {
        const children = this.enemies.getChildren() as Physics.Arcade.Image[];
        let shouldDescend = false;

        for (const enemy of children)
        {
            if (!enemy.active) continue;

            if ((this.enemyDirection > 0 && enemy.x >= 984) ||
                (this.enemyDirection < 0 && enemy.x <= 40))
            {
                shouldDescend = true;
                break;
            }
        }

        if (shouldDescend)
        {
            this.enemyDirection *= -1;
            this.enemySpeed += 5;

            for (const enemy of children)
            {
                if (!enemy.active) continue;
                enemy.y += 30;

                // If enemies reach the player's row, game over
                if (enemy.y >= 670)
                {
                    this.gameOver();
                    return;
                }
            }
        }

        for (const enemy of children)
        {
            if (!enemy.active) continue;
            enemy.x += this.enemyDirection * this.enemySpeed * (this.game.loop.delta / 1000);
        }
    }

    private cleanBullets ()
    {
        for (const bullet of this.playerBullets.getChildren() as Physics.Arcade.Image[])
        {
            if (bullet.active && bullet.y < -10)
            {
                this.playerBullets.killAndHide(bullet);
                (bullet.body as Physics.Arcade.Body).stop();
                bullet.body!.enable = false;
            }
        }

        for (const bullet of this.enemyBullets.getChildren() as Physics.Arcade.Image[])
        {
            if (bullet.active && bullet.y > 780)
            {
                this.enemyBullets.killAndHide(bullet);
                (bullet.body as Physics.Arcade.Body).stop();
                bullet.body!.enable = false;
            }
        }
    }

    private hitEnemy (
        bullet: Phaser.Types.Physics.Arcade.GameObjectWithBody | Phaser.Tilemaps.Tile,
        enemy: Phaser.Types.Physics.Arcade.GameObjectWithBody | Phaser.Tilemaps.Tile
    )
    {
        const b = bullet as Physics.Arcade.Image;
        const e = enemy as Physics.Arcade.Image;

        this.playerBullets.killAndHide(b);
        (b.body as Physics.Arcade.Body).stop();
        b.body!.enable = false;

        this.enemies.killAndHide(e);
        (e.body as Physics.Arcade.Body).stop();
        e.body!.enable = false;

        this.score += e.getData('points') as number;
        this.scoreText.setText('SCORE: ' + this.score);

        // Check if all enemies destroyed
        const remaining = this.enemies.getChildren().filter(c => c.active).length;
        if (remaining === 0)
        {
            this.nextWave();
        }
    }

    private hitPlayer (
        player: Phaser.Types.Physics.Arcade.GameObjectWithBody | Phaser.Tilemaps.Tile,
        bullet: Phaser.Types.Physics.Arcade.GameObjectWithBody | Phaser.Tilemaps.Tile
    )
    {
        if (this.isInvulnerable) return;

        const b = bullet as Physics.Arcade.Image;
        this.enemyBullets.killAndHide(b);
        (b.body as Physics.Arcade.Body).stop();
        b.body!.enable = false;

        this.lives--;
        this.livesText.setText('LIVES: ' + this.lives);

        if (this.lives <= 0)
        {
            this.gameOver();
            return;
        }

        // Brief invulnerability
        this.isInvulnerable = true;
        this.tweens.add({
            targets: this.player,
            alpha: 0.3,
            duration: 100,
            yoyo: true,
            repeat: 5,
            onComplete: () => {
                this.player.setAlpha(1);
                this.isInvulnerable = false;
            }
        });
    }

    private nextWave ()
    {
        this.enemySpeed = 60;
        this.enemyDirection = 1;

        // Clear any remaining bullets
        for (const b of this.playerBullets.getChildren() as Physics.Arcade.Image[])
        {
            this.playerBullets.killAndHide(b);
            if (b.body) {
                (b.body as Physics.Arcade.Body).stop();
                b.body.enable = false;
            }
        }
        for (const b of this.enemyBullets.getChildren() as Physics.Arcade.Image[])
        {
            this.enemyBullets.killAndHide(b);
            if (b.body) {
                (b.body as Physics.Arcade.Body).stop();
                b.body.enable = false;
            }
        }

        // Remove old enemy group and collision, recreate
        this.enemies.destroy(true);
        this.createEnemyGrid();
        this.physics.add.overlap(this.playerBullets, this.enemies, this.hitEnemy, undefined, this);
    }

    private gameOver ()
    {
        this.isGameOver = true;
        this.enemyFireTimer.destroy();
        this.player.setVelocity(0);
        this.physics.pause();

        this.time.delayedCall(1000, () => {
            this.scene.start('GameOver', { score: this.score });
        });
    }
}
