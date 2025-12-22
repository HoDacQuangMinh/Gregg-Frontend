// GameScene.js - Modified for React Integration
export class GameScene extends Phaser.Scene {

    constructor() {
        super('GameScene');

        // --- GAME STATE ---
        this.level = 1;
        this.score = 0;
        this.playerHealth = 3;
        this.isDead = false;
        this.isPaused = false;
        
        // Flags for Animations
        this.isLevelStarting = false; 
        this.isLevelEnding = false;

        // Default Config (will be overridden by React)
        this.gameConfig = {
            charType: 'character_1',
            musicOn: true,
            mode: 'gradual',
            manualSpeed: 100,
            manualSpawnTime: 6000
        };

        // --- ASSET MANAGEMENT ---
        this.availableBGs = Array.from({length: 24}, (_, i) => i + 1); 
        this.bgKey = 'bg_level_1'; 

        // Enemy List
        this.allEnemyTypes = [
            'golem_1', 'golem_2', 'golem_3',
            'minotaur_1', 'minotaur_2', 'minotaur_3',
            'orc_1', 'orc_2', 'orc_3',
            'reaper_man_1', 'reaper_man_2', 'reaper_man_3',
            'skeleton_warrior_1', 'skeleton_warrior_2', 'skeleton_warrior_3'
        ];
        this.usedEnemyTypes = [];
        this.currentEnemyTypes = [];

        // Enemy Animation Config
        this.animMeta = {
            walk:  { frames: 24, fps: 24, repeat: -1 },
            run:   { frames: 12, fps: 12, repeat: -1 },
            slash: { frames: 12, fps: 12, repeat: -1 },
            die:   { frames: 15, fps: 24, repeat: 0 }
        };

        // Player Animation Config
        this.playerAnimMeta = {
            idle:       { frames: 18, fps: 18, repeat: -1 },
            slash:      { frames: 12, fps: 12, repeat: 0 },
            walk:       { frames: 24, fps: 24, repeat: -1 }, 
            hurt:       { frames: 12,  fps: 12, repeat: 0 },
            die:        { frames: 15, fps: 18, repeat: 0 },
            projectile: { frames: 8,  fps: 12, repeat: -1 } 
        };

        // Gameplay Variables
        this.wordList = ["magic", "sword", "shield", "orc", "elf", "fire", "ice", "run", "jump", "attack", "hero", "code"];
        this.spawnTimer = null;
        this.enemiesToSpawn = 0;
        this.spawnedCount = 0;
        this.activeTarget = null;
        this.musicIndex = 1;
    }

    init(data) {
        // Check if restarting with data (level progression)
        if (data && data.level) {
            this.level = data.level;
            this.score = data.score;
            this.playerHealth = data.playerHealth;
            this.availableBGs = data.availableBGs;
            this.usedEnemyTypes = data.usedEnemyTypes;
            this.gameConfig = data.gameConfig;
            this.musicIndex = data.musicIndex || 1;
            this.isDead = false;
            this.isLevelEnding = false;
            this.isPaused = false;
        } else {
            // Fresh start - get config from React via registry
            const reactConfig = this.game.registry.get('gameConfig');
            if (reactConfig) {
                this.gameConfig = reactConfig;
            }
            // Reset state for new game
            this.level = 1;
            this.score = 0;
            this.playerHealth = 3;
            this.isDead = false;
            this.isLevelEnding = false;
            this.isPaused = false;
            this.availableBGs = Array.from({length: 24}, (_, i) => i + 1);
            this.usedEnemyTypes = [];
        }
    }

    preload() {
        // --- BACKGROUNDS ---
        this.bgKey = `bg_level_${this.level}`;
        if (this.availableBGs && this.availableBGs.length > 0) {
            const bgIndex = Phaser.Math.RND.pick(this.availableBGs);
            this.availableBGs = this.availableBGs.filter(id => id !== bgIndex);
            const bgStr = bgIndex.toString().padStart(2, '0'); 
            const bgPath = `assets/backgrounds/bg_${bgStr}.png`;
            console.log(`Loading Level ${this.level} Background: ${bgPath}`); 
            this.load.image(this.bgKey, bgPath);
        } else {
            this.load.image(this.bgKey, 'assets/backgrounds/bg_01.png');
        }

        // --- ENEMIES ---
        let availableEnemies = this.allEnemyTypes.filter(e => !this.usedEnemyTypes.includes(e));
        if (availableEnemies.length < 3) {
            this.usedEnemyTypes = [];
            availableEnemies = this.allEnemyTypes;
        }
        Phaser.Utils.Array.Shuffle(availableEnemies);
        this.currentEnemyTypes = availableEnemies.slice(0, 3);
        this.usedEnemyTypes.push(...this.currentEnemyTypes);

        this.currentEnemyTypes.forEach(enemyName => {
            Object.keys(this.animMeta).forEach(action => {
                const key = `${enemyName}_${action}`;
                if (!this.textures.exists(key)) {
                    const path = `assets/enemies/${enemyName}/${action}/${action}_texture`;
                    this.load.atlas(key, `${path}.png`, `${path}.json`);
                }
            });
        });

        // --- PLAYER ---
        const characters = ['character_1', 'character_2'];
        characters.forEach(charName => {
            ['idle', 'slash', 'walk', 'hurt', 'die'].forEach(action => {
                const key = `${charName}_${action}`;
                if (!this.textures.exists(key)) {
                    const path = `assets/player/${charName}/${action}/${action}_texture`;
                    this.load.atlas(key, `${path}.png`, `${path}.json`);
                }
            });

            const projKey = `${charName}_projectile`;
            if (!this.textures.exists(projKey)) {
                const projPath = `assets/player/${charName}/projectile/fireball_texture`;
                this.load.atlas(projKey, `${projPath}.png`, `${projPath}.json`);
            }
        });

        // --- MUSIC ---
        for(let i=1; i<=12; i++) {
            const key = `pixel${i}`;
            if (!this.cache.audio.exists(key)) {
                this.load.audio(key, `assets/background_music/Pixel ${i}.ogg`);
            }
        }

        // --- SOUND EFFECTS ---
        const sfx = ['female_hurt', 'male_hurt', 'enemy_hurt', 'enemy_hurt_2', 'cast_fire_magic', 'enemy_strike_hit'];
        sfx.forEach(sound => {
            if(!this.cache.audio.exists(sound)) {
                this.load.audio(sound, `assets/sound_effects/${sound}.mp3`);
            }
        });
    }

    create() {
        // No more DOM menu - start game directly
        // Config is already set from React via init()
        this.startGame();
    }

    startGame() {
        const gameWidth = this.scale.width;
        const gameHeight = this.scale.height;

        let bg = this.add.image(gameWidth/2, gameHeight/2, this.bgKey);
        bg.setDisplaySize(gameWidth, gameHeight);

        this.createAnimations();

        // Setup Player (Start OFF-SCREEN to the Left)
        this.player = this.physics.add.sprite(-150, 370, 'player_idle'); 
        this.player.setScale(0.60); 
        this.player.setCollideWorldBounds(false); 
        this.player.setBodySize(this.player.width * 0.4, this.player.height * 0.7); 

        this.enemies = this.physics.add.group();
        this.projectiles = this.physics.add.group({
            defaultKey: 'projectile',
            maxSize: 20
        });

        // Difficulty
        if (this.gameConfig.mode === 'gradual') {
            this.enemiesToSpawn = 3 + ((this.level - 1) * 5); 
        } else {
            this.enemiesToSpawn = 3 + ((this.level - 1) * 5); 
        }
        this.spawnedCount = 0;

        // HUD Text
        this.scoreText = this.add.text(20, 20, `Score: ${this.score}`, { fontSize: '32px', fill: '#fff', stroke: '#000', strokeThickness: 4 });
        this.levelText = this.add.text(20, 60, `Level: ${this.level}`, { fontSize: '32px', fill: '#00ff00', stroke: '#000', strokeThickness: 4 });
        this.healthText = this.add.text(20, 100, `Health: ${this.playerHealth}`, { fontSize: '32px', fill: '#ff0000', stroke: '#000', strokeThickness: 4 });

        // Keyboard Input
        this.input.keyboard.on('keydown', (event) => this.handleTyping(event));

        // Music
        if (this.gameConfig.musicOn) {
            this.handleMusic();
        }

        // Emit event to React that game started
        this.game.events.emit('gameStarted', { level: this.level });

        // Listen for pause/resume from React
        this.game.events.on('pauseGame', () => this.pauseGame());
        this.game.events.on('resumeGame', () => this.resumeGame());

        this.startEntranceRun();
    }

    pauseGame() {
        if (this.isDead || this.isPaused) return;
        
        this.isPaused = true;
        this.physics.pause();
        
        // Pause all timers
        if (this.spawnTimer) {
            this.spawnTimer.paused = true;
        }
        
        // Pause all enemy slash timers
        this.enemies.children.each(enemy => {
            if (enemy.slashTimer) {
                enemy.slashTimer.paused = true;
            }
        });
        
        // Pause animations
        this.player.anims.pause();
        this.enemies.children.each(enemy => {
            if (enemy.active) {
                enemy.anims.pause();
            }
        });
        
        // Pause music
        this.sound.pauseAll();
        
        this.game.events.emit('gamePaused');
    }

    resumeGame() {
        if (!this.isPaused) return;
        
        this.isPaused = false;
        this.physics.resume();
        
        // Resume all timers
        if (this.spawnTimer) {
            this.spawnTimer.paused = false;
        }
        
        // Resume all enemy slash timers
        this.enemies.children.each(enemy => {
            if (enemy.slashTimer) {
                enemy.slashTimer.paused = false;
            }
        });
        
        // Resume animations
        this.player.anims.resume();
        this.enemies.children.each(enemy => {
            if (enemy.active) {
                enemy.anims.resume();
            }
        });
        
        // Resume music
        this.sound.resumeAll();
        
        this.game.events.emit('gameResumed');
    }

    startEntranceRun() {
        this.isLevelStarting = true;
        this.player.play('player_walk_anim');
        this.player.setVelocityX(300); 
    }

    startSpawner() {
        let delayTime = 6000;
        if (this.gameConfig.mode === 'manual') {
            delayTime = this.gameConfig.manualSpawnTime;
        } else {
            delayTime = Math.max(1000, 6000 - (this.level * 200)); 
        }

        this.spawnTimer = this.time.addEvent({
            delay: delayTime,
            callback: this.trySpawnEnemy,
            callbackScope: this,
            loop: true
        });
    }

    createAnimations() {
        const selectedChar = this.gameConfig.charType;
        const createPlayerAnim = (animKey, actionName, animConfig) => {
            const textureKey = `${selectedChar}_${actionName}`;
            const prefix = `${actionName}/${actionName}_`;

            if (!this.anims.exists(animKey)) {
                this.anims.create({
                    key: animKey,
                    frames: this.anims.generateFrameNames(textureKey, {
                        prefix: prefix, 
                        start: 1,
                        end: animConfig.frames,
                        zeroPad: 2,
                        suffix: '.png'       
                    }),
                    frameRate: animConfig.fps,
                    repeat: animConfig.repeat
                });
            }
        };

        createPlayerAnim('player_idle_anim', 'idle', this.playerAnimMeta.idle);
        createPlayerAnim('player_slash_anim', 'slash', this.playerAnimMeta.slash);
        createPlayerAnim('player_walk_anim', 'walk', this.playerAnimMeta.walk);
        createPlayerAnim('player_hurt_anim', 'hurt', this.playerAnimMeta.hurt);
        createPlayerAnim('player_die_anim', 'die', this.playerAnimMeta.die);
        
        if (!this.anims.exists('projectile_anim')) {
            this.anims.create({
                key: 'projectile_anim',
                frames: this.anims.generateFrameNames(`${selectedChar}_projectile`, {
                    prefix: 'fireball/fireball_',
                    start: 1,
                    end: this.playerAnimMeta.projectile.frames,
                    zeroPad: 2,
                    suffix: '.png'
                }),
                frameRate: 12,
                repeat: -1
            });
        }

        this.currentEnemyTypes.forEach(enemyName => {
            Object.keys(this.animMeta).forEach(action => {
                const config = this.animMeta[action];
                const key = `${enemyName}_${action}`; 
                const animKey = `${key}_anim`;
                const prefix = `${action}/${action}_`; 

                if (!this.anims.exists(animKey)) {
                    this.anims.create({
                        key: animKey, 
                        frames: this.anims.generateFrameNames(key, { 
                            prefix: prefix, 
                            start: 1, 
                            end: config.frames, 
                            zeroPad: 2, 
                            suffix: '.png' 
                        }),
                        frameRate: config.fps,
                        repeat: config.repeat
                    });
                }
            });
        });
    }

    handleMusic() {
        if (this.sound.getAllPlaying().length > 0) return;
        const playNext = () => {
            if (!this.gameConfig.musicOn) return;
            const trackKey = `pixel${this.musicIndex}`;
            const music = this.sound.add(trackKey, { volume: 0.5 });
            music.play();
            music.once('complete', () => {
                this.musicIndex++;
                if (this.musicIndex > 12) this.musicIndex = 1;
                playNext();
            });
        };
        playNext();
    }

    trySpawnEnemy() {
        if (this.spawnedCount >= this.enemiesToSpawn) return;
        
        const lanes = [350, 400, 450]; 
        const yPos = Phaser.Math.RND.pick(lanes);
        const type = Phaser.Math.RND.pick(this.currentEnemyTypes);
        const word = Phaser.Math.RND.pick(this.wordList);
        
        let speed = 50; 
        if (this.gameConfig.mode === 'manual') speed = this.gameConfig.manualSpeed;
        else speed = 30 + (this.level * 5); 

        const enemy = this.enemies.create(1400, yPos, `${type}_walk`);
        enemy.play(`${type}_walk_anim`);
        enemy.setVelocityX(-speed);
        enemy.setFlipX(true); 
        enemy.setScale(0.60); 
        enemy.setBodySize(enemy.width * 0.5, enemy.height * 0.8); 

        enemy.setData('type', type);
        enemy.setData('word', word);
        enemy.setData('progress', '');
        enemy.setData('isDying', false);
        enemy.setData('isSlashing', false);

        const label = this.add.text(1400, yPos - 80, word, { 
            fontSize: '24px', fill: '#ffffff', backgroundColor: '#000000', padding: { x: 5, y: 5 } 
        });
        enemy.setData('label', label);
        this.spawnedCount++;
    }

    update() {
        if (!this.player) return; 

        // --- ENTRANCE ANIMATION LOGIC (Start of Level) ---
        if (this.isLevelStarting) {
            if (this.player.x >= 150) {
                this.player.x = 150; 
                this.player.setVelocityX(0); 
                this.player.play('player_idle_anim'); 
                this.player.setCollideWorldBounds(true); 
                
                this.isLevelStarting = false;
                this.startSpawner(); 
            }
            return; 
        }

        // --- EXIT ANIMATION LOGIC (End of Level) ---
        if (this.isLevelEnding) {
            if (this.player.x > this.scale.width + 100) {
                this.startNextLevelScene();
            }
            return;
        }

        // --- STANDARD GAME LOOP ---
        this.projectiles.children.each(proj => {
            if (proj.active && proj.x > 1400) {
                proj.destroy();
            }
        });

        this.enemies.children.each(enemy => {
            if (enemy.active) {
                const label = enemy.getData('label');
                if (label) {
                    label.x = enemy.x - 20;
                    label.y = enemy.y - 80;
                }
                if (!enemy.getData('isDying') && !enemy.getData('isSlashing')) {
                    if (enemy.x < this.player.x + 100) {
                        this.enemySlashPlayer(enemy);
                    }
                }
            }
        });

        // --- CHECK VICTORY CONDITION ---
        if (!this.isLevelEnding && this.spawnedCount >= this.enemiesToSpawn && this.enemies.countActive(true) === 0) {
            this.levelComplete();
        }

        // Emit score updates to React
        this.game.events.emit('scoreUpdate', { 
            score: this.score, 
            level: this.level, 
            health: this.playerHealth 
        });
    }

    enemySlashPlayer(enemy) {
        enemy.setData('isSlashing', true);
        enemy.setVelocityX(0); 
        enemy.play(`${enemy.getData('type')}_slash_anim`);

        this.sound.play('enemy_strike_hit', { volume: 0.6 });
        this.scheduleHurtSound();

        enemy.slashTimer = this.time.addEvent({
            delay: 1000,
            callback: () => {
                if (enemy.active && !enemy.getData('isDying')) {
                    this.takeDamage();
                    if (this.playerHealth > 0) {
                        this.sound.play('enemy_strike_hit', { volume: 0.6 });
                        this.scheduleHurtSound();
                    }
                }
            },
            loop: true
        });
    }

    scheduleHurtSound() {
        if (this.gameConfig.charType === 'character_2') {
            this.time.delayedCall(500, () => {
                if (this.playerHealth > 0 && !this.isDead) this.sound.play('female_hurt', { volume: 0.8 });
            });
        } else {
            this.time.delayedCall(800, () => {
                if (this.playerHealth > 0 && !this.isDead) this.sound.play('male_hurt', { volume: 0.8 });
            });
        }
    }

    takeDamage() {
        if (this.isDead) return;
        this.playerHealth--;
        this.healthText.setText(`Health: ${this.playerHealth}`);
        this.cameras.main.shake(100, 0.01);

        // Emit health update to React
        this.game.events.emit('healthUpdate', { health: this.playerHealth });

        if (this.playerHealth <= 0) {
            this.isDead = true;
            this.physics.pause();
            this.player.play('player_die_anim');
            this.player.once('animationcomplete', () => {
                this.gameOver();
            });
        } else {
            this.player.play('player_hurt_anim');
            this.player.once('animationcomplete', () => {
                if (!this.isDead) this.player.play('player_idle_anim');
            });
        }
    }

    handleTyping(event) {
        if (this.isDead || this.isLevelStarting || this.isLevelEnding || this.isPaused) return; 
        const key = event.key.toLowerCase();
        if (!/^[a-z]$/.test(key)) return;
        if (!this.activeTarget) {
            const potential = this.enemies.getChildren().find(e => 
                e.active && !e.getData('isDying') && e.getData('word').startsWith(key)
            );
            if (potential) this.activeTarget = potential;
        }
        if (this.activeTarget) {
            const word = this.activeTarget.getData('word');
            const progress = this.activeTarget.getData('progress') + key;
            if (word.startsWith(progress)) {
                this.activeTarget.setData('progress', progress);
                const label = this.activeTarget.getData('label');
                label.setText(progress + word.substring(progress.length));
                label.setColor('#00ff00');
                if (progress === word) {
                    this.fireProjectile(this.activeTarget);
                }
            }
        }
    }

    fireProjectile(target) {
        this.sound.play('cast_fire_magic', { volume: 0.7 });
        this.player.play('player_slash_anim');
        this.player.once('animationcomplete', () => {
            if (!this.isDead) this.player.play('player_idle_anim');
        });

        const projTextureKey = `${this.gameConfig.charType}_projectile`;
        
        const fireball = this.projectiles.create(this.player.x + 80, this.player.y, projTextureKey);
        
        fireball.setFlipX(true); 
        fireball.setScale(1.5); 
        fireball.play('projectile_anim'); 

        this.physics.moveToObject(fireball, target, 600);

        this.physics.add.overlap(fireball, target, (fb, en) => {
            fb.destroy();
            if (Phaser.Math.RND.pick([true, false])) {
                this.sound.play('enemy_hurt', { volume: 0.7 });
            } else {
                this.sound.play('enemy_hurt_2', { volume: 0.7 });
            }
            this.killEnemy(en);
        });
    }

    killEnemy(enemy) {
        if (enemy.slashTimer) enemy.slashTimer.remove();
        enemy.setData('isDying', true);
        enemy.setVelocity(0);
        if(enemy.getData('label')) enemy.getData('label').destroy();
        enemy.play(`${enemy.getData('type')}_die_anim`);
        enemy.once('animationcomplete', () => {
            enemy.destroy();
            if (this.activeTarget === enemy) {
                this.activeTarget = null;
            }
            this.score += 10;
            this.scoreText.setText(`Score: ${this.score}`);
            
            // Emit score update to React
            this.game.events.emit('scoreUpdate', { score: this.score, level: this.level });
        });
    }

    levelComplete() {
        if (this.spawnTimer) this.spawnTimer.remove();
        
        this.isLevelEnding = true;

        // Emit level complete to React
        this.game.events.emit('levelComplete', { 
            level: this.level, 
            score: this.score 
        });

        this.player.setCollideWorldBounds(false); 
        this.player.play('player_walk_anim');
        this.player.setVelocityX(300); 
    }

    startNextLevelScene() {
        this.scene.restart({
            level: this.level + 1,
            score: this.score,
            playerHealth: this.playerHealth, 
            availableBGs: this.availableBGs,
            usedEnemyTypes: this.usedEnemyTypes,
            gameConfig: this.gameConfig,
            musicIndex: this.musicIndex
        });
    }

    gameOver() {
        // Stop all sounds
        this.sound.stopAll();
        
        // Emit game over event to React instead of using alert
        this.game.events.emit('gameOver', {
            score: this.score,
            level: this.level
        });
    }
}