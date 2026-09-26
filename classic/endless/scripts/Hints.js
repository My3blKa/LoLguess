class Hints {
    selectors = {
        hintsQuoteBtn: "[data-js-hints-quote-open-btn]",
        hintsSpellBtn: "[data-js-hints-spell-open-btn]",
        hintsSplashBtn: "[data-js-hints-splash-open-btn]",
        hintsQuoteTooltip: "[data-js-hints-quote-tooltip]",
        hintsSpellTooltip: "[data-js-hints-spell-tooltip]",
        hintsSplashTooltip: "[data-js-hints-splash-tooltip]",
        hintsQuoteBox: "[data-js-hints-quote-box]",
        hintsSpellBox: "[data-js-hints-spell-box]",
        hintsSplashBox: "[data-js-hints-splash-box]",
        hintsQuote: "[data-js-quote]",
        hintsQuoteAudioBtn: "[data-js-quote-audio-btn]",
        hintsQuoteAudioBtnImg: "[data-js-quote-audio-btn-img]",
        hintsQuoteAudioMixer: "[data-js-quote-audio-mixer]",
        hintsSpellName: "[data-js-spell-name]",
        hintsSpellImg: "[data-js-spell-img]",
        hintsSplashImg: "[data-js-splash-img]",
        hintsBox: "[data-js-hints-box]",
        hintsBtns: "[data-js-hints-open-btn]",
    }

    stateClasses = {
        isHided: 'is-hidden',
        isDisabled: 'is-disabled'
    }

    constructor() {
        this.hintsQuoteBtnElement = document.querySelector(this.selectors.hintsQuoteBtn);
        this.hintsSpellBtnElement = document.querySelector(this.selectors.hintsSpellBtn);
        this.hintsSplashBtnElement = document.querySelector(this.selectors.hintsSplashBtn);
        this.hintsQuoteTooltipElement = document.querySelector(this.selectors.hintsQuoteTooltip);
        this.hintsSpellTooltipElement = document.querySelector(this.selectors.hintsSpellTooltip);
        this.hintsSplashTooltipElement = document.querySelector(this.selectors.hintsSplashTooltip);
        this.hintsQuoteBoxElement = document.querySelector(this.selectors.hintsQuoteBox);
        this.hintsSpellBoxElement = document.querySelector(this.selectors.hintsSpellBox);
        this.hintsSplashBoxElement = document.querySelector(this.selectors.hintsSplashBox);
        this.hintsQuoteElement = document.querySelector(this.selectors.hintsQuote);
        this.hintsQuoteAudioBtn = document.querySelector(this.selectors.hintsQuoteAudioBtn);
        this.hintsQuoteAudioBtnImgElement = document.querySelector(this.selectors.hintsQuoteAudioBtnImg);
        this.hintsQuoteAudioMixerElement = document.querySelector(this.selectors.hintsQuoteAudioMixer);
        this.hintsSpellNameElement = document.querySelector(this.selectors.hintsSpellName);
        this.hintsSpellImgElement = document.querySelector(this.selectors.hintsSpellImg);
        this.hintsSplashImgElement = document.querySelector(this.selectors.hintsSplashImg);

        this.hintsBoxesArray = document.querySelectorAll(this.selectors.hintsBox)
        this.hintsBtnsArray = document.querySelectorAll(this.selectors.hintsBtns)

        this.countOfAttempts = (JSON.parse(localStorage.getItem('classicEndlessGuessedChamps')) || []).length;
        this.quoteNeedAttempts = 6;
        this.spellNeedAttempts = this.quoteNeedAttempts * 2;
        this.splashNeedAttempts = this.quoteNeedAttempts * 3;

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
            this.countOfAttempts = (JSON.parse(localStorage.getItem('classicEndlessGuessedChamps')) || []).length;
        }
        this.attemptsTooltipGenerate(this.countOfAttempts, this.quoteNeedAttempts, this.hintsQuoteTooltipElement, this.hintsQuoteBtnElement);
        this.attemptsTooltipGenerate(this.countOfAttempts, this.spellNeedAttempts, this.hintsSpellTooltipElement, this.hintsSpellBtnElement);
        this.attemptsTooltipGenerate(this.countOfAttempts, this.splashNeedAttempts, this.hintsSplashTooltipElement, this.hintsSplashBtnElement);
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
    // Установка подсказки спелла
    setSpellHint = (targetChampSpellID, latestVersion) => {
        const spellImgSrc = targetChampSpellID
        this.hintsSpellBoxElement.innerHTML = `<img src="https://ddragon.leagueoflegends.com/cdn/${latestVersion}/img/spell/${spellImgSrc}.png" alt="spell-img" class="hints__spell-img" loading="lazy" data-js-spell-img>`
    }
    // Установка подсказки сплэша (через canvas)
    setSplashHint = (targetChampSplashID) => {
        const splashImgSrc = `https://ddragon.leagueoflegends.com/cdn/img/champion/splash/${targetChampSplashID}.jpg`;
        const splashImg = new Image()
        splashImg.crossOrigin = 'anonymous';
        splashImg.src = splashImgSrc;
        let splashCnvs = document.createElement('canvas');
        splashImg.onload = () => {
            splashCnvs.width = splashImg.width
            splashCnvs.height = splashImg.height
            this.hintsSplashBoxElement.appendChild(splashCnvs)
            splashCnvs.getContext("2d").drawImage(splashImg, 0, 0)
        }
    }
    // Устанавливаем все подсказки одной функцией (уменьшение кода в bindEvents)
    setHints = (targetChampQuoteID, targetChampSpellID, targetChampSplashID, latestVersion) => {
        this.setQuoteHint(targetChampQuoteID)
        this.setSpellHint(targetChampSpellID, latestVersion)
        this.setSplashHint(targetChampSplashID)
    }



    bindEvents() {
        this.hintsQuoteBtnElement.addEventListener('click', () => this.showHint(this.hintsQuoteBoxElement, this.hintsQuoteBtnElement, this.quoteNeedAttempts))
        this.hintsSpellBtnElement.addEventListener('click', () => this.showHint(this.hintsSpellBoxElement, this.hintsSpellBtnElement, this.spellNeedAttempts))
        this.hintsSplashBtnElement.addEventListener('click', () => this.showHint(this.hintsSplashBoxElement, this.hintsSplashBtnElement, this.splashNeedAttempts))

        this.hideAllHints()

        this.updateHintsState()
    }
}

export default Hints;