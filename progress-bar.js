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

        containerEl.className = 'scroll-progress-bar-container';
        containerEl.className += ' scroll-progress-bar-' + options.position;

        barEl.style.height = options.thickness + "px";
        barEl.style.backgroundColor = options.barColor;

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

        if (   (options.hideUntilScroll && percent < 5)
            || (options.hideAfterDone && percent > 95)){
            containerEl.style[TRANSFORM] = 'translateY(-' + options.thickness + 'px)';
        } else {
            containerEl.style[TRANSFORM] = '';
        }

        if (options.translucent){
            containerEl.style.opacity = 0.9;
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
