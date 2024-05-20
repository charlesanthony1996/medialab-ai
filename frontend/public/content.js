(async () => {
    const [modalModule, observerModule, stylesModule, apiModule, utilsModule] = await Promise.all([
        import(chrome.runtime.getURL('modal.js')),
        import(chrome.runtime.getURL('observer.js')),
        import(chrome.runtime.getURL('styles.js')),
        import(chrome.runtime.getURL('api.js')),
        import(chrome.runtime.getURL('utility.js'))
    ]);

    // Initialize modules
    modalModule.initModal()
    observerModule.initObservers()
    // stylesModule.applyStyles();

    // Expose API and utility functions if needed
    window.apiModule = apiModule
    window.utilsModule = utilsModule
})()
