//Site entry: Bootstrap 5, icons, site styles and the few page behaviours the pages rely on

//Styles (extracted by MiniCssExtractPlugin to css/main.css)
require('bootstrap/dist/css/bootstrap.min.css');
require('@fortawesome/fontawesome-free/css/fontawesome.min.css');
require('@fortawesome/fontawesome-free/css/solid.min.css');
require('@fortawesome/fontawesome-free/css/regular.min.css');
require('@fortawesome/fontawesome-free/css/v4-shims.min.css');
require('c3/c3.min.css');
require('../css/site.css');

//jQuery
//execute files in global context with script-loader: https://github.com/webpack/script-loader
require('script-loader!jquery/dist/jquery.min');

//Bootstrap JS (bundle includes Popper). Exposed as window.bootstrap
window.bootstrap = require('bootstrap/dist/js/bootstrap.bundle.min');

//MatchHeight - Used to make sure dashboard cards are the same height
require('jquery-match-height');

//C3 donut and sparkline defaults (replacement for the PatternFly 3 helper)
require('./chart-defaults');

//Tooltips are opt-in in Bootstrap 5
require('./site');
