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

    checkDate = () => {
        const today = new Date().toISOString().split('T')[0];
        const savedDate = localStorage.getItem('classicDailyDate');

        if (today !== savedDate) {
            localStorage.setItem('classicDailyDate', today);
            localStorage.setItem('classicDailyGuessedChamps', JSON.stringify([]));
            localStorage.setItem('ifClassicDailyGuessed', false);
        }
    }


    bindEvents() {
        this.checkDate();
        this.checkModesBtns()
    }
}

export default LocalStorage;
