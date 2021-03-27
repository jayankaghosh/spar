
/**
 * Injects a <base> tag which allows other resources to load. This
 * has no effect on serialised output, but allows it to verify render
 * quality.
 */
const injectBaseHref = ({url}) => {
    const head = document.querySelector('head');
    let base = document.querySelector('base');
    if (base) {
        base.setAttribute('href', url)
    } else {
        base = document.createElement('base');
        base.setAttribute('href', url);
        head.insertBefore(base, head.children[0] || null);
    }
};

const stripPage = () => {
    // Strip only script tags that contain JavaScript (either no type attribute or one that contains "javascript")
    const elements = document.querySelectorAll(
        'script:not([type]), script[type*="javascript"], script[type="module"], link[rel=import]'
    );
    for (const e of Array.from(elements)) {
        e.remove();
    }
};

module.exports = (user, defaultConfig) => {
    const config = { ...defaultConfig };
    if (!config.evaluate) config.evaluate = [];
    config.evaluate.push(injectBaseHref);
    config.evaluate.push(stripPage);
    return config;
};
