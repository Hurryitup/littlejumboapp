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

function submitForm(formName, form) {
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
        var success = $('#successModal');
        var parent_model = formName.replace(/\s+/g, '');
        var parent_id = response._id;
        var qs = "?parent_model=" + parent_model + "&parent_id=" + parent_id;
        success.find('a').attr('href', function (i, val) { return val + qs});
        success.modal('show');
        console.log(response);
    });

    console.log(formData);

    return false;
}

function deleteItem(formName, form) {
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