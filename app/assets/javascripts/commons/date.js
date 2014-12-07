var formatedString = function (date) {
    return date.toString("HH:mm MM-dd-yyyy");
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

