import Loader from './Loader.js';
import Header from './Header.js';
import Guess from './Guess.js';
import Timer from './Timer.js';

document.addEventListener("DOMContentLoaded", async () => {
    await new Loader("../../").bindEvents();
    await new Guess().bindEvents();
    new Header();
    new Timer();
})

