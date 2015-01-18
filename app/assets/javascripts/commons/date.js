var formattedString = function (date) {
    return date != null ? date.toString("HH:mm dd-MM-yyyy") : null;
};

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

