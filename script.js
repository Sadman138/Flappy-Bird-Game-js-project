let move_speed = 3, gravity = 0.5;
let bird = document.querySelector('.bird');
let img = document.getElementById('bird-1');
let sound_point = new Audio('sounds effect/point.mp3');
let sound_die = new Audio('sounds effect/die.mp3');

let bird_props = bird.getBoundingClientRect();
let background = document.querySelector('.background').getBoundingClientRect();

let score_val = document.querySelector('.score_val');
let message = document.querySelector('.message');
let game_state = 'Start';

img.style.display = 'none';
message.classList.add('messageStyle');

document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && game_state !== 'Play') {
        document.querySelectorAll('.pipe_sprite').forEach((pipe) => pipe.remove());
        img.style.display = 'block';
        bird.style.top = '40vh';
        score_val.innerHTML = '0';
        message.innerHTML = '';
        message.classList.remove('messageStyle');
        game_state = 'Play';
        play();
    }
});

function play() {
    let bird_dy = 0;
    let pipe_separation = 0;
    let pipe_gap = 35;
    let score = 0;

    // Avoid adding event listeners multiple times
    function jumpHandler(e) {
        if (e.key === 'ArrowUp' || e.key === ' ') {
            img.src = 'images/Bird-2.png';
            bird_dy = -7.6;
        }
    }
    function jumpEndHandler(e) {
        if (e.key === 'ArrowUp' || e.key === ' ') {
            img.src = 'images/Bird.png';
        }
    }
    document.removeEventListener('keydown', jumpHandler);
    document.removeEventListener('keyup', jumpEndHandler);
    document.addEventListener('keydown', jumpHandler);
    document.addEventListener('keyup', jumpEndHandler);

    function move() {
        if (game_state !== 'Play') return;

        let pipes = document.querySelectorAll('.pipe_sprite');
        pipes.forEach((pipe) => {
            let pipe_props = pipe.getBoundingClientRect();
            bird_props = bird.getBoundingClientRect();

            // Remove pipes out of screen
            if (pipe_props.right <= 0) {
                pipe.remove();
            } else {
                // Collision detection
                if (
                    bird_props.left < pipe_props.left + pipe_props.width &&
                    bird_props.left + bird_props.width > pipe_props.left &&
                    bird_props.top < pipe_props.top + pipe_props.height &&
                    bird_props.top + bird_props.height > pipe_props.top
                ) {
                    gameOver();
                    return;
                }

                // Score update once when pipe crosses bird
                if (
                    pipe_props.right < bird_props.left &&
                    pipe.increase_score === '1'
                ) {
                    score++;
                    score_val.innerHTML = score;
                    pipe.increase_score = '0'; // Prevent multiple scoring for same pipe
                    sound_point.play();
                }

                pipe.style.left = pipe_props.left - move_speed + 'px';
            }
        });

        requestAnimationFrame(move);
    }

    function applyGravity() {
        if (game_state !== 'Play') return;

        bird_dy += gravity;
        bird_props = bird.getBoundingClientRect();

        // If bird hits top or bottom, game over
        if (bird_props.top <= 0 || bird_props.bottom >= background.bottom) {
            gameOver();
            return;
        }

        bird.style.top = bird_props.top + bird_dy + 'px';
        requestAnimationFrame(applyGravity);
    }

    function createPipe() {
        if (game_state !== 'Play') return;

        if (pipe_separation > 115) {
            pipe_separation = 0;

            let pipe_pos = Math.floor(Math.random() * 43) + 8;

            // Top pipe (inverted)
            let pipe_top = document.createElement('div');
            pipe_top.className = 'pipe_sprite';
            pipe_top.style.top = pipe_pos - 70 + 'vh';
            pipe_top.style.left = '100vw';
            document.body.appendChild(pipe_top);

            // Bottom pipe
            let pipe_bottom = document.createElement('div');
            pipe_bottom.className = 'pipe_sprite';
            pipe_bottom.style.top = pipe_pos + pipe_gap + 'vh';
            pipe_bottom.style.left = '100vw';
            pipe_bottom.increase_score = '1'; // Mark this pipe for scoring
            document.body.appendChild(pipe_bottom);
        }
        pipe_separation++;
        requestAnimationFrame(createPipe);
    }

    function gameOver() {
        game_state = 'End';
        message.innerHTML = '<span style="color:red;">Game Over</span><br>Press Enter To Restart';
        message.classList.add('messageStyle');
        img.style.display = 'none';
        sound_die.play();
    }

    requestAnimationFrame(move);
    requestAnimationFrame(applyGravity);
    requestAnimationFrame(createPipe);
}
