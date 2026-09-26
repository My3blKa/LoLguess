import Loader from './Loader.js';
import Header from './Header.js';


document.addEventListener("DOMContentLoaded", async () => {
    await new Loader().bindEvents();
    new Header();
})

