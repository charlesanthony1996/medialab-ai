(async () => {
    const [modalModule, observerModule, stylesModule, apiModule, utilsModule] = await Promise.all([
        import(chrome.runtime.getURL('content/modal.js')),
        import(chrome.runtime.getURL('content/observer.js')),
        import(chrome.runtime.getURL('content/styles.js')),
        import(chrome.runtime.getURL('content/api.js')),
        import(chrome.runtime.getURL('content/utility.js'))
    ]);

    // Initialize modules
    modalModule.initModal();
    observerModule.initObservers();
    stylesModule.applyStyles();

    // Expose API and utility functions if needed
    window.apiModule = apiModule;
    window.utilsModule = utilsModule;
})();
