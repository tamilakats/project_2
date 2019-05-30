function ajaxFetchA(method, url, pb, options = null) {

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
            pb(xhr)
        })
        .fail( function (xhr, status, error) {
            console.log("Error!!!", error)
        }  )

}

