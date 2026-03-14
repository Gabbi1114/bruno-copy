import './threejs-override.js'
import { Game } from './Game/Game.js'
import consoleLog from './data/consoleLog.js'

if(import.meta.env.VITE_LOG)
    console.log(
        ...consoleLog
    )

// WebGL/WebGPU requires a user gesture on mobile (Safari, etc.) before starting.
// Without this, browsers block the context and show "WebGL context was not allowed to start".
const startGame = () => {
    if(import.meta.env.VITE_GAME_PUBLIC)
        window.game = new Game()
    else
        new Game()
}

const gate = document.getElementById('js-user-gesture-gate')
if(gate) {
    const handler = () => {
        gate.remove()
        startGame()
    }
    gate.addEventListener('click', handler, { once: true })
    gate.addEventListener('touchstart', handler, { once: true, passive: true })
} else {
    startGame()
}