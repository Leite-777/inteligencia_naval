export class AudioManager {
    constructor() {
        this.sons = {
            background: new Audio("assets/audio/background_music.mp3"),
            win: new Audio("assets/audio/game_win.mp3"),
            lose: new Audio("assets/audio/game_lose.mp3"),
            explode: new Audio("assets/audio/ship_explode.mp3"),
            hit: new Audio("assets/audio/ship_hit.mp3"),
            miss: new Audio("assets/audio/ship_miss.mp3"),
            shoot: new Audio("assets/audio/ship_shoot.mp3"),
            take: new Audio("assets/audio/ship_take.mp3"),
            drop: new Audio("assets/audio/ship_drop.mp3"),
            error: new Audio("assets/audio/ship_error.mp3")
        };//vetor de sons


        this.sons.background.loop = true;
        this.sons.background.volume = 0.7;

        Object.values(this.sons).forEach(audio => {
            audio.preload = "auto";
        });
    }

    //função para iniciar a música de fundo
    playBackground() {
        this.sons.background.play();
    }

    //função para parar a música de fundo
    stopBackground() {
        this.sons.background.pause();
    }

    //função para reproduzir o som de tiro perdido(errou o navio)
    playMissShot() {
        const shoot = this.sons.shoot;
        const miss = this.sons.miss;

        shoot.currentTime = 0;
        shoot.play();

        shoot.onended = () => {
            miss.currentTime = 0;
            miss.play();
        };
    }

    //função para reproduzir o som de tiro acertado(acertou uma parte de um navio)
    playHitShot() {
        const shoot = this.sons.shoot;
        const hit = this.sons.hit;

        shoot.currentTime = 0;
        shoot.play();

        shoot.onended = () => {
            hit.currentTime = 0;
            hit.play();
        };
    }

    //função de barulho de explosão(acertou um navio completo)
    playExplosion() {
        this.sons.explode.currentTime = 0;
        this.sons.explode.play();
    }

    //função para disparar a música de vitória do jogo
    playWin() {
        this.stopBackground();
        this.sons.win.currentTime = 0;
        this.sons.win.play();
    }

    //função para disparar a música de derrota do jogo
    playLose() {
        this.stopBackground();
        this.sons.lose.currentTime = 0;
        this.sons.lose.play();
    }

    //função pra disparar efeito de pegar o navio
    playTake(){
        this.sons.take.currentTime=0;
        this.sons.take.play();
    }

    //função pra disparar efeito de soltar o navio
    playDrop(){
        this.sons.drop.currentTime=0;
        this.sons.drop.play();
    }

    //função pra disparar efeito de posicionar o navio em uma posição inválida
    playError(){
        this.sons.error.currentTime=0;
        this.sons.error.play();
    }
}