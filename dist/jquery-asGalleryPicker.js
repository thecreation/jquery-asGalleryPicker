/**
* jQuery asGalleryPicker
* a jquery plugin
* Compiled: Fri Aug 19 2016 09:54:20 GMT+0800 (CST)
* @version v0.1.2
* @link https://github.com/amazingSurge/jquery-asGalleryPicker
* @copyright LGPL-3.0
*/
(function(global, factory) {
  if (typeof define === "function" && define.amd) {
    define(['exports', 'jQuery'], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require('jQuery'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.jQuery);
    global.jqueryAsGalleryPicker = mod.exports;
  }
})(this,

  function(exports, _jQuery) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
      value: true
    });

    var _jQuery2 = _interopRequireDefault(_jQuery);

    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : {
        default: obj
      };
    }

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

    var defaults = {
      namespace: '',
      skin: null,
      lang: 'en',
      viewportSize: '330',
      disabled: false,

      tpl: function tpl() {
        'use strict';

        return '<div class="{{namespace}}">' + '<div class="{{namespace}}-initial">' + '<i></i>{{strings.placeholder}}' + '</div>' + '<div class="{{namespace}}-info">' + '<img class="{{namespace}}-info-image" src="">' + '<span class="{{namespace}}-info-count">{{strings.count}}</span>' + '<div class="{{namespace}}-info-add">{{strings.add}}</div>' + '<div class="{{namespace}}-info-expand">{{strings.expand}}</div>' + '</div>' + '<div class="{{namespace}}-expand">' + '<a class="{{namespace}}-expand-close" href="#"></a>' + '<div class="{{namespace}}-expand-add">' + '<i></i>{{strings.add}}' + '</div>' + '<ul class="{{namespace}}-expand-items">' + '</ul>' + '</div>' + '</div>';
      },
      process: function process(value) {
        'use strict';

        if (value) {

          return value.join(',');
        }

        return '';
      },
      parse: function parse(value) {
        'use strict';

        if (typeof value === 'string' && value.length !== 0) {
          var array = [];
          array = value.split(",");

          return array;
        }

        return null;
      },
      getImage: function getImage(value) {
        'use strict';

        return value;
      },
      change: function change(index) {
        'use strict';

        return index;
      },
      add: function add() {},
      onChange: function onChange() {}
    };

    var pluginName = 'asGalleryPicker';
    defaults.namespace = pluginName;

    var asGalleryPicker = function() {
      function asGalleryPicker(element, options) {
        _classCallCheck(this, asGalleryPicker);

        var metas = {};

        this.element = element;
        this.$element = (0, _jQuery2.default)(element);

        this.options = _jQuery2.default.extend({}, defaults, options, this.$element.data(), metas);

        // load lang strings

        if (typeof asGalleryPicker.Strings[this.options.lang] === 'undefined') {
          this.lang = 'en';
        } else {
          this.lang = this.options.lang;
        }
        this.strings = _jQuery2.default.extend({}, asGalleryPicker.Strings[this.lang], this.options.strings);

        this.namespace = this.options.namespace;
        this.components = _jQuery2.default.extend(true, {}, this.components);

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

        var self = this;
        _jQuery2.default.extend(self, {
          init: function init() {
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
          },
          _bindEvent: function _bindEvent() {
            // initial
            this.$initial.on('click',

              function() {
                if (self.disabled) {

                  return undefined;
                }

                self.options.add.call(self);

                return false;
              }
            );

            // add
            this.$infoAdd.on('click',

              function() {
                if (self.disabled) {

                  return undefined;
                }

                self.options.add.call(self);

                return false;
              }
            );

            // info expand
            this.$infoExpand.on('click',

              function() {
                if (self.disabled) {

                  return;
                }

                self.$wrap.addClass(self.classes.expand).removeClass(self.classes.exist);
                self._updateScrollbar();
              }
            );

            // info
            this.$info.on('mouseenter',

              function() {
                if (self.disabled) {

                  return;
                }

                self.$info.addClass(self.classes.hover);
              }
            ).on('mouseleave',

              function() {
                if (self.disabled) {

                  return;
                }

                self.$info.removeClass(self.classes.hover);
              }
            );

            // expand close
            this.$expand.on('click', '.' + this.namespace + '-expand-close',

              function() {
                if (self.disabled) {

                  return undefined;
                }
                self.$wrap.removeClass(self.classes.expand).addClass(self.classes.exist);

                return false;
              }
            );

            // expand add
            this.$expand.on('click', '.' + this.namespace + '-expand-add',

              function() {
                if (self.disabled) {

                  return undefined;
                }

                self.options.add.call(self);

                return false;
              }
            );

            // remove
            this.$expand.on('click', '.' + this.namespace + '-item-remove', _jQuery2.default.proxy(

              function(e) {
                if (this.disabled) {

                  return undefined;
                }

                this.remove((0, _jQuery2.default)(e.currentTarget).parent().index());
                this._updateScrollbar();

                return false;
              }
              , this));

            // item overlay
            this.$expand.on('mouseenter', '.' + this.namespace + '-item', _jQuery2.default.proxy(

              function(e) {
                if (this.disabled) {

                  return;
                }

                (0, _jQuery2.default)(e.currentTarget).addClass(this.classes.hover);
              }
              , this)).on('mouseleave', '.' + this.namespace + '-item', _jQuery2.default.proxy(

              function(e) {
                if (this.disabled) {

                  return;
                }

                (0, _jQuery2.default)(e.currentTarget).removeClass(this.classes.hover);
              }
              , this));

            // change
            this.$expand.on('click', '.' + this.namespace + '-item-change', _jQuery2.default.proxy(

              function(e) {
                if (this.disabled) {

                  return undefined;
                }

                this.options.change.call(self, (0, _jQuery2.default)(e.currentTarget).parent().index());

                return false;
              }
              , this));
          },
          _createHtml: function _createHtml() {
            this.$wrap = (0, _jQuery2.default)(this.options.tpl().replace(/\{\{namespace\}\}/g, this.namespace).replace(/\{\{strings.placeholder\}\}/g, this.strings.placeholder).replace(/\{\{strings.add\}\}/g, this.strings.add).replace(/\{\{strings.count\}\}/g, this.strings.count).replace(/\{\{strings.expand\}\}/g, this.strings.expand));
            this.$element.after(this.$wrap);

            this.$initial = (0, _jQuery2.default)('.' + this.namespace + '-initial', this.$wrap);
            this.$info = (0, _jQuery2.default)('.' + this.namespace + '-info', this.$wrap);
            this.$expand = (0, _jQuery2.default)('.' + this.namespace + '-expand', this.$wrap);

            this.$infoCount = (0, _jQuery2.default)('.' + this.namespace + '-info-count', this.$wrap);
            this.$infoExpand = (0, _jQuery2.default)('.' + this.namespace + '-info-expand', this.$wrap);
            this.$infoAdd = (0, _jQuery2.default)('.' + this.namespace + '-info-add', this.$wrap);
            this.$infoImage = (0, _jQuery2.default)('.' + this.namespace + '-info-image', this.$wrap);

            this.$expandItems = (0, _jQuery2.default)('.' + this.namespace + '-expand-items', this.$expand);
          },
          _trigger: function _trigger(eventType) {
            for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
              args[_key - 1] = arguments[_key];
            }

            var data = [this].concat(args);

            // event
            this.$element.trigger('asGalleryPicker::' + eventType, data);

            // callback
            eventType = eventType.replace(/\b\w+\b/g,

              function(word) {
                return word.substring(0, 1).toUpperCase() + word.substring(1);
              }
            );
            var onFunction = 'on' + eventType;

            if (typeof self.options[onFunction] === 'function') {
              var _self$options;

              (_self$options = self.options)[onFunction].apply(_self$options, args);
            }
          },
          _update: function _update() {
            this.$element.val(this.val());
            this._trigger('change', this.value, this.options.name, pluginName);
          },
          _setState: function _setState() {
            (0, _jQuery2.default)(this.$infoCount).text(this.count);

            if (this.count > 0) {
              this.$infoImage.attr('src', this._getImageByIndex(this.count - 1));
              this.$wrap.removeClass(this.classes.empty);
            } else {
              this.$infoImage.attr('src', '');
              this.$wrap.addClass(this.classes.empty);
            }
          },
          _getImageByIndex: function _getImageByIndex(index) {
            if (index < this.value.length) {
              var item = this.value[index];

              return this.options.getImage(item);
            }

            return null;
          },
          _updateList: function _updateList() {
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
          },
          _addImage: function _addImage(item) {
            return (0, _jQuery2.default)('<li/>', {
              html: '<img src="' + this.options.getImage(item) + '"/><div class="' + this.namespace + '-item-change">' + this.strings.change + '</div><a class="' + this.namespace + '-item-remove" href=""></a>',
              class: this.namespace + '-item'
            });
          },
          _delImage: function _delImage() {
            this.$expand.find('.' + this.namespace + '-expand-items').children().eq(this.indexed).remove();
          },
          _updateScrollbar: function _updateScrollbar() {
            var self = this;

            if (typeof this.$expand.data('asScrollbar') !== 'undefined') {
              this.$expand.asScrollbar('destory');
            }
            this.$expand.asScrollbar({
              namespace: self.namespace + '-expand'
            });
          },
          _clearImages: function _clearImages() {
            this.$expand.find('.' + this.namespace + '-item').remove();
          }
        });

        this._trigger('init');
        this.init();
      }

      _createClass(asGalleryPicker, [{
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
          if (_jQuery2.default.isArray(value)) {
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
          this.$element.data(pluginName, null);
          this.$wrap.remove();
          this._trigger('destory');
        }
      }], [{
        key: '_jQueryInterface',
        value: function _jQueryInterface(options) {
          for (var _len2 = arguments.length, args = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
            args[_key2 - 1] = arguments[_key2];
          }

          if (typeof options === 'string') {

            if (/^\_/.test(options)) {

              return false;
            } else if (/^(get)$/.test(options) || options === 'val' && args.length === 0) {
              var api = this.first().data(pluginName);

              if (api && typeof api[options] === 'function') {

                return api[options].apply(api, args);
              }
            } else {

              return this.each(

                function() {
                  var api = _jQuery2.default.data(this, pluginName);

                  if (api && typeof api[options] === 'function') {
                    api[options].apply(api, args);
                  }
                }
              );
            }
          } else {

            return this.each(

              function() {
                if (!_jQuery2.default.data(this, pluginName)) {
                  _jQuery2.default.data(this, pluginName, new asGalleryPicker(this, options));
                }
              }
            );
          }
        }
      }]);

      return asGalleryPicker;
    }();

    asGalleryPicker.defaults = {};

    asGalleryPicker.Strings = {};

    asGalleryPicker.localize = function(lang, label) {
      asGalleryPicker.Strings[lang] = label;
    }
    ;

    asGalleryPicker.localize('en', {
      placeholder: 'Click to upload',
      count: 'zero',
      add: 'Add image',
      expand: 'expand',
      change: 'change'
    });

    _jQuery2.default.fn[pluginName] = asGalleryPicker._jQueryInterface;
    _jQuery2.default.fn[pluginName].constructor = asGalleryPicker;
    _jQuery2.default.fn[pluginName].noConflict = function() {
      'use strict';

      _jQuery2.default.fn[pluginName] = window.JQUERY_NO_CONFLICT;

      return asGalleryPicker._jQueryInterface;
    }
    ;

    exports.default = asGalleryPicker;
  }
);