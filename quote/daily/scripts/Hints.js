class Hints {
    selectors = {
        hintsQuoteBtn: "[data-js-hints-quote-open-btn]",
        hintsQuoteTooltip: "[data-js-hints-quote-tooltip]",
        hintsQuoteBox: "[data-js-hints-quote-box]",
        hintsQuote: "[data-js-quote]",
        hintsQuoteAudioBtn: "[data-js-quote-audio-btn]",
        hintsQuoteAudioBtnImg: "[data-js-quote-audio-btn-img]",
        hintsQuoteAudioMixer: "[data-js-quote-audio-mixer]",
        hintsBox: "[data-js-hints-box]",
        hintsBtns: "[data-js-hints-open-btn]",
    }

    stateClasses = {
        isHided: 'is-hidden',
        isDisabled: 'is-disabled'
    }

    constructor() {
        this.hintsQuoteBtnElement = document.querySelector(this.selectors.hintsQuoteBtn);
        this.hintsQuoteTooltipElement = document.querySelector(this.selectors.hintsQuoteTooltip);
        this.hintsQuoteBoxElement = document.querySelector(this.selectors.hintsQuoteBox);
        this.hintsQuoteElement = document.querySelector(this.selectors.hintsQuote);
        this.hintsQuoteAudioBtn = document.querySelector(this.selectors.hintsQuoteAudioBtn);
        this.hintsQuoteAudioBtnImgElement = document.querySelector(this.selectors.hintsQuoteAudioBtnImg);
        this.hintsQuoteAudioMixerElement = document.querySelector(this.selectors.hintsQuoteAudioMixer);

        this.hintsBoxesArray = document.querySelectorAll(this.selectors.hintsBox)
        this.hintsBtnsArray = document.querySelectorAll(this.selectors.hintsBtns)

        this.countOfAttempts = (JSON.parse(localStorage.getItem('classicDailyGuessedChamps')) || []).length;
        this.quoteNeedAttempts = 6;

        this.bindEvents()
    }

    hideAllHints = () => {
        this.hintsBoxesArray.forEach(box => box.classList.add(this.stateClasses.isHided))
    }

    showAllHints = () => {
        this.hintsBtnsArray.forEach(btn => btn.classList.remove(this.stateClasses.isDisabled))
        this.updateHintsState(true)
    }

    showHint = (hint, btn, needAttempts) => {
        if (this.countOfAttempts < needAttempts) return
        else {
            if (!(hint.classList.contains(this.stateClasses.isHided))) {
                hint.classList.add(this.stateClasses.isHided)
            }
            else {
                this.hideAllHints()
                hint.classList.remove(this.stateClasses.isHided)
            }
        }
    }

    attemptsTooltipGenerate = (countOfAttempts, needAttempts, tooltip, hint) => {
        this.result = needAttempts - countOfAttempts;
        if (countOfAttempts >= needAttempts) {
            hint.classList.remove(this.stateClasses.isDisabled);
            tooltip.innerHTML = "";
        }
        else {
            if (this.result >= 5) {
                tooltip.innerHTML = `${this.result} попыток`;
            }
            if (this.result < 5) {
                tooltip.innerHTML = `${this.result} попытки`;
            }
            if (this.result == 1) {
                tooltip.innerHTML = `${this.result} попытка`;
            }
        }
    }

    updateHintsState = (isGuessed = false) => {
        if (isGuessed) {
            this.countOfAttempts = 18;
        }
        else {
            this.countOfAttempts = (JSON.parse(localStorage.getItem('classicDailyGuessedChamps')) || []).length;
        }
        this.attemptsTooltipGenerate(this.countOfAttempts, this.quoteNeedAttempts, this.hintsQuoteTooltipElement, this.hintsQuoteBtnElement);
    }
    setLocalStorageHints = (hint, func) => {
        localStorage.setItem(hint, func)
    }

    // Установка подсказки цитаты
    setQuoteHint = (targetChampQuoteID) => {
        //this.quoteAudioRu = this.targetChampionQuoteData[this.classicQuoteID].audioRU;
        const quoteTextRu = targetChampQuoteID;
        this.hintsQuoteElement.innerHTML = `" ${quoteTextRu} "`
    }

    bindEvents() {
        this.hintsQuoteBtnElement.addEventListener('click', () => this.showHint(this.hintsQuoteBoxElement, this.hintsQuoteBtnElement, this.quoteNeedAttempts))

        this.hideAllHints()

        this.updateHintsState()
    }
}

export default Hints;