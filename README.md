formhandler.js
==============
_– a simple jQuery form plugin_

## Usage
Include the following as you usually do:

    <script type="text/javascript" src="jquery.min.js"></script>
    <script type="text/javascript" src="formhandler.jquery.js"></script>

And then, call the plugin like this:

    $(yourForm).FormHandler({
        ajax: { // default: false. This will send all data as a JSON-object
            action: '' // Path to endpoint file
            method: '' // default: 'form'. This is the endpoint method.
                       // i.e. the request will be:
                       // data: {action: method, data:formData}
            success: function (r) {// Callback if got a return from endpoint.
                                   // variable r will contain the response
                // Some code to fadeout stuff if successful
        },
        customSubmit: $(yourCustomSubmitButton),
        enableSubmitOnSuccess: false, // default: false.
        disableSubmitOnSend: true, // default true.
        placeholder: true // default: true. Save all values in the form as
                          // placeholders, this is useful when you don't have
                          // access to html5 placeholders
        validate: true // default: true. This will only validate if not empty
    }, function(r){
        // This is a callback containing all data from the fields
        // r = {"field_name": "field_value", "checkbox_name": "checked"} etc.
    });
