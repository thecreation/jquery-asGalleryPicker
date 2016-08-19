/**
* jQuery asGalleryPicker
* a jquery plugin
* Compiled: Fri Aug 19 2016 09:54:20 GMT+0800 (CST)
* @version v0.1.2
* @link https://github.com/amazingSurge/jquery-asGalleryPicker
* @copyright LGPL-3.0
*/
import $ from 'jQuery';

var defaults = {
  namespace: '',
  skin: null,
  lang: 'en',
  viewportSize: '330',
  disabled: false,

  tpl() {
    'use strict';
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

  process(value) {
    'use strict';
    if (value) {
      return value.join(',');
    }
    return '';
  },

  parse(value) {
    'use strict';
    if (typeof value === 'string' && value.length !== 0) {
      let array = [];
      array = value.split(",");
      return array;
    }
    return null;
  },
  getImage(value) {
    'use strict';
    return value;
  },
  change(index) {
    'use strict';
    return index;
  },
  add() {},
  onChange() {}
};

const pluginName = 'asGalleryPicker';
 defaults.namespace = pluginName;

 class asGalleryPicker {
   constructor(element, options) {
     const metas = {};

     this.element = element;
     this.$element = $(element);

     this.options = $.extend({}, defaults, options, this.$element.data(), metas);

     // load lang strings
     if (typeof asGalleryPicker.Strings[this.options.lang] === 'undefined') {
       this.lang = 'en';
     } else {
       this.lang = this.options.lang;
     }
     this.strings = $.extend({}, asGalleryPicker.Strings[this.lang], this.options.strings);

     this.namespace = this.options.namespace;
     this.components = $.extend(true, {}, this.components);

     this.classes = {
       // status
       skin: `${this.namespace}_${this.options.skin}`,
       disabled: `${this.namespace}_disabled`,
       active: `${this.namespace}_active`,
       empty: `${this.namespace}_empty`,
       exist: `${this.namespace}_exist`,
       expand: `${this.namespace}_expand`,
       hover: `${this.namespace}_hover`
     };

     this.$element.addClass(`${this.namespace}-input`);
     // flag
     this.disabled = false;
     this.initialed = false;

     const self = this;
     $.extend(self, {
       init() {
         this._createHtml();

         this.$expand.height(this.options.viewportSize);

         if (this.options.disabled) {
           this.disable();
         }

         if (this.options.skin) {
           this.$wrap.addClass(this.classes.skin);
         }

         const value = this.options.parse(this.$element.val());

         this.set(value, false);

         this.$wrap.addClass(this.classes.exist);

         this._bindEvent();

         this.initialed = true;
         this._trigger('ready');
       },

       _bindEvent() {
         // initial
         this.$initial.on('click', () => {
           if (self.disabled) {
             return undefined;
           }

           self.options.add.call(self);
           return false;
         });

         // add
         this.$infoAdd.on('click', () => {
           if (self.disabled) {
             return undefined;
           }

           self.options.add.call(self);
           return false;
         });

         // info expand
         this.$infoExpand.on('click', () => {
           if (self.disabled) {
             return ;
           }

           self.$wrap.addClass(self.classes.expand).removeClass(self.classes.exist);
           self._updateScrollbar();
         });

         // info
         this.$info.on('mouseenter', () => {
           if (self.disabled) {
             return ;
           }

           self.$info.addClass(self.classes.hover);
         }).on('mouseleave', () => {
           if (self.disabled) {
             return;
           }

           self.$info.removeClass(self.classes.hover);
         });

         // expand close
         this.$expand.on('click', `.${this.namespace}-expand-close`, () => {
           if (self.disabled) {
             return undefined;
           }
           self.$wrap.removeClass(self.classes.expand).addClass(self.classes.exist);
           return false;
         });

         // expand add
         this.$expand.on('click', `.${this.namespace}-expand-add`, () => {
           if (self.disabled) {
             return undefined;
           }

           self.options.add.call(self);
           return false;
         });

         // remove
         this.$expand.on('click', `.${this.namespace}-item-remove`, $.proxy(function(e) {
           if (this.disabled) {
             return undefined;
           }

           this.remove($(e.currentTarget).parent().index());
           this._updateScrollbar();
           return false;
         }, this));

         // item overlay
         this.$expand.on('mouseenter', `.${this.namespace}-item`, $.proxy(function(e) {
           if (this.disabled) {
             return ;
           }

           $(e.currentTarget).addClass(this.classes.hover);
         }, this)).on('mouseleave', `.${this.namespace}-item`, $.proxy(function(e) {
           if (this.disabled) {
             return ;
           }

           $(e.currentTarget).removeClass(this.classes.hover);
         }, this));

         // change
         this.$expand.on('click', `.${this.namespace}-item-change`, $.proxy(function(e) {
           if (this.disabled) {
             return undefined;
           }

           this.options.change.call(self, $(e.currentTarget).parent().index());
           return false;
         }, this));
       },
       _createHtml() {
         this.$wrap = $(this.options.tpl().replace(/\{\{namespace\}\}/g, this.namespace)
           .replace(/\{\{strings.placeholder\}\}/g, this.strings.placeholder)
           .replace(/\{\{strings.add\}\}/g, this.strings.add)
           .replace(/\{\{strings.count\}\}/g, this.strings.count)
           .replace(/\{\{strings.expand\}\}/g, this.strings.expand));
         this.$element.after(this.$wrap);

         this.$initial = $(`.${this.namespace}-initial`, this.$wrap);
         this.$info = $(`.${this.namespace}-info`, this.$wrap);
         this.$expand = $(`.${this.namespace}-expand`, this.$wrap);

         this.$infoCount = $(`.${this.namespace}-info-count`, this.$wrap);
         this.$infoExpand = $(`.${this.namespace}-info-expand`, this.$wrap);
         this.$infoAdd = $(`.${this.namespace}-info-add`, this.$wrap);
         this.$infoImage = $(`.${this.namespace}-info-image`, this.$wrap);

         this.$expandItems = $(`.${this.namespace}-expand-items`, this.$expand);
       },

       _trigger(eventType, ...args) {
         const data = [this].concat(args);

         // event
         this.$element.trigger(`asGalleryPicker::${eventType}`, data);

         // callback
         eventType = eventType.replace(/\b\w+\b/g, word => word.substring(0, 1).toUpperCase() + word.substring(1));
         const onFunction = `on${eventType}`;
         if (typeof self.options[onFunction] === 'function') {
           self.options[onFunction](...args);
         }
       },

       _update() {
         this.$element.val(this.val());
         this._trigger('change', this.value, this.options.name, pluginName);
       },

       _setState() {
         $(this.$infoCount).text(this.count);
         if (this.count > 0) {
           this.$infoImage.attr('src', this._getImageByIndex(this.count - 1));
           this.$wrap.removeClass(this.classes.empty);
         } else {
           this.$infoImage.attr('src', '');
           this.$wrap.addClass(this.classes.empty);
         }
       },
       _getImageByIndex(index) {
         if (index < this.value.length) {
           const item = this.value[index];
           return this.options.getImage(item);
         }
         return null;
       },
       _updateList() {
         const length = this.$expand.find(`.${this.namespace}-expand-items`).children().length;
         if (this.count > length) {
           for (let i = length; i < this.count; i++) {
             this._addImage(this.value[i]).appendTo(this.$expand.find(`.${this.namespace}-expand-items`));
           }
         } else if (this.count === length && this.count > 0) {
           const item = this.value[this.editIndex];
           this.$expand.find(`.${this.namespace}-expand-items`).children().eq(this.editIndex).html(this._addImage(item));
         } else {
           this._delImage();
         }
         this._updateScrollbar();
       },

       _addImage(item) {
         return $('<li/>', {
           html: `<img src="${this.options.getImage(item)}"/><div class="${this.namespace}-item-change">${this.strings.change}</div><a class="${this.namespace}-item-remove" href=""></a>`,
           class: `${this.namespace}-item`
         });
       },

       _delImage() {
         this.$expand.find(`.${this.namespace}-expand-items`).children().eq(this.indexed).remove();
       },

       _updateScrollbar() {
         const self = this;
         if (typeof this.$expand.data('asScrollbar') !== 'undefined') {
           this.$expand.asScrollbar('destory');
         }
         this.$expand.asScrollbar({
           namespace: `${self.namespace}-expand`
         });
       },

       _clearImages() {
         this.$expand.find(`.${this.namespace}-item`).remove();
       }
     });

     this._trigger('init');
     this.init();
   }

   val(value) {
     if (typeof value === 'undefined') {
       return this.options.process(this.value);
     }

     const valueObj = this.options.parse(value);

     if (valueObj) {
       this.set(valueObj);
     } else {
       this.clear();
     }
   }

   set(value, update) {
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
   }

   add(item, update) {
     for (const key in item) {
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

   change(index, value, update) {
     this.value[index] = value;
     this.$expand.find(`.${this.namespace}-expand-items`).children().eq(index).find('img').attr('src', this.options.getImage(value));
     this._setState();

     if (update !== false) {
       this._update();
     }
   }

   remove(index, update) {
     this.value.splice(index, 1);
     this.count -= 1;
     this.$expand.find(`.${this.namespace}-expand-items`).children().eq(index).remove();
     this._setState();

     if (update !== false) {
       this._update();
     }
   }

   clear(update) {
     this._clearImages();

     this.count = 0;
     this.value = [];
     this._setState();

     if (update !== false) {
       this._update();
     }
   }

   get() {
     return this.value;
   }

   enable() {
     this.disabled = false;
     this.$wrap.removeClass(this.classes.disabled);
   }

   disable() {
     this.disabled = true;
     this.$wrap.addClass(this.classes.disabled);
   }

   destory() {
     this.$element.data(pluginName, null);
     this.$wrap.remove();
     this._trigger('destory');
   }

   static _jQueryInterface(options, ...args) {
     if (typeof options === 'string') {
       if (/^\_/.test(options)) {
         return false;
       } else if ((/^(get)$/.test(options)) || (options === 'val' && args.length === 0)) {
         const api = this.first().data(pluginName);
         if (api && typeof api[options] === 'function') {
           return api[options](...args);
         }
       } else {
         return this.each(function() {
           const api = $.data(this, pluginName);
           if (api && typeof api[options] === 'function') {
             api[options](...args);
           }
         });
       }
     } else {
       return this.each(function() {
         if (!$.data(this, pluginName)) {
           $.data(this, pluginName, new asGalleryPicker(this, options));
         }
       });
     }
   }
 }

 asGalleryPicker.defaults = {};

 asGalleryPicker.Strings = {};

 asGalleryPicker.localize = (lang, label) => {
   asGalleryPicker.Strings[lang] = label;
 };

 asGalleryPicker.localize('en', {
   placeholder: 'Click to upload',
   count: 'zero',
   add: 'Add image',
   expand: 'expand',
   change: 'change'
 });

 $.fn[pluginName] = asGalleryPicker._jQueryInterface;
 $.fn[pluginName].constructor = asGalleryPicker;
 $.fn[pluginName].noConflict = () => {
   'use strict';
   $.fn[pluginName] = window.JQUERY_NO_CONFLICT;
   return asGalleryPicker._jQueryInterface;
 };

export default asGalleryPicker;