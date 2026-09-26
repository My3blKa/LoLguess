import LocalStorage from "./LocalStorage.js";
import Hints from './Hints.js'

class Guess {
    selectors = {
        guessInput: "[data-js-guess-input]",
        guessDropdown: "[data-js-guess-droplist]",
        guessDropdownItem: "[data-js-guess-dropitem]",
        answersTbodyItem: "[data-js-answers-tbody]",
        answersTheadItem: "[data-js-answers-thead]",
        finishRoot: "[data-js-finish-root]",
        finishChampItem: "[data-js-finish-champ]",
        finishChampNameItem: "[data-js-finish-champ-name]",
        finishAttemptsItem: "[data-js-finish-attempts]",
        guessSurrenderBtn: "[data-js-guess-surrender-btn]",
        finishNextTryBtn: "[data-js-finish-next-try-btn]"
    }
    stateClasses = {
        isFocused: "is-focused",
        isHided: "is-hidden"
    }
    constructor() {
        this.guessInputElement = document.querySelector(this.selectors.guessInput);
        this.guessDropdownElement = document.querySelector(this.selectors.guessDropdown);
        this.answersTbodyElement = document.querySelector(this.selectors.answersTbodyItem);
        this.answersTheadElement = document.querySelector(this.selectors.answersTheadItem);
        this.finishRootElement = document.querySelector(this.selectors.finishRoot);
        this.finishChampElement = document.querySelector(this.selectors.finishChampItem);
        this.finishChampNameElement = document.querySelector(this.selectors.finishChampNameItem);
        this.finishAttemptsElement = document.querySelector(this.selectors.finishAttemptsItem);
        this.guessSurrenderBtnElement = document.querySelector(this.selectors.guessSurrenderBtn);
        this.finishNextTryBtnElement = document.querySelector(this.selectors.finishNextTryBtn);

        this.storage = new LocalStorage();
        this.hints = new Hints();

        // Основные переменные для всей страницы (индекс для перемещение фокусированного героя стрелками и подгрузка сохраненных ответов за сегодня чемпионов)
        this.savedAnswers = JSON.parse(localStorage.getItem('classicEndlessGuessedChamps')) || [];
        this.Index = -1;
        // Упрощение проверки полей для каждого чемпиона (путем назначения полей в массиве)
        this.championFieldsCheck = [
            { key: 'gender', type: 'str', result: '', value: '' },
            { key: 'positions', type: 'array', result: '', value: '' },
            { key: 'species', type: 'array', result: '', value: '' },
            { key: 'resource', type: 'str', result: '', value: '' },
            { key: 'range_type', type: 'array', result: '', value: '' },
            { key: 'regions', type: 'array', result: '', value: '' },
            { key: 'release_date', type: 'year', result: '', value: '' }
        ]
    }
    // Функция получения необходимых данных с DDragon и json файлов проекта
    async getChampionsData() {
        this.versions = await fetch('https://ddragon.leagueoflegends.com/api/versions.json');
        this.versionData = await this.versions.json();
        this.latestVersion = this.versionData[0];

        this.champions = await fetch('../../../data/champions_ru.json')
        this.championsData = await this.champions.json();
        this.championsNamesArray = this.championsData.map(champ => ({ name: champ.championName, searchName: champ.championName, id: champ.championId })).sort((a, b) => a.name.localeCompare(b.name, 'ru'));
        this.championsNamesArray.map(champ => {
            if (champ.searchName.includes(`'`)) champ.searchName = champ.searchName.replace(`'`, '');

        })
        this.championsNamesArray = this.championsNamesArray.filter(champ => {
            const isSaved = this.savedAnswers.includes(champ.id)

            return !isSaved;
        })

        console.log(this.championsNamesArray)



        this.targetChampion = this.getTargetChampion(this.championsData)
        this.championSelected = 0;

        console.log(localStorage.getItem('classicEndlessChampion'))
        console.log(this.targetChampion)

        this.targetChampionData = await fetch(`https://ddragon.leagueoflegends.com/cdn/${this.latestVersion}/data/ru_RU/champion/${this.targetChampion.championId}.json`).then(r => r.json())
        this.targetChampionSpellData = this.targetChampionData.data[this.targetChampion.championId].spells.map(spell => ({ id: spell.id, name: spell.name }))
        this.targetChampionSplashData = this.targetChampionData.data[this.targetChampion.championId].skins.map(skin => ({ id: skin.num, name: skin.name })).filter(skin => !skin.name.includes(' – '))

        this.targetChampionsQuoteData = await fetch('../../../data/quotes.json').then(r => r.json());
        this.targetChampionQuoteData = this.targetChampionsQuoteData[this.targetChampion.championId].quotes.map(quote => ({ audioRU: quote.audio_ru, textRU: quote.text_ru }))

        this.hints.setLocalStorageHints('classicEndlessQuoteID', this.getRandomNumber(0, this.targetChampionQuoteData.length))
        this.hints.setLocalStorageHints('classicEndlessSpellID', this.getRandomNumber(0, this.targetChampionSpellData.length))
        this.hints.setLocalStorageHints('classicEndlessSplashID', this.getRandomNumber(0, this.targetChampionSplashData.length))

        this.classicQuoteID = JSON.parse(localStorage.getItem('classicEndlessQuoteID'))
        this.classicSpellID = JSON.parse(localStorage.getItem('classicEndlessSpellID'))
        this.classicSplashID = JSON.parse(localStorage.getItem('classicEndlessSplashID'))

        console.log(this.targetChampionQuoteData)

        console.log(this.championsData)
        console.log(this.targetChampion)
    }
    // Ну угадай йопта
    getRandomNumber = (min, max) => {
        return Math.floor(Math.random() * (max - min) + min);
    }
    // Функция для отслеживания начала ввода чемпиона в input, показывает и сортирует дропдаун
    inputLetter = () => {
        this.value = this.guessInputElement.value;

        this.championsNamesArrayFiltered = this.championsNamesArray.filter(champ => champ.searchName.toLowerCase().startsWith(this.value.toLowerCase()));

        this.guessDropdownElement.innerHTML = this.championsNamesArrayFiltered.map(champ => `<li class="guess__dropdown-item" role="option" aria-selected="false" data-champion-id=${champ.id} data-js-guess-dropitem>
                            <img src="https://ddragon.leagueoflegends.com/cdn/${this.latestVersion}/img/champion/${champ.id}.png"
                                alt="champion icon" class="guess__dropdown-item-img" width="64" height="64">
                            ${champ.name}
                        </li>`).join("");
        if (this.championsNamesArrayFiltered.length === 0) {
            this.guessDropdownElement.innerHTML = `<li class="guess__dropdown-item-not-found">
                            Чемпионы не найдены
                        </li>`;
        }
        else if (this.value === '') {
            this.guessDropdownElement.innerHTML = '';
        }
        else {
            this.guessDropdownListElement = document.querySelectorAll(this.selectors.guessDropdownItem);
            this.guessDropdownListElement[0].classList.add(this.stateClasses.isFocused);
        }

        this.guessDropdownElement.classList.remove(this.stateClasses.isHided);

        this.Index = 0;
    }
    // Проверка на нажатие вне дропдауна для дальнейшего закрытия
    clickOutOfGuess = (evt) => {
        if ((evt.target != this.guessInputElement)) {
            this.guessDropdownElement.classList.add(this.stateClasses.isHided);
        }
        else {
            this.guessDropdownElement.classList.remove(this.stateClasses.isHided);
            this.Index = 0;
        }
    }
    // Функция выбора чемпиона из дропдауна при помощи стрелочек на клавиатуре
    navigationDirection = (direction) => {
        for (let i = 0; i < this.guessDropdownListElement.length; i++) {
            this.guessDropdownListElement[i].classList.remove(this.stateClasses.isFocused)
        }
        this.Index += direction
        if (this.Index === -1) {
            this.Index = this.guessDropdownListElement.length - 1
        }
        if (this.Index === this.guessDropdownListElement.length) {
            this.Index = 0
        }
        this.guessDropdownListElement[this.Index].classList.add(this.stateClasses.isFocused);
        this.guessDropdownListElement[this.Index].scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    }
    // Обертка повторяющихся строк кода для selectChampKeydown и selectChampClick
    selectChamp = (champID) => {
        if (JSON.parse(localStorage.getItem("ifClassicEndlessGuessed"))) return
        this.saveLocalStorage(champID);
        this.checkGuess(champID);
        this.championsNamesArray = this.championsNamesArray.filter(champ => { return champ.id != champID })
        this.guessInputElement.value = '';
        this.inputLetter();
        this.hints.updateHintsState();
    }
    // Выбор чемпиона при нажатии клавиши (в данном случае Enter)
    selectChampKeydown = () => {
        this.guessDropdownListElement = document.querySelectorAll(this.selectors.guessDropdownItem);
        for (let i = 0; i < this.guessDropdownListElement.length; i++) {
            if (this.guessDropdownListElement[i].classList.contains(this.stateClasses.isFocused)) {
                this.selectChamp(this.guessDropdownListElement[i].dataset.championId);
                this.guessDropdownElement.classList.add(this.stateClasses.isHided);
            }
        }
    }
    // Выбор чемпиона при клике на итем чемпиона из дропдауна
    selectChampClick = (champ) => {
        this.guessDropdownListElement = document.querySelectorAll(this.selectors.guessDropdownItem);
        this.selectChamp(champ.dataset.championId);
    }
    // Основная логика проверки правильного ответа и его частичная отрисовка в HTML
    checkGuess = (champId, isSaved = false) => {
        this.championSelected = this.championsData.find(c => c.championId === champId);
        const results = this.championFieldsCheck.map(field => {
            const selectedValue = this.championSelected[field.key];
            const targetValue = this.targetChampion[field.key];

            if (field.type === 'str') {
                return selectedValue === targetValue ? { result: 'correct', value: selectedValue } : { result: 'wrong', value: selectedValue };
            }
            if (field.type === 'array') {
                const hasAll = selectedValue.every(value => targetValue.includes(value)) && selectedValue.length === targetValue.length;
                const hasSome = selectedValue.some(value => targetValue.includes(value));

                if (hasAll) return { result: 'correct', value: selectedValue };
                else if (hasSome) return { result: 'partial', value: selectedValue };
                else return { result: 'wrong', value: selectedValue };
            }
            if (field.type === 'year') {
                const selectedYear = new Date(selectedValue).getFullYear();
                const targetYear = new Date(targetValue).getFullYear();

                if (selectedYear < targetYear) return { result: 'wrong', value: selectedYear + '↑' };
                else if (selectedYear > targetYear) return { result: 'wrong', value: selectedYear + '↓' };
                else return { result: 'correct', value: selectedYear };
            }
        })
        let tr = document.createElement('tr');
        const iconTd = `<td class="answers__tbody-td">
                                <img src="https://ddragon.leagueoflegends.com/cdn/${this.latestVersion}/img/champion/${this.championSelected.championId}.png" alt=""
                                    class="answers__tbody-td-img" width="64" height="64">
                            </td>`
        tr.classList.add('answers__tbody-tr');
        tr.innerHTML = iconTd;
        this.answersTbodyElement.insertAdjacentElement('afterbegin', tr);
        if (JSON.parse(localStorage.getItem('classicEndlessGuessedChamps')).length >= 10) {
            this.guessSurrenderBtnElement.classList.remove(this.stateClasses.isHided)
        }
        if (isSaved) {
            results.forEach((td, index) => {
                tr.insertAdjacentHTML('beforeend', `<td class="answers__tbody-td answers__tbody-td-${td.result} no-animation">${td.value}</td>`);
            });
        }
        else {
            results.forEach((td, index) => {
                setTimeout(() => {
                    tr.insertAdjacentHTML('beforeend', `<td class="answers__tbody-td answers__tbody-td-${td.result}">${td.value}</td>`);
                }, index * 700);
            });
            this.renderWinWindow((this.championSelected === this.targetChampion))
        }

        this.answersTheadElement.classList.remove(this.stateClasses.isHided)
    }
    surrenderBtnClick = () => {
        this.storage.resetRound(Date.now());
        location.reload()
    }
    nextTryBtnClick = () => {
        this.storage.resetRound(Date.now());
        location.reload()
    }
    // Сохраняем ответ игрока в LocalStorage
    saveLocalStorage = (champId) => {
        this.savedAnswers.push(champId);
        localStorage.setItem('classicEndlessGuessedChamps', JSON.stringify(this.savedAnswers))
    }
    // Получаем сохраненные в LocalStorage ответы игрока
    getSavedChampsId = () => {
        return JSON.parse(localStorage.getItem('classicEndlessGuessedChamps'));
    }
    // Рендерим сохраненных ранее в LocalStorage чемпионов (если они есть)
    renderSavedChamps = (ids) => {
        for (let i = 0; i < ids.length; i++) {
            this.checkGuess(ids[i], true);
        }
        this.renderWinWindow(JSON.parse(localStorage.getItem("ifClassicEndlessGuessed")), true)
    }
    // Рендерим окно победы (если выиграли прямо сейчас, то оно выйдет через 0.7 * 7, если режим уже выигран, то окно выйдет за миллисекунду)
    renderWinWindow = (isWin, isFast = false) => {
        if (isWin) {
            localStorage.setItem('ifClassicEndlessGuessed', true);
            this.finishChampNameElement.innerHTML = this.targetChampion.championName
            this.finishChampElement.insertAdjacentHTML('afterbegin', `<img src="https://ddragon.leagueoflegends.com/cdn/${this.latestVersion}/img/champion/${this.targetChampion.championId}.png"
                            alt="Guessed champion" class="finish__champ-img"></img>`)
            this.guessSurrenderBtnElement.classList.add(this.stateClasses.isHided)
            if (isFast) {
                setTimeout(() => {
                    this.showFinishScreen()
                    console.log("Быстрая отрисовка окна победы")
                }, 10)
            }
            else {
                setTimeout(() => {
                    this.showFinishScreen()
                    console.log("Долгая отрисовка окна победы")
                }, 7 * 700)
            }

        }
    }
    // Содержит в себе именно данные, которые зависят от конретного чемпиона. Данная функция нужна для сокращения количества кода в функции renderWinWindow
    showFinishScreen = () => {
        this.finishAttemptsElement.innerHTML = 'Количество попыток: ' + this.savedAnswers.length
        this.guessInputElement.classList.add(this.stateClasses.isHided)
        this.guessDropdownElement.classList.add(this.stateClasses.isHided)
        this.storage.checkModesBtns();
        this.finishRootElement.classList.remove(this.stateClasses.isHided)
        this.hints.showAllHints()
        this.finishRootElement.scrollIntoView({ behavior: 'smooth' })
    }
    // Устанавливаем ID героя для текущего раунда
    getTargetChampion = (champArray) => {
        if (!localStorage.getItem('classicEndlessChampion')) {
            const winnerIndex = this.getRandomNumber(0, champArray.length)

            localStorage.setItem('classicEndlessChampion', champArray[winnerIndex].championId)

            return champArray[winnerIndex]
        }
        else {
            return champArray.find(c => c.championId === localStorage.getItem('classicEndlessChampion'))
        }
    }
    // Запуск необходимых функций с самого старта загрузки страницы
    async bindEvents() {
        await this.getChampionsData();
        this.guessInputElement.addEventListener('input', () => this.inputLetter())
        document.addEventListener('click', (e) => this.clickOutOfGuess(e))
        this.guessInputElement.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowDown') this.navigationDirection(1);
            if (e.key === 'ArrowUp') this.navigationDirection(-1);
            if (e.key === 'Enter') this.selectChampKeydown();
        })
        this.guessDropdownElement.addEventListener('click', (e) => {
            if (e.target.closest(this.selectors.guessDropdownItem)) {
                this.selectChampClick(e.target.closest(this.selectors.guessDropdownItem))
            }
        })

        this.guessSurrenderBtnElement.addEventListener('click', () => this.surrenderBtnClick())
        this.finishNextTryBtnElement.addEventListener('click', () => this.nextTryBtnClick())

        let savedChampsId = this.getSavedChampsId()
        if (savedChampsId) { this.renderSavedChamps(savedChampsId) }

        this.hints.setHints(this.targetChampionQuoteData[this.classicQuoteID].textRU, this.targetChampionSpellData[this.classicSpellID].id, (this.targetChampion.championId + '_' + this.targetChampionSplashData[this.classicSplashID].id), this.latestVersion)

        console.log(`Последняя версия DDragon - ${this.latestVersion}`)
    }
}

export default Guess;