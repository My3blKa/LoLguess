class Header {
    selectors = {
        settingModal: "[data-js-setting-modal]",
        settingModalCloseBtn: "[data-js-setting-modal-close-btn]",
        settingModalOpenBtn: "[data-js-setting-modal-open-btn]",
        ColorblindBtn: "[data-js-settings-colorblind-btn]",
        langBtn: "[data-js-lang-btn]",
    }
    stateClasses = {
        isActive: 'is-active'
    }

    constructor() {
        this.settingModalElement = document.querySelector(this.selectors.settingModal);
        this.settingModalCloseBtnElement = document.querySelector(this.selectors.settingModalCloseBtn);
        this.settingModalOpenBtnElement = document.querySelector(this.selectors.settingModalOpenBtn);
        this.colorblindBtnElement = document.querySelector(this.selectors.ColorblindBtn);
        this.langBtnArray = document.querySelectorAll(this.selectors.langBtn);

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
    onLangBtnClick = (btn) => {
        this.langBtnArray.forEach(b => b.classList.remove(this.stateClasses.isActive))
        btn.classList.add(this.stateClasses.isActive)

        // Логика смены языка на страницах
    }

    bindEvents() {
        this.settingModalCloseBtnElement.addEventListener('click', () => this.hideModal());
        this.settingModalOpenBtnElement.addEventListener('click', () => this.showModal());
        this.colorblindBtnElement.addEventListener('click', () => this.colorblindBtnToggle());
        this.langBtnArray.forEach(btn => {
            btn.addEventListener('click', () => this.onLangBtnClick(btn))
        })
    }
}

export default Header;