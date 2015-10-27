window.onload = function () {
    var style, options;

    options = INSTALL_OPTIONS;

    style = document.createElement('style');
    document.head.appendChild(style);

    style.innerHTML = (
        '.progressContainer{ position: fixed; bottom: 0; left: 0; width: 100%; height: 4px; background: ' + options.ProgressBarOptions.Background + '; }' +
        '.progress{ height: 4px; background: ' + options.ProgressBarOptions.ProgressBar + '; width: 0; transition: width 0.5s; }'
    );

    document.body.innerHTML += '<div class="progressContainer"><div id="progress" class="progress"></div></div>';

    function updateProgress(num1, num2) {
        var percent = Math.ceil(num1 / num2 * 100) + '%';
        document.getElementById('progress').style.width = percent;
    }

    window.addEventListener('scroll', function () {
        var top = window.scrollY;
        var height = document.body.getBoundingClientRect().height - window.innerHeight;
        updateProgress(top, height);
    });
}