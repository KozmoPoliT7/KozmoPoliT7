var m_isMobile = (navigator.userAgent.toLowerCase().match(/iphone|ipad|ipod|android|blackberry|iemobile|lg|nokia|opera mini|opera mobi|polaris|samsung|sonyericsson|symbian|windows ce|windows phone|webos/i) != null);

function fn_is_mobile() {
    var isMobile = (navigator.userAgent.toLowerCase().match(/iphone|ipad|ipod|android|blackberry|iemobile|lg|nokia|opera mini|opera mobi|polaris|samsung|sonyericsson|symbian|windows ce|windows phone|webos/i) != null);
    return isMobile;
}

function fn_is_androidapp() {
    if (navigator.userAgent == 'android-web-app') {
        return true;
    }
    return false;
}

function fn_notify_success(msg, opt) {
    if (opt == undefined) {
        opt = {
            className: 'success',
            position: "bottom center",
            globalPosition: "bottom center",
            elementPosition: "bottom center",
            showDuration: 400,
            arrowShow: true,
        };
    }
    $.notify(msg, opt);
}

function fn_notify_error(msg, opt) {
    if (opt == undefined) {
        opt = {
            className: 'error',
            position: "bottom center",
            globalPosition: "bottom center",
            elementPosition: "bottom center",
            showDuration: 400,
            arrowShow: true,
        };
    }
    $.notify(msg, opt);
}

function fn_toast_success(msg, title) {
    toastr.options = {
        "closeButton": false,
        "debug": false,
        "newestOnTop": false,
        "progressBar": true,
        "positionClass": "toast-top-full-width",
        "preventDuplicates": false,
        "onclick": null,
        "showDuration": "300",
        "hideDuration": "1000",
        "timeOut": "5000",
        "extendedTimeOut": "1000",
        "showEasing": "swing",
        "hideEasing": "linear",
        "showMethod": "fadeIn",
        "hideMethod": "fadeOut"
    };
    toastr["info"](msg, title);
}

function fn_toast_error(msg, title) {
    toastr.options = {
        "closeButton": false,
        "debug": false,
        "newestOnTop": false,
        "progressBar": true,
        "positionClass": "toast-top-full-width",
        "preventDuplicates": false,
        "onclick": null,
        "showDuration": "300",
        "hideDuration": "1000",
        "timeOut": "5000",
        "extendedTimeOut": "1000",
        "showEasing": "swing",
        "hideEasing": "linear",
        "showMethod": "fadeIn",
        "hideMethod": "fadeOut"
    };
    toastr["error"](msg, title);
}

function fn_setcookie(name, value, days) {
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        var expires = "; expires=" + date.toGMTString();
        document.cookie = name + "=" + value + expires + "; path=/";
    } else {
        var expires = "";
        document.cookie = name + "=" + value + expires + "; path=/";
    }
}

function fn_getcookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}

// if(typeof $toast === 'undefined'){
//     return;
// }
