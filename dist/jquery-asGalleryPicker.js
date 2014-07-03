/*! jQuery plugin - v0.1.0 - 2014-07-04
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
            present: this.namespace + '_present',
            extend: this.namespace + '_extend',
            hover: this.namespace + '_hover',
            // single: this.namespace + '_singleImage',
            hasImages: this.namespace + '_hasImages'
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

                this.$wrap.addClass(this.classes.present);

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

                // actions
                this.$actions.on('click', function() {
                    if (self.disabled) {
                        return;
                    }

                    self.options.add.call(self);
                    return false;
                });

                // unfold
                this.$unfold.on('click', function() {
                    if (self.disabled) {
                        return;
                    }

                    self.$wrap.addClass(self.classes.extend).removeClass(self.classes.present);
                })

                // wrap
                this.$display.on('mouseenter', function() {
                    if (self.disabled) {
                        return;
                    }

                    self.$display.addClass(self.classes.hover);
                }).on('mouseleave', function() {
                    if (self.disabled) {
                        return;
                    }

                    self.$display.removeClass(self.classes.hover);
                });

                // close 
                this.$close.on("click", function() {
                    if (self.disabled) {
                        return;
                    }
                    self.$wrap.removeClass(self.classes.extend).addClass(self.classes.present);
                    return false;
                });

                // extend add
                this.$extendInitial.on("click", function() {
                    if (self.disabled) {
                        return;
                    }

                    self.options.add.call(self);
                    return false;
                })

                // remove
                this.$extend.on("click", '.' + this.namespace + '-extend-remove', $.proxy(function(e) {
                    if (this.disabled) {
                        return;
                    }

                    this.remove($(e.currentTarget).parent().index());
                    return false;
                }, this));

                // extend actions
                this.$extend.on("mouseenter", '.' + this.namespace + '-item', $.proxy(function(e) {
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
                this.$extend.on("click", '.' + this.namespace + '-extend-actions', $.proxy(function(e) {
                    if (this.disabled) {
                        return;
                    }

                    this.options.change.call(self, $(e.currentTarget).parent().index());
                    return false;
                }, this));
            },
            _createHtml: function() {
                this.$wrap = $(this.options.tpl());
                this.$element.after(this.$wrap);

                this.$display = $('.' + this.namespace + '-display', this.$wrap);

                this.$extend = $('.' + this.namespace + '-extend', this.$wrap);

                this.$initial = $('.' + this.namespace + '-initial', this.$wrap);
                this.$count = $('.' + this.namespace + '-count', this.$wrap);
                this.$unfold = $('.' + this.namespace + '-unfold', this.$wrap);
                this.$actions = $('.' + this.namespace + '-actions', this.$wrap);
                this.$image = $('.' + this.namespace + '-image', this.$wrap);

                this.$close = $('.' + this.namespace + '-close', this.$extend);
                this.$gallery = $('.' + this.namespace + '-gallery', this.$extend);
                this.$extendInitial = $('.' + this.namespace + '-item-initial', this.$extend)
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
                $(this.$count).text(this.count);
                this._setState();
                this.$element.val(this.options.process(this.value));
                this._trigger('change', this.val());
            },

            _setState: function() {
                if (this.count > 0) {
                    this.$image.attr("src", this._getImageByIndex(this.count - 1));
                    this.$wrap.removeClass(this.classes.empty).addClass(this.classes.hasImages);
                }else {
                    this.$image.attr("src", '');
                    this.$wrap.removeClass(this.classes.hasImages).addClass(this.classes.empty);
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
            },

            _addImage: function(item){
                $('<li/>', {
                    html:   '<img class="' + this.namespace +'-item-image" src="'+ this.options.getImage(item) +'"/>' +
                            '<div class="' + this.namespace + '-extend-actions">Change</div>' +
                            '<a class="' + this.namespace + '-extend-remove" href=""></a>',
                    'class':  this.namespace + '-item'
                }).insertBefore(this.$extendInitial);
            },

            _clearImages: function() {
                this.$gallery.children('.' + this.namespace +'-item').remove();
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
            if($.isArray(value)){
                this.value = value;
            } else {
                this.value = [];
            }
            this.count = this.value.length;
            this._setImages(this.value);

            if (update !== false) {
                this._update();
            }
        },

        change: function(index, value) {
            this.value[index] = value;
            this.$gallery.children().eq(index).find('img').attr('src', this.options.getImage(value));
            this._update();
        },

        remove: function(index) {
            this.value.splice(index, 1);
            this.count -= 1;
            this.$gallery.children().eq(index).remove();
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
        disabled: false,

        tpl: function() {
            return '<div class="' + this.namespace + '">' +
                        '<div class="' + this.namespace + '-display">' + 
                            '<div class="' + this.namespace + '-initial"><i></i>Drag a image or click here to upload</div>' +
                            '<div class="' + this.namespace + '-info">' +
                                '<img class="' + this.namespace + '-image" src="">' +
                                '<span class="' + this.namespace + '-count">more</span>' + 
                                '<div class="' + this.namespace + '-actions">Add image</div>' +
                                '<div class="' + this.namespace + '-unfold">extend</div>' +
                            '</div>' +
                        '</div>' + 
                        '<div class="' + this.namespace + '-extend">' + 
                            '<a class="' + this.namespace + '-close" href="#"></a>' + 
                            '<ul class="' + this.namespace + '-gallery">' +  
                                '<li class="' + this.namespace + '-item-initial">' +
                                    '<div class="' + this.namespace + '-extend-initial"><i></i>Add image</div>' +
                                '</li>' +
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
            if (typeof value === 'string') {
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

