(function ($) {

    function behaviors() {


        $('[data-text-animated]')
            .once()
            .on('animate:prepare', function () {
                $(this).once('animate-prepare', function () {
                    let $this = $(this);
                    let text = ' ' + $this.text().trim().replace(/\s\s+/g, ' ');

                    let chars = text.split('');

                    $this.data('chars', chars);

                    $this.html('');
                });
            })
            .on('animate:run', function () {
                let $this = $(this);

                $this.trigger('animate:prepare');

                let chars = $this.data('chars') ?? [];
                let count = 0;
                let timer = 80;

                chars.forEach(function (value) {
                    count++;

                    let empty = (value === ' ');
                    let lineBreak = (value === '|');

                    if (empty) count--;

                    let delay = empty ? (timer * count + 1) : (timer * count);

                    setTimeout(function () {
                        if (lineBreak) {
                            $this.append('<span class="br"></span>');
                        } else {
                            $this.append('<span>' + (empty ? '&nbsp;' : value) + '</span>');
                        }

                        setTimeout(function () {
                            $this.find('span:not(.animate)').addClass('animate');
                        }, 50);
                    }, delay);
                });
            })
            .on('animate:destroy', function () {
                let $this = $(this);

                $this.html('');
            })
            .trigger('animate:run');


    }


    $(document).ready(function () {
        behaviors();
    });


    $(document).ajaxComplete(function () {
        behaviors();
    });


})(jQuery);