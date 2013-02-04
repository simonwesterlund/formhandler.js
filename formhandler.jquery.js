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
        'placeholder': true,
        'preventDoublePost': true,
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
      }
      return true;
    },

    jsonisize: function() {
      var temp = {};
      for (var i in elements) {
        if (elements[i].type === 'checkbox') {
          if (elements[i].checked)
            temp[elements[i].name] = 'Yes';
          else
            temp[elements[i].name] = 'No';
        } else
        temp[elements[i].name] = elements[i].value;
      }
     return temp;
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
          action: 'form',
          data: JSON.stringify(data)
        },
        success: function(r) {
          options.isSending = false;
          //_methods.enable();
          if (options.ajax.success)
            options.ajax.success(r);
        }
      });
    }
  };
  
  $.fn.FormHandler = function(method, callback) {

    if (typeof method === 'object') {
      return methods.init.apply(this,
                                arguments, callback);
    } else if (typeof method === 'undefined')
      return methods.init.apply(this);
    else
      $.error('Unable to call method "' + method + '"');

  };
})(jQuery);