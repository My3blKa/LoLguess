class Loader {
    stateClasses = {
        headerPlaceholder: '.header-placeholder',
        footerPlaceholder: '.footer-placeholder',
        settingModalPlaceholder: '.setting-modal'
    }
    statePaths = {
        headerPath: '/LoLguess/components/header.html',
        footerPath: '/LoLguess/components/footer.html',
        settingModalPath: '/LoLguess/components/setting-modal.html'
    }

    constructor() {
        
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