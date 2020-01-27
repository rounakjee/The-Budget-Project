/*

* GAME RULES:
*   - The game has 2 players, playing in rounds
*   - In each turn, a player rolls a dice as many times as he whishes. Each result get added to his ROUND score
*   - BUT, if the player rolls a 1, all his ROUND score gets lost. After that, it's the next player's turn
*   - The player can choose to 'Hold', which means that his ROUND score gets added to his GLBAL score. After that, it's the next player's turn
*   - The first player to reach 100 points on GLOBAL score wins the game

*/

var scores, roundScore, activePlayer, gobalScore , gamePlaying;

init();


// *this funtion is called when for the first time game is opened..

function init(){

    scores = [0,0];
    roundScore = 0;
    activePlayer = 0;
    gamePlaying = true;

    document.querySelector('.dice').style.display = 'none';
    document.getElementById('score-0').textContent = 0;
    document.getElementById('score-1').textContent = 0;
    document.getElementById('current-0').textContent = 0;
    document.getElementById('current-1').textContent = 0;
};

// *this function is called when a player wants a new game..

document.querySelector('.btn-new').addEventListener('click', function(){
    init();
    
    document.querySelector('.player-0-panel').classList.add('active');
    document.querySelector('.player-1-panel').classList.remove('active');

    document.getElementById('name-0').textContent = 'Player 1';
    document.getElementById('name-1').textContent = 'Player 2';

});

// *this function is called when a player rolls the dice..

document.querySelector('.btn-roll').addEventListener('click', function(){
    if(gamePlaying){

        var dice = Math.floor(Math.random() * 6) + 1;
        var diceDOM = document.querySelector('.dice');
        diceDOM.style.display = 'block';
        diceDOM.src = 'dice-' + dice + '.png';
    
        if (dice === 1){
    
            document.querySelector('#current-' + activePlayer).textContent = 0;
            activePlayer === 0 ? activePlayer = 1 : activePlayer = 0;
            roundScore = 0;
    
            document.querySelector('.player-0-panel').classList.toggle('active');
            document.querySelector('.player-1-panel').classList.toggle('active');
            document.querySelector('.dice').style.display = 'none';
            
        }
        else{
    
            roundScore += dice;
            document.querySelector('#current-' + activePlayer).textContent = roundScore;
    
        } 
    }
    
    
});

// *this function is called when the active player wants to hold the dice throwing and update t e round score to the global score.

document.querySelector('.btn-hold').addEventListener('click', function(){
    if(gamePlaying){

        scores[activePlayer] += roundScore;
        document.querySelector('#score-' + activePlayer).textContent = scores[activePlayer];
        document.querySelector('#current-' + activePlayer).textContent = 0;
        if(scores[activePlayer]>= 100){
            document.querySelector('#name-' + activePlayer).innerHTML = '<b> Winner!! </b>'
            gamePlaying = false;
    
        }
        document.querySelector('.dice').style.display = 'none';
        document.querySelector('.player-0-panel').classList.toggle('active');
        document.querySelector('.player-1-panel').classList.toggle('active');
        activePlayer === 0 ? activePlayer = 1 : activePlayer = 0;
        roundScore = 0;
    }
});

