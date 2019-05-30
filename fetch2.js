function ajaxFetch(method, url, cb, options = null) {

    let data = null;
    
    if (options !== null) {
        if (options.header) {
            data = options.data;
        }
    }

    const jqueryParameters = {}

    jqueryParameters.method = method;
    jqueryParameters.url = url;
    jqueryParameters.data = data;

    $.ajax(jqueryParameters)
        .done(function (result, status, xhr) {
            cb(xhr)
        })
        .fail( function (xhr, status, error) {
            console.log("Error!!!", error)
        }  )

}

