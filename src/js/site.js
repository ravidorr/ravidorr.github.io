// Behaviours that PatternFly 3 used to wire up automatically.
(function () {
    'use strict';

    function init() {
        // Bootstrap 5 tooltips must be initialised explicitly.
        // Titles are fixed text in the markup; Bootstrap sanitizes HTML by default and
        // `html` is deliberately not enabled, so titles are always rendered as text.
        document.querySelectorAll('[data-bs-toggle="tooltip"]').forEach(function (el) {
            window.bootstrap.Tooltip.getOrCreateInstance(el);
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
