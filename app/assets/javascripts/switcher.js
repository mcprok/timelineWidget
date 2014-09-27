define("switcher", function() {

    var $addEventButton,
        $addTimelineButton,
        $showTimelinesButton,
        $searchButton;

    var $addEventContent,
        $addTimelineContent,
        $timelinesWrapper,
        $searchWrapper;

    var init = function() {

        $addEventButton = $("#addEvent");
        $addTimelineButton = $("#addTimeline");
        $showTimelinesButton = $("#showTimelines");
        $searchButton = $("#searchButton");


        $addEventContent = $('#addEventWrapper');
        $addTimelineContent = $("#addNewTimeline");
        $timelinesWrapper = $("#timelinesWrapper");
        $searchWrapper = $("#searchWrapper");


        $addEventButton.on('click', function() {
           switchView($addEventContent);
        });

        $addTimelineButton.on('click', function() {
           switchView($addTimelineContent);
        });

        $showTimelinesButton.on('click', function() {
            switchView($timelinesWrapper);
        });

        $searchButton.on('click', function() {
            switchView($searchWrapper);
        });

    };

     var switchView = function($wrapperToShow) {

         $('body').find('.is-active').removeClass('is-active');
         $wrapperToShow.addClass('is-active');

     };

    return {
      init: init,
      switchView : switchView
    };

});