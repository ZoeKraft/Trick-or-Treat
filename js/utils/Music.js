export default class Music {
    constructor(scene, key, volume = 0.5, loop = true) {
        this.scene = scene;
        this.key = key;
        this.volume = volume;
        this.loop = loop;
        this.music = null;
    }

    play() {
        if (this.music) {
            
            if (this.music.isPlaying) {
                this.music.stop();
            }
        }

        
        this.music = this.scene.sound.add(this.key, {
            volume: this.volume,
            loop: this.loop,
        });
        this.music.play();
    }

    stop() {
        if (this.music && this.music.isPlaying) {
            this.music.stop();
        }
    }

    setVolume(volume) {
        this.volume = volume;
        if (this.music) {
            this.music.setVolume(volume);
        }
    }

    isPlaying() {
        return this.music && this.music.isPlaying;
    }
}
