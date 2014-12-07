define('timePointer', function (require) {


    function Pointer(timeline) {
        this.timeline = timeline;
        this.container = timeline.dom.container;
        this.visibleItems = {};
        this.start = timeline.start;
        this.end = timeline.end;
        this.$pointer = $('<div class="pointer" style="height:100%; width:1px; background: #e00; display: block; position: absolute;left: 0px;"></div>');
        this.initialized = false;
        this.currentlyVisibleItems = {};

        $(this.container).find('.timeline-content').append(this.$pointer);

        this.getCurrentlyVisibleItems = function () {
            if (this._isResized()) {
                this._onResizeAction();
                this.initialized = true;
            }

            return this.currentlyVisibleItems;
        };

        this._isResized = function () {
            return !this.initialized || (this.start != this.timeline.start || this.end != this.timeline.end);
        };

        this._onResizeAction = function () {
            this.start = this.timeline.start;
            this.end = this.timeline.end;

            this._updateVisibleItemsCache();
        };

        this._updateVisibleItemsCache = function () {
            var contentWidth = $(this.container).find('.timeline-content').width();

            this.currentlyVisibleItems = {
                items: new Array(contentWidth),
                clusters: new Array(contentWidth)
            };

            for (var i = 0; i < contentWidth; i++) {
                this.currentlyVisibleItems.items[i] = [];
                this.currentlyVisibleItems.clusters[i] = [];
            }

            var items = this._calculateVisibleEvents('items');
            var clusters = this._calculateVisibleEvents('clusters');

            this._addToVisibleItems(items, 'items', contentWidth);
            this._addToVisibleItems(clusters, 'clusters', contentWidth);
        };


        this._calculateVisibleEvents = function (type) {
            var start = this.start;
            var end = this.end;
            var items = this.timeline[type];

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

        this._addToVisibleItems = function (array, type, contentWidth) {
            var self = this;
            _.each(array, function (currentItem) {
                var item = timeline[type][currentItem.row];
                var start = item.left > 0 ? Math.floor(item.left) : 0;
                var end = item.right > 0 ? Math.ceil(item.right) : 0;
                for (var i = start; i < end && i < contentWidth; i++) {
                    self.currentlyVisibleItems[type][i].push(currentItem.row);
                }
            });
        };


        var self = this;

        this.highlightCurrentElements = function(offset, containerSize) {
            if(self._isResized()) {
                self._onResizeAction();
            }
            var selfWidthContainer = $(self.container).find('.timeline-content').width();

            offset = offset * ( selfWidthContainer / containerSize);

            $(self.container).find('.pointer').css('left', offset);

            $(self.container).find('.highlight').removeClass('highlight');

            _.each(self.currentlyVisibleItems.items[Math.floor(offset)], function (itemIndex) {
                $(self.timeline.items[itemIndex].dom).addClass('highlight');
            });

            _.each(self.currentlyVisibleItems.clusters[Math.floor(offset)], function (itemIndex) {
                $(self.timeline.clusters[itemIndex].dom).addClass('highlight');
            });

        };



    }


    /*
    var _updatePointerState = function (e) {

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

    };*/


    return {
        Pointer : Pointer
    };
});