class Header {
    selectors = {
        settingModal: "[data-js-setting-modal]",
        settingModalCloseBtn: "[data-js-setting-modal-close-btn]",
        settingModalOpenBtn: "[data-js-setting-modal-open-btn]",
        ColorblindBtn: "[data-js-settings-colorblind-btn]",
        langBtnRu: "[data-js-lang-btn-ru]",
        langBtnEn: "[data-js-lang-btn-en]"
    }
    stateClasses = {
        isActive: 'is-active'
    }

    constructor() {
        this.settingModalElement = document.querySelector(this.selectors.settingModal);
        this.settingModalCloseBtnElement = document.querySelector(this.selectors.settingModalCloseBtn);
        this.settingModalOpenBtnElement = document.querySelector(this.selectors.settingModalOpenBtn);
        this.colorblindBtnElement = document.querySelector(this.selectors.ColorblindBtn);
        this.langBtnRuElement = document.querySelector(this.selectors.langBtnRu);
        this.langBtnEnElement = document.querySelector(this.selectors.langBtnEn);

        this.bindEvents();
    }

    showModal = () => {
        this.settingModalElement.showModal();
    }
    hideModal = () => {
        this.settingModalElement.close();
    }
    colorblindBtnToggle = () => {
        this.colorblindBtnElement.classList.toggle(this.stateClasses.isActive);

        this.colorblindBtnElement.getAttribute('aria-pressed') === 'false' 
        ? this.colorblindBtnElement.setAttribute('aria-pressed', 'true') 
        : this.colorblindBtnElement.setAttribute('aria-pressed', 'false')
    }
    onLangBtnClick = () => {
        this.langBtnEnElement.classList.toggle(this.stateClasses.isActive);
        this.langBtnRuElement.classList.toggle(this.stateClasses.isActive);
    }

    bindEvents() {
        this.settingModalCloseBtnElement.addEventListener('click', () => this.hideModal());
        this.settingModalOpenBtnElement.addEventListener('click', () => this.showModal());
        this.colorblindBtnElement.addEventListener('click', () => this.colorblindBtnToggle());
        this.langBtnRuElement.addEventListener('click', () => this.onLangBtnClick());
        this.langBtnEnElement.addEventListener('click', () => this.onLangBtnClick());
    }
}

export default Header;