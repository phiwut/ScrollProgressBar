(function(){
    if (!document.addEventListener ||
        (  document.documentElement.style.transform === undefined
         && document.documentElement.style.webkitTransform === undefined)){
        return;
    }

    var TRANSFORM = document.documentElement.style.webkitTransform !== undefined ? 'webkitTransform' : 'transform';

    var options = INSTALL_OPTIONS;

    var containerEl = null;
    var barEl = null;
    var render = function(){
        if (!document.body)
            return;

        if (!containerEl){
            containerEl = document.createElement('div');
            document.body.appendChild(containerEl);

            barEl = document.createElement('div');
            barEl.className = 'scroll-progress-bar-bar';
            containerEl.appendChild(barEl);
        }

        // set class name
        containerEl.className = 'scroll-progress-bar-container';

        // set bar position
        containerEl.style.top = '';
        containerEl.className += ' scroll-progress-bar-' + options.position;

        // set bar thickness
        if (options.thickness == 'custom')
            barEl.style.height = options.customThickness + 'px';
        else
            barEl.style.height = options.thickness + 'px';

        // set bar color
        barEl.style.backgroundColor = options.barColor;

        // set background color
        if (options.containerHasColor)
            containerEl.style.backgroundColor = options.containerColor;
        else
            containerEl.style.backgroundColor = '';

        updateProgress();
    };

    var now = function(){
        return (window.performance && performance.now()) || (+ new Date);
    };

    var lastCall = 0;
    var updateProgress = function(){
        if (!barEl)
            return;

        // Don't allow updates faster than 60 FPS
        if (now() - lastCall < 15)
            return;

        lastCall = now();

        var top = window.scrollY;
        var height = document.body.getBoundingClientRect().height - window.innerHeight;

        var percent = Math.min(top / height * 100, 100);
        barEl.style[TRANSFORM] = 'translateX(' + -(100 - percent) + '%)';

        if (options.showAdvanced){
            if ((options.advanced.hideUntilScroll && percent < 5)
                || (options.advanced.hideAfterDone && percent > 95)) {
                var delta = +options.thickness;
                if (options.thickness == 'custom')
                    delta = +options.customThickness;
                if (options.position == 'top')
                    delta = - delta;

                containerEl.style[TRANSFORM] = 'translateY(' + delta + 'px)';
            } else {
                containerEl.style[TRANSFORM] = '';
            }
        }

        if (options.translucent){
            containerEl.style.opacity = 0.6;
        } else {
            containerEl.style.opacity = 1;
        }
    };

    var setOptions = function(opts){
        options = opts;

        render();
    };

    window.addEventListener('scroll', updateProgress);
    window.addEventListener('resize', updateProgress);

    if (document.readyState == 'loading')
        window.addEventListener('DOMContentLoaded', render);
    else
        render();

    window.ScrollProgressBar = {
        setOptions: setOptions
    };
})();
