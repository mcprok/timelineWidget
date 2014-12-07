define('timePointer', function (require) {

    var currentlyVisibleItems = [];

    var frameStart,
        frameEnd;
    var initialized = false;
    var pointerEnabled = false;

    var timeline;
    var init = function (globalTimeline) {
        timeline = globalTimeline;

        frameStart = timeline.start;
        frameEnd = timeline.end;

        $('.js-pointer-show').on('click', function (e) {
            enablePointer(true);
            $(e.currentTarget).hide();
            $('.js-pointer-hide').show();
        });

        $('.js-pointer-hide').on('click', function (e) {
            disablePointer(true);
            $(e.currentTarget).hide();
            $('.js-pointer-show').show();
        });

        var $timelineContent =  $('.timeline-content');
        var scrollTimeout = null;

        $timelineContent.on('mousewheel', function () {


            if(pointerEnabled) {
                if (scrollTimeout) {
                    clearTimeout(scrollTimeout);
                }

                disablePointer(false);
                scrollTimeout = setTimeout(function () {
                    enablePointer(false);
                }, 500);
            }


        });

        $timelineContent.on('mousedown', function(e) {
            if(pointerEnabled) {
                disablePointer(false);
            }

        });
        $('body').on('mouseup', function(e) {

            if(pointerEnabled) {
                enablePointer(false);
            }
        });


    };

    var _updatePointerState = function (e) {

        if (_checkResize()) {
            initialized = true;
            _updateVisibleItemsCache();
        }

        var $timelineFrame = $('.timeline-frame');
        var boundingBox = $timelineFrame.get(0).getBoundingClientRect().left;
        var groupWidth = $('.timeline-groups-axis').width();

        var leftValue = e.pageX - (boundingBox + groupWidth );
        $('.pointer').css('left', leftValue);



        $('.highlight').removeClass('highlight');

        _.each(currentlyVisibleItems.items[leftValue], function (itemIndex) {
            $(timeline.items[itemIndex].dom).addClass('highlight');
        });

        _.each(currentlyVisibleItems.clusters[leftValue], function (itemIndex) {
            $(timeline.clusters[itemIndex].dom).addClass('highlight');
        });

    };

    var _checkResize = function () {
        return !initialized || !(frameStart == timeline.start && frameEnd == timeline.end);
    };

    var _updateVisibleItemsCache = function () {
        var interval = timeline.getVisibleChartRange();
        var contentWidth = $('.timeline-content').width();

        currentlyVisibleItems = {
            items : new Array(contentWidth),
            clusters : new Array(contentWidth)
        };

        for (var i = 0; i < contentWidth; i++) {
            currentlyVisibleItems.items[i] = [];
            currentlyVisibleItems.clusters[i] = [];
        }


        var items = _getVisibleEvents(interval.start, interval.end, 'items');
         var clusters = _getVisibleEvents(interval.start, interval.end, 'clusters');

        _addToVisibleItems(items, 'items', contentWidth);
        _addToVisibleItems(clusters, 'clusters', contentWidth);
    };

    var _addToVisibleItems = function(array, type, contentWidth) {

        _.each(array, function (currentItem) {
            var item = timeline[type][currentItem.row];
            var start = item.left > 0 ? Math.floor(item.left) : 0;
            var end = item.right > 0 ? Math.ceil(item.right) : 0;
            for (var i = start; i < end && i < contentWidth; i++) {
                currentlyVisibleItems[type][i].push(currentItem.row);
            }
        });
    };

    var _addPointerToTimeline = function () {
        var pointer = '<div class="pointer" style="height:100%; width:1px; background: #e00; display: block; position: absolute;left: 0px;"></div>';
        $('.timeline-content').append($(pointer));
    };

    var disablePointer = function (byClick) {
        $('.pointer').hide();
        $('body').undelegate('.timeline-frame', 'mousemove', _updatePointerState);

        if(byClick) {
            pointerEnabled = false;
        }
    };

    var enablePointer = function (byClick) {
        var $pointer = $('.pointer');
        if ($pointer.length === 0) {
            _addPointerToTimeline();
        }
        $pointer.show();
        $('body').delegate('.timeline-frame', 'mousemove', _updatePointerState);
        if(byClick) {
            pointerEnabled = true;
        }
    };

    var _getVisibleEvents = function (start, end, type) {
        var items = timeline[type];
        var itemsInRange = [];

        if (items) {
            for (var i = 0, iMax = items.length; i < iMax; i++) {
                var item = items[i];

                if (item.end) {
                    // Time range object
                    if (item.start <= start && item.end > start) {

                        itemsInRange.push({"row": i});

                    } else if (item.start <= end) {
                        itemsInRange.push({"row": i});
                    }

                } else {
                    // Point object
                    if (start <= item.start && item.start <= end) {
                        itemsInRange.push({"row": i});
                    }
                }
            }
        }

        return itemsInRange;
    };

    return {
        init: init
    };
});