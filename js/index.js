const documentTitle = document.title
const modalContainer = document.getElementById('modal-container')
const view = document.getElementById('view')
const elements = document.getElementsByClassName('elements')[0]

// Save each pick element and score
const paper = document.getElementById('paper')
const scissors = document.getElementById('scissors')
const rock = document.getElementById('rock')
const score = document.getElementById('score')
const openModal = document.getElementById('open-modal')

// Detect score changes for saving it in localStorage
const observer = new MutationObserver((mutations) => {
	const innerText = mutations[0].target.innerText
	if (innerText) {
		localStorage.setItem('rock-paper-scissors-frontendmentor-app-score', innerText)

		handleTitle(innerText)
	}
})

observer.observe(score, {
	attributes: true,
	childList: true,
	characterData: true,
})

getScoreFromLocal()

document.addEventListener('click', (e) => {
	if (e.target === openModal) {
		const modal = `
      <div class="modal">
        <div class="modal-content">
          <section class="modal-first">
            <h2 class="title">Rules</h2>
            <button class="modal-close" onclick="closeModal()">
              <img src="./images/icon-close.svg" alt="X" />
            </button>
          </section>
          <section class="modal-last">
            <img src="./images/rules.png" alt="Rules schema" draggable="false" />
          </section>
        </div>
      </div>`

		modalContainer.innerHTML = modal
	}

	const localPick = e.target.getAttribute('data-pick')

	// If the element clicked is one pick
	if (localPick) {
		// Get opponent pick and game result
		const { opponentPick, gameResult } = game(localPick)

		if (gameResult === 'win') {
			score.innerHTML = Number(score.innerHTML) + 1
		}

		if (gameResult === 'loss') {
			score.innerHTML = score.innerHTML > 0 ? Number(score.innerHTML) - 1 : 0
		}

		hideHome()
		view.innerHTML = resultView({
			gameResult,
			localPick,
			opponentPick,
		})
	}
})

// Results layout view
function resultView({ gameResult, localPick, opponentPick }) {
	return `<div class="results">
    <div class="results-item">
      <div class="results-item-element ${gameResult === 'win' ? 'winner' : ''}">
        <div class="elements-item ${localPick}">
          <picture class="elements-item-pic">
            <img
              class="elements-item-img"
              src="./images/icon-${localPick}.svg"
              alt=${localPick}
              draggable="false"
            />
          </picture>
        </div>
      </div>
      <h4 class="results-item-name">You Picked</h4>
    </div>

    <div class="results-item">
      <div class="results-item-element ${gameResult === 'loss' ? 'winner' : ''}">
        <div class="elements-item ${opponentPick}">
        <picture class="elements-item-pic">
          <img
            class="elements-item-img"
            src="./images/icon-${opponentPick}.svg"
            alt=${opponentPick}
            draggable="false"
          />
        </picture>
        </div>
      </div>
      <h4 class="results-item-name">The House Picked</h4>
    </div>



    <div class="results-item-result">
      <h2 class="results-item-result-name">${
				gameResult === 'loss' ? 'You loss' : gameResult === 'win' ? 'You win' : 'Tie'
			}</h2>
      <button class="button" onclick="playAgain()">Play again</button>
    </div>
  </div>`
}

// Get opponent pick from user pick
function game(localPick) {
	if (!localPick) {
		console.error('Please pick one item')
		return
	}

	const picks = ['paper', 'scissors', 'rock']

	let opponentPick = picks[Math.floor(Math.random() * picks.length)]

	let gameResult

	if (opponentPick === localPick) {
		gameResult = 'tie'
		return { opponentPick, gameResult }
	}

	if (localPick == 'paper') {
		if (opponentPick === 'rock') {
			gameResult = 'win'
		}

		if (opponentPick === 'scissors') {
			gameResult = 'loss'
		}
	}

	if (localPick == 'scissors') {
		if (opponentPick === 'paper') {
			gameResult = 'win'
		}
		if (opponentPick === 'rock') {
			gameResult = 'loss'
		}
	}

	if (localPick == 'rock') {
		if (opponentPick === 'scissors') {
			gameResult = 'win'
		}
		if (opponentPick === 'paper') {
			gameResult = 'loss'
		}
	}
	return { opponentPick, gameResult }
}

// Reset the view to play again
function playAgain() {
	showHome()
}

function showHome() {
	elements.classList.remove('hidden')
	view.innerHTML = ''
}

function hideHome() {
	elements.classList.add('hidden')
}

// Get and set the score if it exists in localStorage
function getScoreFromLocal() {
	localScore = JSON.parse(localStorage.getItem('rock-paper-scissors-frontendmentor-app-score'))
	if (localScore) {
		score.innerText = localScore
	}
}

// Change the title based on the score
function handleTitle(scoreValue) {
	let timeout
	const generateTimeout = (fn, time) => {
		timeout = setTimeout(fn, time)
	}

	const removeTimeout = () => {
		clearTimeout(timeout)
	}

	const titleScoreOnly = `Score: ${scoreValue}`
	const titleScorePlusOriginal = `${titleScoreOnly} - ${documentTitle}`

	document.title = titleScoreOnly

	generateTimeout(() => {
		document.title = titleScorePlusOriginal
	}, 2000)

	generateTimeout(() => {
		document.title = titleScoreOnly
	}, 4000)

	generateTimeout(() => {
		document.title = titleScorePlusOriginal
	}, 6000)
	generateTimeout()
	removeTimeout()
}

function closeModal() {
	modalContainer.innerHTML = ''
}
