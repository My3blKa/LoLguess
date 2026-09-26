class Loader {
    stateClasses = {
        headerPlaceholder: '.header-placeholder',
        footerPlaceholder: '.footer-placeholder',
        settingModalPlaceholder: '.setting-modal'
    }
    statePaths = {
        headerPath: this.basepath + 'components/header.html',
        footerPath: this.basepath + 'components/footer.html',
        settingModalPath: this.basepath + 'components/setting-modal.html'
    }

    constructor(basepath='./') {
        this.basepath = basepath;
    }

    async loadComponent(selector, path) {
        const response = await fetch(path);
        const html = await response.text();
        document.querySelector(selector).insertAdjacentHTML('afterend', html);
        document.querySelector(selector).remove();
    }

    async bindEvents() {
        await this.loadComponent(this.stateClasses.headerPlaceholder,  this.statePaths.headerPath);
        await this.loadComponent(this.stateClasses.footerPlaceholder,  this.statePaths.footerPath);
        await this.loadComponent(this.stateClasses.settingModalPlaceholder,  this.statePaths.settingModalPath);
    }
}

export default Loader;