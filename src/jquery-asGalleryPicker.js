 /*
  * asGalleryPicker
  * https://github.com/amazingSurge/jquery-asGalleryPicker
  *
  * Copyright (c) 2014 amazingSurge
  * Licensed under the GPL license.
  */
 (function($, document, window, undefined) {

     "use strict";

     var pluginName = 'asGalleryPicker';
     var Plugin = $[pluginName] = function(element, options) {
         var metas = {};

         this.element = element;
         this.$element = $(element);

         this.options = $.extend({}, Plugin.defaults, options, this.$element.data(), metas);

         // load lang strings
         if (typeof Plugin.Strings[this.options.lang] === 'undefined') {
             this.lang = 'en';
         } else {
             this.lang = this.options.lang;
         }
         this.strings = $.extend({}, Plugin.Strings[this.lang], this.options.strings);

         this.namespace = this.options.namespace;
         this.components = $.extend(true, {}, this.components);

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

         // flag
         this.disabled = false;
         this.initialed = false;

         var self = this;
         $.extend(self, {
             init: function() {
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

             _bindEvent: function() {
                 // initial
                 this.$initial.on('click', function() {
                     if (self.disabled) {
                         return;
                     }

                     self.options.add.call(self);
                     return false;
                 });

                 // add
                 this.$infoAdd.on('click', function() {
                     if (self.disabled) {
                         return;
                     }

                     self.options.add.call(self);
                     return false;
                 });

                 // info expand
                 this.$infoExpand.on('click', function() {
                     if (self.disabled) {
                         return;
                     }

                     self.$wrap.addClass(self.classes.expand).removeClass(self.classes.exist);
                     self._updateScrollbar();
                 });

                 // info
                 this.$info.on('mouseenter', function() {
                     if (self.disabled) {
                         return;
                     }

                     self.$info.addClass(self.classes.hover);
                 }).on('mouseleave', function() {
                     if (self.disabled) {
                         return;
                     }

                     self.$info.removeClass(self.classes.hover);
                 });

                 // expand close 
                 this.$expand.on('click', '.' + this.namespace + '-expand-close', function() {
                     if (self.disabled) {
                         return;
                     }
                     self.$wrap.removeClass(self.classes.expand).addClass(self.classes.exist);
                     return false;
                 });

                 // expand add
                 this.$expand.on('click', '.' + this.namespace + '-expand-add', function() {
                     if (self.disabled) {
                         return;
                     }

                     self.options.add.call(self);
                     return false;
                 });

                 // remove
                 this.$expand.on("click", '.' + this.namespace + '-item-remove', $.proxy(function(e) {
                     if (this.disabled) {
                         return;
                     }

                     this.remove($(e.currentTarget).parent().index());
                     this._updateScrollbar();
                     return false;
                 }, this));

                 // item overlay
                 this.$expand.on("mouseenter", '.' + this.namespace + '-item', $.proxy(function(e) {
                     if (this.disabled) {
                         return;
                     }

                     $(e.currentTarget).addClass(this.classes.hover);
                 }, this)).on("mouseleave", '.' + this.namespace + '-item', $.proxy(function(e) {
                     if (this.disabled) {
                         return;
                     }

                     $(e.currentTarget).removeClass(this.classes.hover);
                 }, this));

                 // change
                 this.$expand.on("click", '.' + this.namespace + '-item-change', $.proxy(function(e) {
                     if (this.disabled) {
                         return;
                     }

                     this.options.change.call(self, $(e.currentTarget).parent().index());
                     return false;
                 }, this));
             },
             _createHtml: function() {
                 this.$wrap = $(this.options.tpl().replace(/\{\{namespace\}\}/g, this.namespace)
                     .replace(/\{\{strings.placeholder\}\}/g, this.strings.placeholder)
                     .replace(/\{\{strings.add\}\}/g, this.strings.add)
                     .replace(/\{\{strings.count\}\}/g, this.strings.count)
                     .replace(/\{\{strings.expand\}\}/g, this.strings.expand));
                 this.$element.after(this.$wrap);

                 this.$initial = $('.' + this.namespace + '-initial', this.$wrap);
                 this.$info = $('.' + this.namespace + '-info', this.$wrap);
                 this.$expand = $('.' + this.namespace + '-expand', this.$wrap);

                 this.$infoCount = $('.' + this.namespace + '-info-count', this.$wrap);
                 this.$infoExpand = $('.' + this.namespace + '-info-expand', this.$wrap);
                 this.$infoAdd = $('.' + this.namespace + '-info-add', this.$wrap);
                 this.$infoImage = $('.' + this.namespace + '-info-image', this.$wrap);

                 this.$expandItems = $('.' + this.namespace + '-expand-items', this.$expand);
             },

             _trigger: function(eventType) {
                 var method_arguments = Array.prototype.slice.call(arguments, 1),
                     data;
                 if (method_arguments) {
                     data = method_arguments;
                     data.push(this);
                 } else {
                     data = this;
                 }
                 // event
                 this.$element.trigger('asGalleryPicker::' + eventType, data);
                 this.$element.trigger(eventType + '.asGalleryPicker', data);

                 // callback
                 eventType = eventType.replace(/\b\w+\b/g, function(word) {
                     return word.substring(0, 1).toUpperCase() + word.substring(1);
                 });
                 var onFunction = 'on' + eventType;
                 if (typeof self.options[onFunction] === 'function') {
                     self.options[onFunction].apply(self, method_arguments);
                 }
             },

             _update: function() {
                 this.$element.val(this.val());
                 this._trigger('change', this.value, this.options.name, pluginName);
             },

             _setState: function() {
                 $(this.$infoCount).text(this.count);
                 if (this.count > 0) {
                     this.$infoImage.attr("src", this._getImageByIndex(this.count - 1));
                     this.$wrap.removeClass(this.classes.empty);
                 } else {
                     this.$infoImage.attr("src", '');
                     this.$wrap.addClass(this.classes.empty);
                 }
             },
             _getImageByIndex: function(index) {
                 if (index < this.value.length) {
                     var item = this.value[index];
                     return this.options.getImage(item);
                 }
                 return null;
             },
             _updateList: function() {
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

             _addImage: function(item) {
                 return $('<li/>', {
                     html: '<img src="' + this.options.getImage(item) + '"/>' +
                         '<div class="' + this.namespace + '-item-change">' + this.strings.change + '</div>' +
                         '<a class="' + this.namespace + '-item-remove" href=""></a>',
                     'class': this.namespace + '-item'
                 });
             },

             _delImage: function() {
                 this.$expand.find('.' + this.namespace + '-expand-items').children().eq(this.indexed).remove();
             },

             _updateScrollbar: function() {
                 var self = this;
                 if (typeof this.$expand.data('asScrollbar') !== 'undefined') {
                     this.$expand.asScrollbar('destory');
                 }
                 this.$expand.asScrollbar({
                     namespace: self.namespace + '-expand'
                 });
             },

             _clearImages: function() {
                 this.$expand.find('.' + this.namespace + '-item').remove();
             }
         });

         this._trigger('init');
         this.init();
     };

     Plugin.prototype = {
         constructor: Plugin,
         components: {},

         val: function(value) {
             if (typeof value === 'undefined') {
                 return this.options.process(this.value);
             }

             var value_obj = this.options.parse(value);

             if (value_obj) {
                 this.set(value_obj);
             } else {
                 this.clear();
             }
         },

         set: function(value, update) {
             if ($.isArray(value)) {
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
         },

         add: function(item, update) {
             for (var key in item) {
                 this.value.push(item[key]);
             }

             this.count = this.value.length;
             this._setState();
             this._updateList();

             if (update !== false) {
                 this._update();
             }
         },

         change: function(index, value, update) {
             this.value[index] = value;
             this.$expand.find('.' + this.namespace + '-expand-items').children().eq(index).find('img').attr('src', this.options.getImage(value));
             this._setState();

             if (update !== false) {
                 this._update();
             }
         },

         remove: function(index, update) {
             this.value.splice(index, 1);
             this.count -= 1;
             this.$expand.find('.' + this.namespace + '-expand-items').children().eq(index).remove();
             this._setState();

             if (update !== false) {
                 this._update();
             }
         },

         clear: function(update) {
             this._clearImages();

             this.count = 0;
             this.value = [];
             this._setState();

             if (update !== false) {
                 this._update();
             }
         },

         get: function() {
             return this.value;
         },

         enable: function() {
             this.disabled = false;
             this.$wrap.removeClass(this.classes.disabled);
         },

         disable: function() {
             this.disabled = true;
             this.$wrap.addClass(this.classes.disabled);
         },

         destory: function() {
             this.$element.data(pluginName, null);
             this.$wrap.remove();
             this._trigger('destory');
         }
     };

     Plugin.defaults = {
         namespace: pluginName,
         skin: null,
         lang: "en",
         viewportSize: '330',
         disabled: false,

         tpl: function() {
             return '<div class="{{namespace}}">' +
                 '<div class="{{namespace}}-initial">' +
                 '<i></i>{{strings.placeholder}}' +
                 '</div>' +
                 '<div class="{{namespace}}-info">' +
                 '<img class="{{namespace}}-info-image" src="">' +
                 '<span class="{{namespace}}-info-count">{{strings.count}}</span>' +
                 '<div class="{{namespace}}-info-add">{{strings.add}}</div>' +
                 '<div class="{{namespace}}-info-expand">{{strings.expand}}</div>' +
                 '</div>' +
                 '<div class="{{namespace}}-expand">' +
                 '<a class="{{namespace}}-expand-close" href="#"></a>' +
                 '<div class="{{namespace}}-expand-add">' +
                 '<i></i>{{strings.add}}' +
                 '</div>' +
                 '<ul class="{{namespace}}-expand-items">' +
                 '</ul>' +
                 '</div>' +
                 '</div>';
         },

         process: function(value) {
             if (value) {
                 return value.join(',');
             }
             return '';
         },

         parse: function(value) {
             if (typeof value === 'string' && value.length !== 0) {
                 var array = [];
                 array = value.split(",");
                 return array;
             } else {
                 return null;
             }
         },
         getImage: function(value) {
             return value;
         },
         change: function(index) {
             return index;
         },
         add: function() {},
         onChange: function() {}
     };

     Plugin.Strings = {};

     Plugin.localize = function(lang, label) {
         Plugin.Strings[lang] = label;
     };

     Plugin.localize('en', {
         placeholder: 'Click to upload',
         count: 'zero',
         add: 'Add image',
         expand: 'expand',
         change: 'change'
     });

     Plugin.registerComponent = function(component, methods) {
         Plugin.prototype.components[component] = methods;
     };

     $.fn[pluginName] = function(options) {
         if (typeof options === 'string') {
             var method = options;
             var method_arguments = Array.prototype.slice.call(arguments, 1);

             if (/^\_/.test(method)) {
                 return false;
             } else if ((/^(get)$/.test(method)) || (method === 'val' && method_arguments.length === 0)) {
                 var api = this.first().data(pluginName);
                 if (api && typeof api[method] === 'function') {
                     return api[method].apply(api, method_arguments);
                 }
             } else {
                 return this.each(function() {
                     var api = $.data(this, pluginName);
                     if (api && typeof api[method] === 'function') {
                         api[method].apply(api, method_arguments);
                     }
                 });
             }
         } else {
             return this.each(function() {
                 if (!$.data(this, pluginName)) {
                     $.data(this, pluginName, new Plugin(this, options));
                 }
             });
         }
     };
 })(jQuery, document, window);
