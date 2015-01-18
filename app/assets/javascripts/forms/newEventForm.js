define('forms/newEventForm', function(require) {



    var addNewEventSubmitHandler = function (callback) {
        $('#addEventForm').on('submit', function (e) {
            e.preventDefault();
            var newEventStartDate = getDateFromInputs('newEventStartDate', 'newEventStartTime');

            var selectedGroup = $("#groupSelect").find("option:selected").html();

            var newEvent = {
                start: newEventStartDate,
                content: $('#contentInput').val(),
                description: $('#descriptionInput').val(),
                group: selectedGroup
            };

            if ($('#newEventEndDateOn').get(0).checked) {
                newEvent.end = getDateFromInputs('newEventEndDate', 'newEventEndTime');
            }

            if (callback) {
                callback(newEvent, selectedGroup);
            }
        });
    };

    return {
        addNewEventSubmitHandler: addNewEventSubmitHandler
    };

});