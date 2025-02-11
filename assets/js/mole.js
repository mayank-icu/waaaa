document.addEventListener('DOMContentLoaded', () => {
    const holes = document.querySelectorAll('.hole');
    const scoreValue = document.getElementById('scoreValue');
    const chancesValue = document.getElementById('chancesValue');
    const whackSound = document.getElementById('whackSound');
    const lostSound = document.getElementById('lostSound');
    const winGif = document.getElementById('winGif');
    let score = 0;
    let chances = 3;
    let moleTimeout;

    function showMole() {
        if (chances > 0) {
            const randomIndex = Math.floor(Math.random() * holes.length);
            const randomHole = holes[randomIndex];
            const mole = randomHole.querySelector('.mole');
            mole.classList.remove('whacked');
            mole.style.bottom = '0px';
            moleTimeout = setTimeout(() => {
                if (!mole.classList.contains('whacked')) {
                    mole.style.bottom = '-150px'; // Hide the mole after a delay
                    chances--;
                    chancesValue.textContent = '❤️'.repeat(chances); // Update chances display
                    if (chances === 0) {
                        lostSound.play();
                        setTimeout(() => {
                            alert('You lost! Try again to win and proceed.');
                            resetGame();
                        }, 500);
                    } else {
                        showMole(); // Show a new mole even if a chance is lost
                    }
                }
            }, 1000);
        }
    }

    holes.forEach(hole => {
        const mole = hole.querySelector('.mole');
        hole.addEventListener('click', () => {
            if (!mole.classList.contains('whacked') && mole.style.bottom === '0px') {
                whackSound.play();
                mole.classList.add('whacked');
                score++;
                scoreValue.textContent = score;
                mole.style.bottom = '-150px'; // Hide the mole after being hit
                if (score === 10) {
                    winGif.style.display = 'flex'; // Show the win GIF
                    setTimeout(() => {
                        window.location.href = '../../../letters/v1.html'; // Redirect to next page after whacking 10 moles
                    }, 3000);
                } else {
                    clearTimeout(moleTimeout);
                    showMole(); // Show a new mole immediately
                }
            }
        });
    });

    function resetGame() {
        score = 0;
        scoreValue.textContent = score;
        chances = 3;
        chancesValue.textContent = '❤️❤️❤️';
        winGif.style.display = 'none';
        holes.forEach(hole => {
            const mole = hole.querySelector('.mole');
            mole.classList.remove('whacked');
            mole.style.bottom = '-150px'; // Reset the mole position
        });
        clearTimeout(moleTimeout);
        showMole(); // Show a new mole immediately
    }

    showMole();
});
