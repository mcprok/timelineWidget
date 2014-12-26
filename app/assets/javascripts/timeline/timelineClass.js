define('timeline/timelineClass', function (require) {

    var timePointer = require('timePointer');

    function Timeline(containerId, options) {

        var optionsUsed = {
            editable: true,
            width: '100%',
            cluster: true,
            showMajorLabels: false,
            axisOnTop: false,
            groupsChangeable: true,
            groupMinHeight: 150,
            groupsOnRight: false,
            style: "dot",
            hideableGroup: false,
            pointerActive: true
        };

        $.extend(optionsUsed, options);
        this.nextGroupId = 1;
        this.$container = $('#' + containerId);

        this.groups = {}; // mapa nazwaGrupy : grupa - jeden timeline biblioteczki
        this.$timeline = null;
        this.$timelineObj = {};
        this.pointer = null;

        this.groupsNextEventId = {};
        this.nextEventId = 0;

        this.pointersForGroups = {}; //nazwaGrupy - pointer;
        this.onGroupCreatedCallbacks = [];

        this.createGroup = function (groupName, data) {
            if (this.canCreateGroup(groupName)) {
                if (this.nextGroupId == 1) {
                    console.log('clearing');
                    this.$container.html('');
                }

                if (this.$timeline == null) {
                    var $newGroupWrapper = $('<div id="timelineGroup_' + this.nextGroupId + '" data-groupName="' + groupName + '" ></div>'); // TODO change for multiple
                    this.$container.append($newGroupWrapper);
                    this.$timeline = new links.Timeline($newGroupWrapper[0]);
                    this.$timelineObj['main'] = this.$timeline;

                    this.pointer = new timePointer.Pointer(this.$timeline);

                    this.$timeline.draw(data, optionsUsed);

                } else {
                    this.$timeline.addItems(data);
                    this.$timeline.redraw();
                }

                this.nextGroupId = this.nextGroupId + 1;

                this.groupsNextEventId[groupName] = data.length + 1;
                this.nextEventId = data.length + 1;

                if (optionsUsed.pointerActive === true) {
                    this.enablePointer();
                } else {
                    this.disablePointer();
                }

                this.fireOnGroupCreatedCallbacks(groupName, this.$timeline, $newGroupWrapper);
            } else {
                console.log("cannot create group with such name: " + groupName);
            }
        };

        this.fireOnGroupCreatedCallbacks = function (groupName, $group, $container) {
            _.forEach(this.onGroupCreatedCallbacks, function (callback) {
                callback(groupName, $group, $container);
            });
        };

        this.canCreateGroup = function (groupName) {
            return !this.groupExists(groupName);
        };

        this.groupExists = function (groupName) {
            return this.groups.hasOwnProperty(groupName); // TODO remove
        };

        this.deleteGroup = function (groupName) {
            // TODO
        };

        this.addEvent = function (event, groupName) {
            event.group = groupName;
            event.geo = [19.941002, 50.0611];
            event.location = "Klub RE, Kraków, Poland";
            this.nextEventId = this.nextEventId + 1;
            this.$timeline.addItems([event]);
            this.$timeline.redraw();
        };

        this.getGroup = function (groupName) {
            if (this.groupExists(groupName)) {
                return this.groups[groupName];
            } else {
                console.log('Cannot get group. It doesnt exists: ' + groupName);
                return null;
            }
        };

        this.addEventHandler = function (type, callback) {
            if (type == null || type.length == 0) {
                console.error('Cannot add on selection handler - no timeline or data provided');
            }
            console.log('adding callback');
            console.log(type);
            console.log(this.$timeline);
            links.events.addListener(this.$timeline, type, callback);
        };

        this.onGroupCreated = function (callback) {
            this.onGroupCreatedCallbacks.push(callback);
        };

        this.onGroupDeleted = function (callback) {
            // TODO
        };

        this.search = (function (self) {
            var searchConfig = {
                chronological: true,
                after: null,
                before: null,
                groups: []
            };
            var timelineObj = self.$timelineObj;

            function isAfterDateInOptions(searchConfig, item) {
                return searchConfig["after"] == null || (searchConfig["after"] instanceof Date && item.start > searchConfig["after"]);
            }

            function isBeforeDateInOptions(searchConfig, item) {
                var before = searchConfig["before"];
                return before == null || (before instanceof Date && (item.end != null && item.end < before) || item.start < before);
            }

            function datesCriteriaMatches(item) {
                return isAfterDateInOptions(searchConfig, item) && isBeforeDateInOptions(searchConfig, item);
            }

            function groupNameMatches(item, groupsToSearch) {
                return groupsToSearch.length == 0 || _.contains(groupsToSearch, item.group) || (item.hasOwnProperty('group') && _.contains(groupsToSearch, item.group['content']));
            }

            return function (searchString, options) {
                searchConfig.groups = [];
                $.extend(searchConfig, options);
                var timeline = timelineObj['main'];
                var groupsToSearch = searchConfig["groups"];

                var searchResults = [];
                for (var i = 0; i < timeline.items.length; i++) {
                    var item = timeline.items[i];
                    if (_.contains(item.content.toLowerCase(), searchString.toLowerCase())) {
                        if (datesCriteriaMatches(item) && groupNameMatches(item, groupsToSearch)) {
                            searchResults.push(item);
                        }
                    }
                }
                return searchResults;
            }
        })(this);

        this.highlightEvents = function (e) {

            var $timelineContent = $(e.currentTarget);
            var $frame = $timelineContent.parent();
            var boundingBoxLeft = $frame.get(0).getBoundingClientRect().left;

            var groupWidth = $($frame.get(0)).find('.timeline-groups-axis').width();

            var offset = e.pageX - (boundingBoxLeft + groupWidth );

            this.pointer.highlightCurrentElements(offset, $timelineContent.width());
        };

        var self = this;

        var pointerHandler = function (e) {
            self.highlightEvents(e);
        };

        this.enablePointer = function () {

            $('.pointer').show();
            $('body').delegate('.timeline-content', 'mousemove', pointerHandler);
            this.pointerActive = true;
        };

        this.disablePointer = function () {

            $('.pointer').hide();
            $('body').undelegate('.timeline-content', 'mousemove', pointerHandler);
            this.pointerActive = false;
        };

        this.isPointerActive = function () {
            return this.pointerActive;
        };


    }

    return {
        Timeline: Timeline
    }
});


