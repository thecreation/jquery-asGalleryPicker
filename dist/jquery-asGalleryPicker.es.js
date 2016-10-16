/**
* jQuery asGalleryPicker v0.2.1
* https://github.com/amazingSurge/jquery-asGalleryPicker
*
* Copyright (c) amazingSurge
* Released under the LGPL-3.0 license
*/
import $ from 'jquery';

/* eslint no-empty-function:"off" */
var DEFAULTS = {
  namespace: 'asGalleryPicker',
  skin: null,
  lang: 'en',
  viewportSize: '330',
  disabled: false,

  tpl() {
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
    if (value) {
      return value.join(',');
    }
    return '';
  },

  parse(value) {
    if (typeof value === 'string' && value.length !== 0) {
      let array = [];
      array = value.split(",");
      return array;
    }
    return null;
  },
  getImage(value) {
    return value;
  },
  change(index) {
    return index;
  },
  add() {},
  onChange() {}
};

const NAMESPACE$1 = 'asGalleryPicker';
const STRINGS = {};

/**
 * Plugin constructor
 **/
class asGalleryPicker {
  constructor(element, options) {
    const metas = {};

     this.element = element;
     this.$element = $(element);

     this.options = $.extend({}, DEFAULTS, options, this.$element.data(), metas);

     // load lang strings
     if (typeof STRINGS[this.options.lang] === 'undefined') {
       this.lang = 'en';
     } else {
       this.lang = this.options.lang;
     }
     this.strings = $.extend({}, STRINGS[this.lang], this.options.strings);

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

     this._trigger('init');
     this.init();
  }

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
  }

  _bindEvent() {
    // initial
    const that = this;
    this.$initial.on('click', () => {
      if (that.disabled) {
        return undefined;
      }

      that.options.add.call(that);
      return false;
    });

    // add
    this.$infoAdd.on('click', () => {
      if (that.disabled) {
        return undefined;
      }

      that.options.add.call(that);
      return false;
    });

    // info expand
    this.$infoExpand.on('click', () => {
      if (that.disabled) {
        return ;
      }

      that.$wrap.addClass(that.classes.expand).removeClass(that.classes.exist);
      that._updateScrollbar();
    });

    // info
    this.$info.on('mouseenter', () => {
      if (that.disabled) {
        return ;
      }

      that.$info.addClass(that.classes.hover);
    }).on('mouseleave', () => {
      if (that.disabled) {
        return;
      }

      that.$info.removeClass(that.classes.hover);
    });

    // expand close
    this.$expand.on('click', `.${this.namespace}-expand-close`, () => {
      if (that.disabled) {
        return undefined;
      }
      that.$wrap.removeClass(that.classes.expand).addClass(that.classes.exist);
      return false;
    });

    // expand add
    this.$expand.on('click', `.${this.namespace}-expand-add`, () => {
      if (that.disabled) {
        return undefined;
      }

      that.options.add.call(that);
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

      this.options.change.call(that, $(e.currentTarget).parent().index());
      return false;
    }, this));
  }

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
  }

  _trigger(eventType, ...params) {
    let data = [this].concat(...params);

    // event
    this.$element.trigger(`${NAMESPACE$1}::${eventType}`, data);

    // callback
    eventType = eventType.replace(/\b\w+\b/g, (word) => {
      return word.substring(0, 1).toUpperCase() + word.substring(1);
    });
    let onFunction = `on${eventType}`;

    if (typeof this.options[onFunction] === 'function') {
      this.options[onFunction].apply(this, ...params);
    }
  }

  _update() {
    this.$element.val(this.val());
    this._trigger('change', [this.value]);
  }

  _setState() {
   $(this.$infoCount).text(this.count);
    if (this.count > 0) {
      this.$infoImage.attr('src', this._getImageByIndex(this.count - 1));
      this.$wrap.removeClass(this.classes.empty);
    } else {
      this.$infoImage.attr('src', '');
      this.$wrap.addClass(this.classes.empty);
    }
  }

  _getImageByIndex(index) {
    if (index < this.value.length) {
      const item = this.value[index];
      return this.options.getImage(item);
    }
    return null;
  }

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
  }

  _addImage(item) {
    return $('<li/>', {
      html: `<img src="${this.options.getImage(item)}"/><div class="${this.namespace}-item-change">${this.strings.change}</div><a class="${this.namespace}-item-remove" href=""></a>`,
      class: `${this.namespace}-item`
    });
  }

  _delImage() {
    this.$expand.find(`.${this.namespace}-expand-items`).children().eq(this.indexed).remove();
  }

  _updateScrollbar() {
    if (typeof this.$expand.data('asScrollbar') !== 'undefined') {
      this.$expand.asScrollbar('destory');
    }
    this.$expand.asScrollbar({
      namespace: `${this.namespace}-expand`
    });
  }

  _clearImages() {
    this.$expand.find(`.${this.namespace}-item`).remove();
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
    this.$element.data(NAMESPACE$1, null);
    this.$wrap.remove();
    this._trigger('destory');
  }

  static setDefaults(options) {
    $.extend(DEFAULTS, $.isPlainObject(options) && options);
  }

  static localize(lang, label) {
    STRINGS[lang] = label;
  }
}

asGalleryPicker.localize('en', {
  placeholder: 'Click to upload',
  count: 'zero',
  add: 'Add image',
  expand: 'expand',
  change: 'change'
});

var info = {
  version:'0.2.1'
};

const NAMESPACE = 'asGalleryPicker';
const OtherAsGalleryPicker = $.fn.asGalleryPicker;

const jQueryAsGalleryPicker = function(options, ...args) {
  if (typeof options === 'string') {
    const method = options;

    if (/^_/.test(method)) {
      return false;
    } else if ((/^(get)$/.test(method)) || (method === 'val' && method_arguments.length === 0)) {
      const instance = this.first().data(NAMESPACE);
      if (instance && typeof instance[method] === 'function') {
        return instance[method](...args);
      }
    } else {
      return this.each(function() {
        const instance = $.data(this, NAMESPACE);
        if (instance && typeof instance[method] === 'function') {
          instance[method](...args);
        }
      });
    }
  }

  return this.each(function() {
    if (!$(this).data(NAMESPACE)) {
      $(this).data(NAMESPACE, new asGalleryPicker(this, options));
    }
  });
};

$.fn.asGalleryPicker = jQueryAsGalleryPicker;

$.asGalleryPicker = $.extend({
  setDefaults: asGalleryPicker.setDefaults,
  noConflict: function() {
    $.fn.asGalleryPicker = OtherAsGalleryPicker;
    return jQueryAsGalleryPicker;
  }
}, info);
