define('alerts/alertsService', function () {

    var alertTemplate = require('tpl!javascripts/templates/alert');
    var newHtmlAlert = function (content, type) {
        var alertType;
        if (type === null) {
            alertType = 'info';
        } else {
            alertType = type;
        }

        var alert = _.template(alertTemplate);
        return alert({
            content: content,
            alertType: alertType
        });
    };

    var addNewAlert = function (content, type) {
        var container = $('#alerts');

        container.append(newHtmlAlert(content, type));
    };

    var addNewInfoAlert = function (content) {
        addNewAlert(content, 'info');
    };

    var addNewSuccessAlert = function (content) {
        addNewAlert(content, 'success');
    };

    var addNewWarningAlert = function (content) {
        addNewAlert(content, 'warning');
    };

    var addNewDangerAlert = function (content) {
        addNewAlert(content, 'danger');
    };

    return {
        publishInfoAlert: addNewInfoAlert,
        publishSuccessAlert: addNewSuccessAlert,
        publishDangerAlert: addNewDangerAlert,
        publishWarningAlert: addNewWarningAlert
    };
});