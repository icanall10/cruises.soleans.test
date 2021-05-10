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

                    $this.addClass('prepared');
                });
            })
            .on('animate:clear-start-timeouts', function () {
                $this = $(this);

                let timeouts = $this.data('start-timeouts') ?? [];

                timeouts.forEach(function (value) {
                    clearTimeout(value);
                });
            })
            .on('animate:clear-stop-timeouts', function () {
                $this = $(this);

                let timeouts = $this.data('stop-timeouts') ?? [];

                timeouts.forEach(function (value) {
                    clearTimeout(value);
                });
            })
            .on('animate:start', function () {
                let $this = $(this);

                if ($this.hasClass('processing')) return;

                $this.trigger('animate:prepare');

                $this.addClass('processing');

                $this.trigger('animate:clear-start-timeouts');

                let autoStop = $this.filter('[data-text-animated-auto-stop]').length > 0;

                let chars = $this.data('chars') ?? [];
                let count = 0;
                let timer = 80;

                chars.forEach(function (value, key) {
                    count++;

                    let empty = (value === ' ');
                    let lineBreak = (value === '|');

                    if (empty) count--;

                    let delay = empty ? (timer * count + 1) : (timer * count);

                    let timeouts = $this.data('start-timeouts') ?? [];

                    timeouts.push(
                        setTimeout(function () {
                            if (lineBreak) {
                                $this.append('<span class="br"></span>');
                            } else {
                                $this.append('<span>' + (empty ? '&nbsp;' : value) + '</span>');
                            }

                            timeouts.push(
                                setTimeout(function () {
                                    $this
                                        .find('span:not(.animate)')
                                        .addClass('animate');

                                    if (chars.length === (key + 1)) {
                                        // $this.removeClass('processing');
                                    }

                                    if (chars.length === (key + 1) && autoStop) {
                                        $this.trigger('animate:stop');
                                    }
                                }, 50)
                            );
                        }, delay)
                    );

                    $this.data('start-timeouts', timeouts);
                });
            })
            .on('animate:stop', function () {
                let $this = $(this);

                $this.trigger('animate:prepare');

                $this.trigger('animate:clear-stop-timeouts');

                let next = $this.attr('data-text-animated-next') ?? null;

                let count = 0;
                let timer = 80;

                let items = $this.find('span');

                items.each(function (key) {
                    let span = $(this);

                    count++;

                    let value = span.text();
                    let empty = (value === ' ');

                    if (empty) count--;

                    let delay = empty ? (timer * count + 1) : (timer * count);

                    let timeouts = $this.data('stop-timeouts') ?? [];

                    timeouts.push(
                        setTimeout(function () {
                            span.addClass('removed');

                            if (items.length === (key + 1)) {
                                $this.trigger('animate:destroy');

                                if (next !== null) {
                                    $(next).trigger('animate:start');
                                }
                            }
                        }, delay)
                    );

                    $this.data('stop-timeouts', timeouts);
                });
            })
            .on('animate:destroy', function () {
                let $this = $(this);

                $this.trigger('animate:prepare');

                $this.trigger('animate:clear-start-timeouts');
                $this.trigger('animate:clear-stop-timeouts');

                $this.removeClass('processing');

                $this.html('');
            });


        $('.slider-block .owl-carousel')
            .once()
            .owlCarousel({
                items: 1,
                dots: true,
                nav: true,
                onInitialized: function (e) {
                    $(e.currentTarget)
                        .find('.owl-item.active')
                        .find('[data-text-animated]')
                        .trigger('animate:destroy');

                    $(e.currentTarget)
                        .find('.owl-item.active')
                        .find('[data-text-animated-auto-start]')
                        .trigger('animate:start');
                },
                onChanged: function (e) {
                    setTimeout(function () {
                        $(e.currentTarget)
                            .find('.owl-item')
                            .find('[data-text-animated]')
                            .trigger('animate:destroy');

                        $(e.currentTarget)
                            .find('.owl-item.active')
                            .find('[data-text-animated-auto-start]')
                            .trigger('animate:start');
                    }, 100);
                }
            });


        $('.back-to-top')
            .once()
            .click(function () {
                $('body, html').animate({
                    scrollTop: 0
                }, 500);

                return false;
            });


    }


    $(document).ready(function () {
        behaviors();
    });


    $(document).ajaxComplete(function () {
        behaviors();
    });


})(jQuery);