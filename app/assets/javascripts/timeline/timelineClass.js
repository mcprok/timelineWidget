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
        this.onGroupCreatedCallbacks = [];
        this.groupsNextEventId = {};
        this.pointersForGroups = {}; //nazwaGrupy - pointer;

        this.createGroup = function (groupName, data) {
            if (this.canCreateGroup(groupName)) {
                if (this.nextGroupId == 1) {
                    console.log('clearing');
                    this.$container.html('');
                }
                var $newGroupWrapper = $('<div id="timelineGroup_' + this.nextGroupId + '"></div>'); // TODO change for multiple
                this.$container.append($newGroupWrapper);
                this.nextGroupId = this.nextGroupId + 1;
                var $newTimeline = new links.Timeline($newGroupWrapper[0]);
                var pointer = new timePointer.Pointer($newTimeline);
                this.pointersForGroups[groupName] = pointer;

                joinTimelines(this.groups, $newTimeline);
                $newTimeline.draw(data, optionsUsed);

                this.groups[groupName] = $newTimeline;
                this.groupsNextEventId[groupName] = data.length + 1;
            } else {
                console.log("cannot create group with such name: " + groupName);
            }

            this.fireOnGroupCreatedCallbacks(groupName, $newTimeline, $newGroupWrapper);
        };

        function joinTimelines(oldTimelines, $newTimeline) {
            _.forEach(oldTimelines, function (timeline) {
                console.log(timeline);
                links.events.addListener(timeline, 'rangechange', function () {
                    var range = timeline.getVisibleChartRange();
                    $newTimeline.setVisibleChartRange(range.start, range.end);
                });
            });
            links.events.addListener($newTimeline, 'rangechange', function () {
                var range = $newTimeline.getVisibleChartRange();
                _.forEach(oldTimelines, function (group) {
                    group.setVisibleChartRange(range.start, range.end);
                });
            });
        }

        this.fireOnGroupCreatedCallbacks = function (groupName, $group, $container) {
            _.forEach(this.onGroupCreatedCallbacks, function (callback) {
                callback(groupName, $group, $container);
            });
        };

        this.canCreateGroup = function (groupName) {
            return !this.groupExists(groupName);
        };

        this.groupExists = function (groupName) {
            return this.groups.hasOwnProperty(groupName);
        };

        this.deleteGroup = function (groupName) {
            // TODO
        };

        this.addEvent = function (event, groupName) {
            if (this.groupExists(groupName)) {
                var $group = this.groups[groupName];
                event.id = this.groupsNextEventId;
                this.groupsNextEventId = this.groupsNextEventId + 1;
                $group.addItem(event, true);
                $group.redraw();
            } else {
                console.log('group doesnt exist: ' + groupName);
            }
        };

        this.getGroup = function (groupName) {
            if (this.groupExists(groupName)) {
                return this.groups[groupName];
            } else {
                console.log('Cannot get group. It doesnt exists: ' + groupName);
                return null;
            }
        };

        this.addEventHandler = function (type, callback, groupName) {
            if (type == null || type.length == 0) {
                console.error('Cannot add on selection handler - no timeline or data provided');
            }
            if (groupName != undefined) {
                if (this.groupExists(groupName)) {
                    links.events.addListener(this.groups[groupName], type, callback);
                } else {
                    console.log('Cannot add event. Group doesnt exist: ' + groupName);
                }
            } else {
                _.forEach(this.groups, function (container) {
                    links.events.addListener(container, type, callback);
                })
            }
        };

        this.onGroupCreated = function (callback) {
            this.onGroupCreatedCallbacks.push(callback);
        };

        this.onGroupDeleted = function (callback) {
            // TODO
        };

        function isAfterDateInOptions(searchConfig, item) {
            return searchConfig["after"] == null || (searchConfig["after"].isDate() && item.start > searchConfig["after"]);
        }
        function isBeforeDateInOptions(searchConfig, item) {
            return searchConfig["before"] == null || (searchConfig["before"].isDate() && item.start < searchConfig["before"]);
        }

        this.search = function () {
            var searchConfig = {
                chronological: true,
                startDate: null,
                endDate: null,
                groups: []
            };

            var allGroups = this.groups;

            return function (searchString, options) {
                console.log('In Inner search');
                console.log(options);
                $.extend(searchConfig, options);
                console.log('Final search options:');
                console.log(searchConfig);
                var groupsToSearch = [];

                if (searchConfig["groups"].length == 0) {
                    _.forEach(allGroups, function (group) {
                        groupsToSearch.push(group);
                    });
                } else {
                    _.forEach(searchConfig["groups"], function (groupName) {
                        if (allGroups.hasOwnProperty(groupName)) {
                            groupsToSearch.push(allGroups[groupName]);
                        }
                    });
                }

                console.log(groupsToSearch);

                var searchResults = [];
                _.forEach(groupsToSearch, function ($group) {
                    for (var i = 0; i < $group.items.length; i++) {
                        var item = $group.items[i];
                        if (_.contains(item.content.toLowerCase(), searchString.toLowerCase())) {
                            if (isAfterDateInOptions(searchConfig, item) && isBeforeDateInOptions(searchConfig, item)) {
                                searchResults.push(item);
                            }
                        }
                    }
                });
                return searchResults;
            }
        };

        // options = {
        //      chronological : true/false
        //      after :
        //      before :
        //      groups: []
        // }

        this.highlightEvents = function (e) {

            var $timelineContent = $(e.currentTarget);
            var $frame = $timelineContent.parent();
            var boundingBoxLeft = $frame.get(0).getBoundingClientRect().left;

            var groupWidth = $($frame.get(0)).find('.timeline-groups-axis').width();

            var offset = e.pageX - (boundingBoxLeft + groupWidth );

            _.each(this.pointersForGroups, function (pointer, key) {
                pointer.highlightCurrentElements(offset, $timelineContent.width());
            });
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

        if (optionsUsed.pointerActive === true) {
            this.enablePointer();
        } else {
            this.disablePointer();
        }

    }

    return {
        Timeline: Timeline
    }
});


