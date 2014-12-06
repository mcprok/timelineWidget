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
        console.log('Timeline class');
        console.log(containerId);
        this.$container = $('#' + containerId);
        this.groups = {}; // mapa nazwaGrupy : grupa - jeden timeline biblioteczki

        this.createGroup = function (groupName, data) {
            if (this.canCreateGroup(groupName)) {
                console.log("creating group");
                var $newGroupWrapper = $('</div id="timelineGroup_' + this.nextGroupId + '">');
                this.$container.append($newGroupWrapper);
                this.nextGroupId++;
                var $newTimeline = new links.Timeline($newGroupWrapper);
                $newTimeline.draw(data, optionsUsed);
                this.groups[groupName] = $newTimeline;
            } else {
                console.log("cannot create group with such name: " + groupName);
            }
//        timePointer.init($timeline);
//        } else {
//            $timeline.addItems(data);
//            $timeline.redraw();
//        }
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
            // TODO
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


