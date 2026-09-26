class Loader {
    stateClasses = {
        headerPlaceholder: '.header-placeholder',
        footerPlaceholder: '.footer-placeholder',
        settingModalPlaceholder: '.setting-modal'
    }

    constructor(basepath = './') {
        this.basepath = basepath;
        this.headerPath = `${this.basepath}components/header.html`
        this.footerPath = `${this.basepath}components/footer.html`
        this.settingModalPath = `${this.basepath}components/setting-modal.html`
    }

    async loadComponent(selector, path) {
        const response = await fetch(path);
        const html = await response.text();
        document.querySelector(selector).insertAdjacentHTML('afterend', html);
        document.querySelector(selector).remove();
    }

    async bindEvents() {
        await this.loadComponent(this.stateClasses.headerPlaceholder, this.headerPath);
        await this.loadComponent(this.stateClasses.footerPlaceholder, this.footerPath);
        await this.loadComponent(this.stateClasses.settingModalPlaceholder, this.settingModalPath);
    }
}

export default Loader;