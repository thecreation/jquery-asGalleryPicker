export default {
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