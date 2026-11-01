// Minimal replacement for PatternFly 3's `jQuery().c3ChartDefaults()` helper.
// Only the donut and sparkline defaults used by the pages are provided; values
// match the PatternFly 3 defaults so the charts look the same.
(function ($) {
    'use strict';

    var palette = {
        blue: '#0088ce',
        blue300: '#39a5dc',
        green: '#3f9c35',
        orange: '#ec7a08',
        red: '#cc0000',
        black300: '#d1d1d1'
    };

    function getDefaultColors() {
        return { pattern: [palette.blue, palette.blue300, palette.green, palette.orange, palette.red] };
    }

    function getDefaultDonutConfig(title) {
        return {
            donut: { title: title, label: { show: false }, width: 11 },
            // height 171 produces a diameter of 150 and a centered chart without a legend
            size: { height: 171 },
            legend: { show: false },
            color: { pattern: [palette.blue, palette.black300] },
            tooltip: { show: false }
        };
    }

    function getDefaultSparklineConfig() {
        return {
            area: { zerobased: true },
            size: { height: 60 },
            axis: { x: { show: false }, y: { show: false } },
            color: getDefaultColors(),
            legend: { show: false },
            point: { r: 1, focus: { expand: { r: 4 } } },
            tooltip: {
                // a sparkline holds a single data column, so only d[0] is shown
                contents: function (d) {
                    return '<span class="c3-tooltip-sparkline">' + d[0].value + ' ' + d[0].name + '</span>';
                }
            }
        };
    }

    $.fn.c3ChartDefaults = function () {
        return {
            getDefaultColors: getDefaultColors,
            getDefaultDonutConfig: getDefaultDonutConfig,
            getDefaultSparklineConfig: getDefaultSparklineConfig
        };
    };
})(window.jQuery);
