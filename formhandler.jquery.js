;(function($) {
  "use strict";
  var placeholders = [],
      elements = [],
      form = null,
      options = {},
      isSending = false;

  var methods = {
    init: function(_options, callback) {

      form = this;

      options = $.extend({
        'ajax': false,
        'customSubmit': false,
        'enableSubmitOnSuccess': false,
        'disableSubmitOnSend': true,
        'placeholder': true,
        'validate': true
      }, _options);

      $(this).find('input, textarea').each(function(i, obj){
        elements[i] = obj;
      });

      for (var i in elements) {
        if (elements[i].type !== 'checkbox' &&
            elements[i].type !== 'radio') {
          placeholders[i] = elements[i].value;
          $(elements[i]).attr('id', i);
          $(elements[i]).focus(function(e){
            _methods.focus(e, this);
          });
          $(elements[i]).blur(function(e){
            _methods.blur(e, this);
          });
        }
      }

      if (options.customSubmit) {
        options.customSubmit.click(function() {
          $(form).submit();
        });
      }

      $(this).submit(function(e) {
        e.preventDefault();
        if (options.isSending)
          return;
        if ((options.validate && _methods.validate(this)) ||
            !options.validate) {
          if (options.disableSubmitOnSend)
            _methods.disable();
          options.isSending = true;
          var result = _methods.jsonisize();
          if (callback)
            callback(result);
          if (options.ajax)
            _methods.send(result);
        }
      });
    }
  };

  var _methods = {
    focus: function(e, obj) {
      if (obj.value === placeholders[$(obj).attr('id')])
        $(obj).val('');
    },
    blur: function(e, obj) {
      if (obj.value === '')
        $(obj).val(placeholders[$(obj).attr('id')]);
    },
    validate: function(form) {
      var err = false;
      for (var i in elements) {
        var element = elements[i];
        if (element.type === 'checkbox' ||
            element.type === 'radio')
          continue;
        if (element.value === placeholders[$(element).attr('id')] &&
            $(element).attr('required')) {
          element.focus();
          return false;
        }
        if ($(element).attr('validate')) {
          var method = $(element).attr('validate');
          method = method.charAt(0).toUpperCase() + method.substr(1, method.length);
          if (typeof _methods['is' + method] != 'undefined') {
            if (!_methods['is' + method](element.value)) {
              element.focus();
            }
          }
        }
      }
      return true;
    },
    jsonisize: function() {
      var jsonDict = {};
      for (var i in elements) {
        if (elements[i].type === 'checkbox') {
          if (elements[i].checked)
            jsonDict[elements[i].name] = 'Yes';
          else
            jsonDict[elements[i].name] = 'No';
        } else if (elements[i].type === 'radio') {
            if (elements[i].checked)
              jsonDict[elements[i].name] = elements[i].value;
        } else
        if (elements[i].type !== 'submit')
          jsonDict[elements[i].name] = elements[i].value;
      }
     return jsonDict;
    },
    disable: function() {
      if (options.customSubmit)
        $(options.customSubmit).addClass('disabled');
      $(form).find(':submit').attr('disabled', 'disabled');
    },
    enable: function() {
      if (options.customSubmit)
        $(options.customSubmit).removeClass('disabled');
      $(form).find(':submit').removeAttr('disabled');
    },
    send: function(data) {
      $.ajax({
        url: options.ajax.action,
        type: 'post',
        dataType: 'json',
        data: {
          action: options.ajax.method || 'form',
          data: data
        },
        success: function(r) {
          options.isSending = false;
          if (options.enableSubmitOnSuccess)
            _methods.enable();
          if (options.ajax.success)
            options.ajax.success(r);
        }
      });
    }
  };
  
  $.fn.FormHandler = function(method, callback) {
    if (typeof method === 'object') {
      return methods.init.apply(this, arguments, callback);
    } else if (typeof method === 'undefined')
      return methods.init.apply(this);
    else
      $.error('Unable to call method "' + method + '"');
  };
})(jQuery);