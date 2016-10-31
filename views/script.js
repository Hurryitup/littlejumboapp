$(function() {
    $('.colorpicker-component').colorpicker({
        color: "red",
        format: "hex"
    });
});

$(function() {
    $('[data-format=\'Date\']').each(function() {
        $(this).datetimepicker({
            format: 'mm-dd-yyyy H:ii p',
            linkField: $(this).data('mirror'),
            linkFormat: 'yyyy-mm-ddThh:ii:ss'
        });
    });
});

function submitForm(form) {
    var formData = $(form).serializeArray().reduce(function(obj, item) {
        obj[item.name] = item.value;
        return obj;
    }, {});

    for (var key of Object.keys(formData)) {
        if ($('[name=\'' + key + '\']').data('format') == 'Date') {
            formData[key] = new Date(Date.parse(formData[key]));
        }
    }

    $.post(form.action, formData, function(response) {
        console.log(response);
    });

    console.log(formData);

    return false;
}