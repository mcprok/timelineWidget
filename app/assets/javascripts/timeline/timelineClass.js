define('timeline/timelineClass', function () {

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
            hideableGroup: false
        };

        $.extend(optionsUsed, options);
        this.nextGroupId = 1;
        this.$container = $('#' + containerId);
        this.groups = {}; // mapa nazwaGrupy : grupa - jeden timeline biblioteczki
        this.onGroupCreatedCallbacks = [];

        this.createGroup = function (groupName, data) {
            if (this.canCreateGroup(groupName)) {
                if (this.nextGroupId == 1) {
                    console.log('clearing');
                    this.$container.html('');
                }
                var $newGroupWrapper = $('<div id="timelineGroup_' + this.nextGroupId + '"></div>');
                this.$container.append($newGroupWrapper);
                this.nextGroupId = this.nextGroupId + 1;
                var $newTimeline = new links.Timeline($newGroupWrapper[0]);
                $newTimeline.draw(data, optionsUsed);
                joinTimelines(this.groups, $newTimeline);

                this.groups[groupName] = $newTimeline;
            } else {
                console.log("cannot create group with such name: " + groupName);
            }

            this.fireOnGroupCreatedCallbacks(groupName, $newTimeline);
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

        this.fireOnGroupCreatedCallbacks = function (groupName, $group) {
            _.forEach(this.onGroupCreatedCallbacks, function (callback) {
                callback(groupName, $group);
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

        this.addEvent = function (event, group) {


            // TODO
        };

        this.getGroup = function (groupName) {
            // TODO
        };

        this.addEventHandler = function (type, callback, groupName) {
            if (groupName != undefined) {
                links.events.addListener(groupName, type, callback);
            } else {
                _.forEach(this.groups, function (container) {
                    links.events.addListener(container, type, callback);
                })
            }
        };

        this.getEventsOnPosition = function (pixelsFromLeft) {
            // TODO
        };

        this.onGroupCreated = function (callback) {
            this.onGroupCreatedCallbacks.push(callback);
        };
        this.onGroupDeleted = function (callback) {
            // TODO
        };

        this.search = (function () {
            // TODO
            var searchConfig = {
//            domyslny konfig
            };

            return function (key, options) {
                $.extend(searchConfig, options);
//            juz normalny kod
            }

        });

//        var search = function (key, options) {
//
//        };
        // options = {
        //      chronological : true/false
        //      startDate :
        //      endDate :
        //      groups: []
        // }

    }

    return {
        Timeline: Timeline
    }
});


