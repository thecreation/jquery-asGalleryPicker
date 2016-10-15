/**
* jQuery asGalleryPicker v0.2.0
* https://github.com/amazingSurge/jquery-asGalleryPicker
*
* Copyright (c) amazingSurge
* Released under the LGPL-3.0 license
*/
(function(global, factory) {
  if (typeof define === "function" && define.amd) {
    define(['jquery'], factory);
  } else if (typeof exports !== "undefined") {
    factory(require('jquery'));
  } else {
    var mod = {
      exports: {}
    };
    factory(global.jQuery);
    global.jqueryAsGalleryPickerEs = mod.exports;
  }
})(this,

  function(_jquery) {
    'use strict';

    var _jquery2 = _interopRequireDefault(_jquery);

    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : {
        default: obj
      };
    }

    var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ?

      function(obj) {
        return typeof obj;
      }
      :

      function(obj) {
        return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
      };

    function _classCallCheck(instance, Constructor) {
      if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
      }
    }

    var _createClass = function() {
      function defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
          var descriptor = props[i];
          descriptor.enumerable = descriptor.enumerable || false;
          descriptor.configurable = true;

          if ("value" in descriptor)
            descriptor.writable = true;
          Object.defineProperty(target, descriptor.key, descriptor);
        }
      }

      return function(Constructor, protoProps, staticProps) {
        if (protoProps)
          defineProperties(Constructor.prototype, protoProps);

        if (staticProps)
          defineProperties(Constructor, staticProps);

        return Constructor;
      };
    }();

    /* eslint no-empty-function:"off" */
    var DEFAULTS = {
      namespace: 'asGalleryPicker',
      skin: null,
      lang: 'en',
      viewportSize: '330',
      disabled: false,

      tpl: function tpl() {
        return '<div class="{{namespace}}">' + '<div class="{{namespace}}-initial">' + '<i></i>{{strings.placeholder}}' + '</div>' + '<div class="{{namespace}}-info">' + '<img class="{{namespace}}-info-image" src="">' + '<span class="{{namespace}}-info-count">{{strings.count}}</span>' + '<div class="{{namespace}}-info-add">{{strings.add}}</div>' + '<div class="{{namespace}}-info-expand">{{strings.expand}}</div>' + '</div>' + '<div class="{{namespace}}-expand">' + '<a class="{{namespace}}-expand-close" href="#"></a>' + '<div class="{{namespace}}-expand-add">' + '<i></i>{{strings.add}}' + '</div>' + '<ul class="{{namespace}}-expand-items">' + '</ul>' + '</div>' + '</div>';
      },
      process: function process(value) {
        if (value) {

          return value.join(',');
        }

        return '';
      },
      parse: function parse(value) {
        if (typeof value === 'string' && value.length !== 0) {
          var array = [];
          array = value.split(",");

          return array;
        }

        return null;
      },
      getImage: function getImage(value) {
        return value;
      },
      change: function change(index) {
        return index;
      },
      add: function add() {},
      onChange: function onChange() {}
    };

    var NAMESPACE$1 = 'asGalleryPicker';
    var STRINGS = {};

    /**
     * Plugin constructor
     **/

    var asGalleryPicker = function() {
      function asGalleryPicker(element, options) {
        _classCallCheck(this, asGalleryPicker);

        var metas = {};

        this.element = element;
        this.$element = (0, _jquery2.default)(element);

        this.options = _jquery2.default.extend({}, DEFAULTS, options, this.$element.data(), metas);

        // load lang strings

        if (typeof STRINGS[this.options.lang] === 'undefined') {
          this.lang = 'en';
        } else {
          this.lang = this.options.lang;
        }
        this.strings = _jquery2.default.extend({}, STRINGS[this.lang], this.options.strings);

        this.namespace = this.options.namespace;
        this.components = _jquery2.default.extend(true, {}, this.components);

        this.classes = {
          // status
          skin: this.namespace + '_' + this.options.skin,
          disabled: this.namespace + '_disabled',
          active: this.namespace + '_active',
          empty: this.namespace + '_empty',
          exist: this.namespace + '_exist',
          expand: this.namespace + '_expand',
          hover: this.namespace + '_hover'
        };

        this.$element.addClass(this.namespace + '-input');
        // flag
        this.disabled = false;
        this.initialed = false;

        this._trigger('init');
        this.init();
      }

      _createClass(asGalleryPicker, [{
        key: 'init',
        value: function init() {
          this._createHtml();

          this.$expand.height(this.options.viewportSize);

          if (this.options.disabled) {
            this.disable();
          }

          if (this.options.skin) {
            this.$wrap.addClass(this.classes.skin);
          }

          var value = this.options.parse(this.$element.val());

          this.set(value, false);

          this.$wrap.addClass(this.classes.exist);

          this._bindEvent();

          this.initialed = true;
          this._trigger('ready');
        }
      }, {
        key: '_bindEvent',
        value: function _bindEvent() {
          // initial
          var that = this;
          this.$initial.on('click',

            function() {
              if (that.disabled) {

                return undefined;
              }

              that.options.add.call(that);

              return false;
            }
          );

          // add
          this.$infoAdd.on('click',

            function() {
              if (that.disabled) {

                return undefined;
              }

              that.options.add.call(that);

              return false;
            }
          );

          // info expand
          this.$infoExpand.on('click',

            function() {
              if (that.disabled) {

                return;
              }

              that.$wrap.addClass(that.classes.expand).removeClass(that.classes.exist);
              that._updateScrollbar();
            }
          );

          // info
          this.$info.on('mouseenter',

            function() {
              if (that.disabled) {

                return;
              }

              that.$info.addClass(that.classes.hover);
            }
          ).on('mouseleave',

            function() {
              if (that.disabled) {

                return;
              }

              that.$info.removeClass(that.classes.hover);
            }
          );

          // expand close
          this.$expand.on('click', '.' + this.namespace + '-expand-close',

            function() {
              if (that.disabled) {

                return undefined;
              }
              that.$wrap.removeClass(that.classes.expand).addClass(that.classes.exist);

              return false;
            }
          );

          // expand add
          this.$expand.on('click', '.' + this.namespace + '-expand-add',

            function() {
              if (that.disabled) {

                return undefined;
              }

              that.options.add.call(that);

              return false;
            }
          );

          // remove
          this.$expand.on('click', '.' + this.namespace + '-item-remove', _jquery2.default.proxy(

            function(e) {
              if (this.disabled) {

                return undefined;
              }

              this.remove((0, _jquery2.default)(e.currentTarget).parent().index());
              this._updateScrollbar();

              return false;
            }
            , this));

          // item overlay
          this.$expand.on('mouseenter', '.' + this.namespace + '-item', _jquery2.default.proxy(

            function(e) {
              if (this.disabled) {

                return;
              }

              (0, _jquery2.default)(e.currentTarget).addClass(this.classes.hover);
            }
            , this)).on('mouseleave', '.' + this.namespace + '-item', _jquery2.default.proxy(

            function(e) {
              if (this.disabled) {

                return;
              }

              (0, _jquery2.default)(e.currentTarget).removeClass(this.classes.hover);
            }
            , this));

          // change
          this.$expand.on('click', '.' + this.namespace + '-item-change', _jquery2.default.proxy(

            function(e) {
              if (this.disabled) {

                return undefined;
              }

              this.options.change.call(that, (0, _jquery2.default)(e.currentTarget).parent().index());

              return false;
            }
            , this));
        }
      }, {
        key: '_createHtml',
        value: function _createHtml() {
          this.$wrap = (0, _jquery2.default)(this.options.tpl().replace(/\{\{namespace\}\}/g, this.namespace).replace(/\{\{strings.placeholder\}\}/g, this.strings.placeholder).replace(/\{\{strings.add\}\}/g, this.strings.add).replace(/\{\{strings.count\}\}/g, this.strings.count).replace(/\{\{strings.expand\}\}/g, this.strings.expand));
          this.$element.after(this.$wrap);

          this.$initial = (0, _jquery2.default)('.' + this.namespace + '-initial', this.$wrap);
          this.$info = (0, _jquery2.default)('.' + this.namespace + '-info', this.$wrap);
          this.$expand = (0, _jquery2.default)('.' + this.namespace + '-expand', this.$wrap);

          this.$infoCount = (0, _jquery2.default)('.' + this.namespace + '-info-count', this.$wrap);
          this.$infoExpand = (0, _jquery2.default)('.' + this.namespace + '-info-expand', this.$wrap);
          this.$infoAdd = (0, _jquery2.default)('.' + this.namespace + '-info-add', this.$wrap);
          this.$infoImage = (0, _jquery2.default)('.' + this.namespace + '-info-image', this.$wrap);

          this.$expandItems = (0, _jquery2.default)('.' + this.namespace + '-expand-items', this.$expand);
        }
      }, {
        key: '_trigger',
        value: function _trigger(eventType) {
          var _ref;

          for (var _len = arguments.length, params = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
            params[_key - 1] = arguments[_key];
          }

          var data = (_ref = [this]).concat.apply(_ref, params);

          // event
          this.$element.trigger(NAMESPACE$1 + '::' + eventType, data);

          // callback
          eventType = eventType.replace(/\b\w+\b/g,

            function(word) {
              return word.substring(0, 1).toUpperCase() + word.substring(1);
            }
          );
          var onFunction = 'on' + eventType;

          if (typeof this.options[onFunction] === 'function') {
            var _options$onFunction;

            (_options$onFunction = this.options[onFunction]).apply.apply(_options$onFunction, [this].concat(params));
          }
        }
      }, {
        key: '_update',
        value: function _update() {
          this.$element.val(this.val());
          this._trigger('change', [this.value]);
        }
      }, {
        key: '_setState',
        value: function _setState() {
          (0, _jquery2.default)(this.$infoCount).text(this.count);

          if (this.count > 0) {
            this.$infoImage.attr('src', this._getImageByIndex(this.count - 1));
            this.$wrap.removeClass(this.classes.empty);
          } else {
            this.$infoImage.attr('src', '');
            this.$wrap.addClass(this.classes.empty);
          }
        }
      }, {
        key: '_getImageByIndex',
        value: function _getImageByIndex(index) {
          if (index < this.value.length) {
            var item = this.value[index];

            return this.options.getImage(item);
          }

          return null;
        }
      }, {
        key: '_updateList',
        value: function _updateList() {
          var length = this.$expand.find('.' + this.namespace + '-expand-items').children().length;

          if (this.count > length) {

            for (var i = length; i < this.count; i++) {
              this._addImage(this.value[i]).appendTo(this.$expand.find('.' + this.namespace + '-expand-items'));
            }
          } else if (this.count === length && this.count > 0) {
            var item = this.value[this.editIndex];
            this.$expand.find('.' + this.namespace + '-expand-items').children().eq(this.editIndex).html(this._addImage(item));
          } else {
            this._delImage();
          }
          this._updateScrollbar();
        }
      }, {
        key: '_addImage',
        value: function _addImage(item) {
          return (0, _jquery2.default)('<li/>', {
            html: '<img src="' + this.options.getImage(item) + '"/><div class="' + this.namespace + '-item-change">' + this.strings.change + '</div><a class="' + this.namespace + '-item-remove" href=""></a>',
            class: this.namespace + '-item'
          });
        }
      }, {
        key: '_delImage',
        value: function _delImage() {
          this.$expand.find('.' + this.namespace + '-expand-items').children().eq(this.indexed).remove();
        }
      }, {
        key: '_updateScrollbar',
        value: function _updateScrollbar() {
          if (typeof this.$expand.data('asScrollbar') !== 'undefined') {
            this.$expand.asScrollbar('destory');
          }
          this.$expand.asScrollbar({
            namespace: this.namespace + '-expand'
          });
        }
      }, {
        key: '_clearImages',
        value: function _clearImages() {
          this.$expand.find('.' + this.namespace + '-item').remove();
        }
      }, {
        key: 'val',
        value: function val(value) {
          if (typeof value === 'undefined') {

            return this.options.process(this.value);
          }

          var valueObj = this.options.parse(value);

          if (valueObj) {
            this.set(valueObj);
          } else {
            this.clear();
          }
        }
      }, {
        key: 'set',
        value: function set(value, update) {
          if (_jquery2.default.isArray(value)) {
            this.value = value;
          } else {
            this.value = [];
          }

          this._clearImages();
          this.count = this.value.length;
          this._setState();
          this._updateList();

          if (update !== false) {
            this._update();
          }
        }
      }, {
        key: 'add',
        value: function add(item, update) {
          for (var key in item) {

            if ({}.hasOwnProperty.call(item, key)) {
              this.value.push(item[key]);
            }
          }

          this.count = this.value.length;
          this._setState();
          this._updateList();

          if (update !== false) {
            this._update();
          }
        }
      }, {
        key: 'change',
        value: function change(index, value, update) {
          this.value[index] = value;
          this.$expand.find('.' + this.namespace + '-expand-items').children().eq(index).find('img').attr('src', this.options.getImage(value));
          this._setState();

          if (update !== false) {
            this._update();
          }
        }
      }, {
        key: 'remove',
        value: function remove(index, update) {
          this.value.splice(index, 1);
          this.count -= 1;
          this.$expand.find('.' + this.namespace + '-expand-items').children().eq(index).remove();
          this._setState();

          if (update !== false) {
            this._update();
          }
        }
      }, {
        key: 'clear',
        value: function clear(update) {
          this._clearImages();

          this.count = 0;
          this.value = [];
          this._setState();

          if (update !== false) {
            this._update();
          }
        }
      }, {
        key: 'get',
        value: function get() {
          return this.value;
        }
      }, {
        key: 'enable',
        value: function enable() {
          this.disabled = false;
          this.$wrap.removeClass(this.classes.disabled);
        }
      }, {
        key: 'disable',
        value: function disable() {
          this.disabled = true;
          this.$wrap.addClass(this.classes.disabled);
        }
      }, {
        key: 'destory',
        value: function destory() {
          this.$element.data(NAMESPACE$1, null);
          this.$wrap.remove();
          this._trigger('destory');
        }
      }], [{
        key: 'setDefaults',
        value: function setDefaults(options) {
          _jquery2.default.extend(DEFAULTS, _jquery2.default.isPlainObject(options) && options);
        }
      }, {
        key: 'localize',
        value: function localize(lang, label) {
          STRINGS[lang] = label;
        }
      }]);

      return asGalleryPicker;
    }();

    asGalleryPicker.localize('en', {
      placeholder: 'Click to upload',
      count: 'zero',
      add: 'Add image',
      expand: 'expand',
      change: 'change'
    });

    var info = {
      version: '0.2.0'
    };

    var NAMESPACE = 'asGalleryPicker';
    var OtherAsGalleryPicker = _jquery2.default.fn.asGalleryPicker;

    var jQueryAsGalleryPicker = function jQueryAsGalleryPicker(options) {
      var _this = this;

      for (var _len2 = arguments.length, args = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
        args[_key2 - 1] = arguments[_key2];
      }

      if (typeof options === 'string') {
        var _ret = function() {
          var method = options;

          if (/^_/.test(method)) {

            return {
              v: false
            };
          } else if (/^(get)/.test(method)) {
            var instance = _this.first().data(NAMESPACE);

            if (instance && typeof instance[method] === 'function') {

              return {
                v: instance[method].apply(instance, args)
              };
            }
          } else {

            return {
              v: _this.each(

                function() {
                  var instance = _jquery2.default.data(this, NAMESPACE);

                  if (instance && typeof instance[method] === 'function') {
                    instance[method].apply(instance, args);
                  }
                }
              )
            };
          }
        }();

        if ((typeof _ret === 'undefined' ? 'undefined' : _typeof(_ret)) === "object")

          return _ret.v;
      }

      return this.each(

        function() {
          if (!(0, _jquery2.default)(this).data(NAMESPACE)) {
            (0, _jquery2.default)(this).data(NAMESPACE, new asGalleryPicker(this, options));
          }
        }
      );
    };

    _jquery2.default.fn.asGalleryPicker = jQueryAsGalleryPicker;

    _jquery2.default.asGalleryPicker = _jquery2.default.extend({
      setDefaults: asGalleryPicker.setDefaults,
      noConflict: function noConflict() {
        _jquery2.default.fn.asGalleryPicker = OtherAsGalleryPicker;

        return jQueryAsGalleryPicker;
      }
    }, info);
  }
);