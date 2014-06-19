define('forms/newEventForm', function () {

    var getDateFromInputs = function (datepickerId, timepickerId) {
        var datepickerValue = $('#' + datepickerId).datepicker('getDate');
        var timepickerValue = $('#' + timepickerId).data("timepicker").getTime().split(':');
        var newEventTimeHours = parseInt(timepickerValue[0]);
        var newEventTimeMinutes = parseInt(timepickerValue[1]);
        datepickerValue.set({
            minute: newEventTimeMinutes,
            hour: newEventTimeHours
        });
        return datepickerValue;
    };

    var addNewEventSubmitHandler = function (callback) {
        $('#addEventForm').on('submit', function (e) {
            e.preventDefault();

            var newEventStartDate = getDateFromInputs('newEventStartDate', 'newEventStartTime');

            var newEvent = {
                start: newEventStartDate,
                content: $('#contentInput').val(),
                description: $('#descriptionInput').val()
            };

            if ($('#newEventEndDateOn').get(0).checked) {
                newEvent.end = getDateFromInputs('newEventEndDate', 'newEventEndTime');
            }

            if (callback) {
                callback(newEvent);
            }
        });
    };

    var show = function () {
        $('#addEventForm').show();
    };

    var hide = function () {
        $('#addEventForm').hide();
    };

    return {
        addNewEventSubmitHandler: addNewEventSubmitHandler,
        show: show,
        hide: hide
    };

});