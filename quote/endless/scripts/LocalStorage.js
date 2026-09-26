class LocalStorage {
    selectors = {
        classicBtn: "[data-js-modes-classic]",
        quoteBtn: "[data-js-modes-quote]",
        spellBtn: "[data-js-modes-spell]",
        splashBtn: "[data-js-modes-splash]",
    }
    stateClasses = {
        notGuessed: 'not-guessed'
    }

    constructor() {
        this.classicBtnElement = document.querySelectorAll(this.selectors.classicBtn)
        this.quoteBtnElement = document.querySelectorAll(this.selectors.quoteBtn)
        this.spellBtnElement = document.querySelectorAll(this.selectors.spellBtn)
        this.splashBtnElement = document.querySelectorAll(this.selectors.splashBtn)



        this.bindEvents()
    }

    checkModesBtns = () => {
        if (localStorage.getItem('ifClassicDailyGuessed') === 'true') {
            this.classicBtnElement.forEach(btn => {
                btn.classList.remove(this.stateClasses.notGuessed)
            })
        }
    }

    checkRoundStartTime = () => {
        const now = Date.now();
        const roundStartTime = JSON.parse(localStorage.getItem('classicEndlessRoundStartedTime'))
        this.needResetTime = 1000 * 60 * 45

        if (now - roundStartTime > this.needResetTime) {
            this.resetRound(now)
        }
    }

    resetRound = (time) => {
        localStorage.setItem('classicEndlessRoundStartedTime', time);
        localStorage.setItem('classicEndlessGuessedChamps', JSON.stringify([]));
        localStorage.setItem('ifClassicEndlessGuessed', false);
        localStorage.setItem('classicEndlessChampion', '')
    }


    bindEvents() {
        this.checkRoundStartTime();
        this.checkModesBtns()
    }
}

export default LocalStorage;
