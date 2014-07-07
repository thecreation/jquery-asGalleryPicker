/*! jQuery plugin - v0.1.1 - 2014-07-07
* https://github.com/amazingSurge/jquery-asGalleryPicker
* Copyright (c) 2014 amazingSurge; Licensed GPL */
(function($, document, window, undefined) {

    "use strict";

    var pluginName = 'asGalleryPicker';
    // main constructor
    var Plugin = $[pluginName] = function(element, options) {
        var metas = {};

        this.element = element;
        this.$element = $(element);

        this.options = $.extend({}, Plugin.defaults, options, this.$element.data(), metas);
        this.namespace = this.options.namespace;
        this.components = $.extend(true, {}, this.components);

        // public properties

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
                if (this.options.disabled) {
                    this.disable();
                }

                if (this.options.skin) {
                    this.$wrap.addClass(this.classes.skin);
                }

                this.$wrap.addClass(this.classes.exist).addClass(this.classes.empty);

                var value = this.$element.val();
                this.value = this.options.parse(value);

                if(this.value){
                    this.count = this.value.length;
                } else {
                    this.count = 0;
                }

                if(this.count > 0) {
                    this._setImages(this.value);
                }

                this._bindEvent();

                this.initialed = true;
                // after init end trigger 'ready'
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
                    self._scrollbar();
                })

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
                this.$expandClose.on("click", function() {
                    if (self.disabled) {
                        return;
                    }
                    self.$wrap.removeClass(self.classes.expand).addClass(self.classes.exist);
                    return false;
                });

                // expand add
                this.$expandAdd.on("click", function() {
                    if (self.disabled) {
                        return;
                    }

                    self.options.add.call(self);
                    self._scrollbar();
                    return false;
                })

                // remove
                this.$expand.on("click", '.' + this.namespace + '-item-remove', $.proxy(function(e) {
                    if (this.disabled) {
                        return;
                    }

                    this.remove($(e.currentTarget).parent().index());
                    this._scrollbar();
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
                this.$wrap = $(this.options.tpl().replace(/\{\{namespace\}\}/g, this.namespace));
                this.$element.after(this.$wrap);

                this.$initial = $('.' + this.namespace + '-initial', this.$wrap);
                this.$info = $('.' + this.namespace + '-info', this.$wrap);
                this.$expand = $('.' + this.namespace + '-expand', this.$wrap);

                this.$infoCount = $('.' + this.namespace + '-info-count', this.$wrap);
                this.$infoExpand = $('.' + this.namespace + '-info-expand', this.$wrap);
                this.$infoAdd = $('.' + this.namespace + '-info-add', this.$wrap);
                this.$infoImage = $('.' + this.namespace + '-info-image', this.$wrap);

                this.$expandClose = $('.' + this.namespace + '-expand-close', this.$expand);
                this.$expandAdd = $('.' + this.namespace + '-expand-add', this.$expand);
                this.$expandItems = $('.' + this.namespace + '-expand-items', this.$expand);
            },

            _trigger: function(eventType) {
                // event
                this.$element.trigger('asGalleryPicker::' + eventType, this);
                this.$element.trigger(eventType + '.asGalleryPicker', this);

                // callback
                eventType = eventType.replace(/\b\w+\b/g, function(word) {
                    return word.substring(0, 1).toUpperCase() + word.substring(1);
                });
                var onFunction = 'on' + eventType;
                var method_arguments = arguments.length > 1 ? Array.prototype.slice.call(arguments, 1) : undefined;
                if (typeof self.options[onFunction] === 'function') {
                    self.options[onFunction].apply(self, method_arguments);
                }
            },

            _update: function() {
                $(this.$infoCount).text(this.count);
                this._setState();
                this.$element.val(this.val());
                this._trigger('change', this.val());
            },

            _setState: function() {
                if (this.count > 0) {
                    this.$infoImage.attr("src", this._getImageByIndex(this.count - 1));
                    this.$wrap.removeClass(this.classes.empty);
                }else {
                    this.$infoImage.attr("src", '');
                    this.$wrap.addClass(this.classes.empty);
                }
            },
            _getImageByIndex: function(index) {
                if(index < this.value.length){
                    var item = this.value[index];
                    return this.options.getImage(item);
                }
                return null;
            },
            _setImages: function(value) {
                this._clearImages();

                for (var i = 0, item; i < value.length; i++) {
                    item = value[i];
                    this._addImage(item);
                }
                this._update();
            },

            _addImage: function(item){
                $('<li/>', {
                    html:   '<img src="'+ this.options.getImage(item) +'"/>' +
                            '<div class="' + this.namespace + '-item-change">Change</div>' +
                            '<a class="' + this.namespace + '-item-remove" href=""></a>',
                    'class':  this.namespace + '-item'
                }).appendTo(this.$expandItems);
            },

            _scrollbar: function() {
                var height = this.$expand.height();
                if (height > this.options.viewportHeight) {
                    this.$expand.height(this.options.viewportHeight);
                    this.$expand.asScrollbar({
                        contentClass: self.namespace + '-expand-content',
                        wrapperClass: self.namespace + '-expand-wrapper',
                        barClass: self.namespace + '-expand-scrollbar',
                        handleClass: self.namespace + '-expand-handle'
                    });
                }
            },

            _clearImages: function() {
                this.$expandItems.children('.' + this.namespace +'-item').remove();
            }
        });

        this._trigger('init');
        this.init();
    };

    Plugin.prototype = {
        constructor: Plugin,
        components: {},

        val: function(value){
            if (typeof value === 'undefined') {
                 return this.options.process(this.value);
            }

            var value_obj = this.options.parse(value);

            if(value_obj){
                this.set(value_obj);
            } else {
                this.clear();
            }
        },

        add: function(item) {
            this.value.push(item);
            this.count = this.value.length;

            this._addImage(item);
            this._update();

            this._trigger('change');
        },

        set: function(value, update) {
            if (update !== false) {
                if($.isArray(value)){
                    this.value = value;
                } else {
                    this.value = [];
                }
            } else {
                if($.isArray(value)){
                    var newString = value.join(','),
                        defaultString = this.value ? (this.value.length > 0 ? this.value.join(',') + ',' : '') : '',
                        lastString = defaultString + newString;
                    this.value = lastString.split(',');
                } else {
                    this.value = [];
                }
            }

            this.count = this.value.length;
            this._setImages(this.value);
        },

        change: function(index, value) {
            this.value[index] = value;
            this.$expandItems.children().eq(index).find('img').attr('src', this.options.getImage(value));
            this._update();
        },

        remove: function(index) {
            this.value.splice(index, 1);
            this.count -= 1;
            this.$expandItems.children().eq(index).remove();
            this._update();
        },

        clear: function() {
            this._clearImages();

            this.count = 0;
            this.value = [];
            this._update();
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
        viewportHeight: '330',
        disabled: false,

        tpl: function() {
            return  '<div class="{{namespace}}">' +
                        '<div class="{{namespace}}-initial">' +
                            '<i></i>Drag a image or click here to upload' +
                        '</div>' +
                        '<div class="{{namespace}}-info">' +
                            '<img class="{{namespace}}-info-image" src="">' +
                            '<span class="{{namespace}}-info-count">more</span>' +
                            '<div class="{{namespace}}-info-add">Add image</div>' +
                            '<div class="{{namespace}}-info-expand">expand</div>' +
                        '</div>' +
                        '<div class="{{namespace}}-expand">' + 
                            '<a class="{{namespace}}-expand-close" href="#"></a>' +
                            '<div class="{{namespace}}-expand-add">' +
                            '<i></i>Add image' +
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
        change: function(index){},
        add: function() {},
        onChange: function() {}
    };

    Plugin.registerComponent = function(component, methods) {
        Plugin.prototype.components[component] = methods;
    };

    $.fn[pluginName] = function(options) {
        if (typeof options === 'string') {
            var method = options;
            var method_arguments = arguments.length > 1 ? Array.prototype.slice.call(arguments, 1) : undefined;

            if (/^\_/.test(method)) {
                return false;
            } else if ((/^(get)$/.test(method)) || (method === 'val' && method_arguments === undefined)) {
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

