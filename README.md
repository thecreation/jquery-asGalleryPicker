# [jQuery asGalleryPicker](https://github.com/amazingSurge/jquery-asGalleryPicker) ![bower][bower-image] [![NPM version][npm-image]][npm-url] [![Dependency Status][daviddm-image]][daviddm-url] [![prs-welcome]](#contributing)

> A jquery plugin that do amazing things.

## Table of contents
- [Main files](#main-files)
- [Quick start](#quick-start)
- [Requirements](#requirements)
- [Usage](#usage)
- [Examples](#examples)
- [Options](#options)
- [Methods](#methods)
- [Events](#events)
- [No conflict](#no-conflict)
- [Browser support](#browser-support)
- [Contributing](#contributing)
- [Development](#development)
- [Changelog](#changelog)
- [Copyright and license](#copyright-and-license)

## Main files
```
dist/
├── jquery-asGalleryPicker.js
├── jquery-asGalleryPicker.es.js
├── jquery-asGalleryPicker.min.js
└── css/
    ├── asGalleryPicker.css
    └── asGalleryPicker.min.css
```

## Quick start
Several quick start options are available:
#### Download the latest build

 * [Development](https://raw.githubusercontent.com/amazingSurge/jquery-asGalleryPicker/master/dist/jquery-asGalleryPicker.js) - unminified
 * [Production](https://raw.githubusercontent.com/amazingSurge/jquery-asGalleryPicker/master/dist/jquery-asGalleryPicker.min.js) - minified

#### Install From Bower
```sh
bower install jquery-asGalleryPicker --save
```

#### Install From Npm
```sh
npm install jquery-asGalleryPicker --save
```

#### Install From Yarn
```sh
yarn add jquery-asGalleryPicker
```

#### Build From Source
If you want build from source:

```sh
git clone git@github.com:amazingSurge/jquery-asGalleryPicker.git
cd jquery-asGalleryPicker
npm install
npm install -g gulp-cli babel-cli
gulp build
```

Done!

## Requirements
`jquery-asGalleryPicker` requires the latest version of [`jQuery`](https://jquery.com/download/) and [`asScrollbar`](https://github.com/amazingSurge/jquery-asScrollbar).

## Usage
#### Including files:

```html
<link rel="stylesheet" href="/path/to/asGalleryPicker.css">
<script src="/path/to/jquery.js"></script>
<script src="/path/to/jquery-asGalleryPicker.js"></script>
```

#### Required HTML structure

```html
<div class="example"></div>
```

#### Initialization
All you need to do is call the plugin on the element:

```javascript
jQuery(function($) {
  $('.example').asGalleryPicker(); 
});
```

## Examples
There are some example usages that you can look at to get started. They can be found in the
[examples folder](https://github.com/amazingSurge/jquery-asGalleryPicker/tree/master/examples).

## Options
`jquery-asGalleryPicker` can accept an options object to alter the way it behaves. You can see the default options by call `$.asGalleryPicker.setDefaults()`. The structure of an options object is as follows:

```
{
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
}
```

## Methods
Methods are called on asGalleryPicker instances through the asGalleryPicker method itself.
You can also save the instances to variable for further use.

```javascript
// call directly
$().asGalleryPicker('destroy');

// or
var api = $().data('asGalleryPicker');
api.destroy();
```

#### get()
Get the image picked.
```javascript
var icon = $().asGalleryPicker('get');
```

#### set()
Set the value.
```javascript
$().asGalleryPicker('set', 'image.png');
```

#### val()
Get or set the value.
```javascript
// get the value
var icon = $().asGalleryPicker('val'); 

// set the value
$().asGalleryPicker('set', 'image.png');
```

#### clear()
Clear the value.
```javascript
$().asGalleryPicker('clear');
```

#### enable()
Enable the gallery picker functions.
```javascript
$().asGalleryPicker('enable');
```

#### disable()
Disable the gallery picker functions.
```javascript
$().asGalleryPicker('disable');
```

#### destroy()
Destroy the gallery picker instance.
```javascript
$().asGalleryPicker('destroy');
```

## Events
`jquery-asGalleryPicker` provides custom events for the plugin’s unique actions. 

```javascript
$('.the-element').on('asGalleryPicker::ready', function (e) {
  // on instance ready
});

```

Event   | Description
------- | -----------
init    | Fires when the instance is setup for the first time.
ready   | Fires when the instance is ready for API use.
enable  | Fires when the `enable` instance method has been called.
disable | Fired when the `disable` instance method has been called.
destroy | Fires when an instance is destroyed. 

## No conflict
If you have to use other plugin with the same namespace, just call the `$.asGalleryPicker.noConflict` method to revert to it.

```html
<script src="other-plugin.js"></script>
<script src="jquery-asGalleryPicker.js"></script>
<script>
  $.asGalleryPicker.noConflict();
  // Code that uses other plugin's "$().asGalleryPicker" can follow here.
</script>
```

## Browser support

Tested on all major browsers.

| <img src="https://raw.githubusercontent.com/alrra/browser-logos/master/safari/safari_32x32.png" alt="Safari"> | <img src="https://raw.githubusercontent.com/alrra/browser-logos/master/chrome/chrome_32x32.png" alt="Chrome"> | <img src="https://raw.githubusercontent.com/alrra/browser-logos/master/firefox/firefox_32x32.png" alt="Firefox"> | <img src="https://raw.githubusercontent.com/alrra/browser-logos/master/edge/edge_32x32.png" alt="Edge"> | <img src="https://raw.githubusercontent.com/alrra/browser-logos/master/internet-explorer/internet-explorer_32x32.png" alt="IE"> | <img src="https://raw.githubusercontent.com/alrra/browser-logos/master/opera/opera_32x32.png" alt="Opera"> |
|:--:|:--:|:--:|:--:|:--:|:--:|
| Latest ✓ | Latest ✓ | Latest ✓ | Latest ✓ | 9-11 ✓ | Latest ✓ |

As a jQuery plugin, you also need to see the [jQuery Browser Support](http://jquery.com/browser-support/).

## Contributing
Anyone and everyone is welcome to contribute. Please take a moment to
review the [guidelines for contributing](CONTRIBUTING.md). Make sure you're using the latest version of `jquery-asGalleryPicker` before submitting an issue. There are several ways to help out:

* [Bug reports](CONTRIBUTING.md#bug-reports)
* [Feature requests](CONTRIBUTING.md#feature-requests)
* [Pull requests](CONTRIBUTING.md#pull-requests)
* Write test cases for open bug issues
* Contribute to the documentation

## Development
`jquery-asGalleryPicker` is built modularly and uses Gulp as a build system to build its distributable files. To install the necessary dependencies for the build system, please run:

```sh
npm install -g gulp
npm install -g babel-cli
npm install
```

Then you can generate new distributable files from the sources, using:
```
gulp build
```

More gulp tasks can be found [here](CONTRIBUTING.md#available-tasks).

## Changelog
To see the list of recent changes, see [Releases section](https://github.com/amazingSurge/jquery-asGalleryPicker/releases).

## Copyright and license
Copyright (C) 2016 amazingSurge.

Licensed under [the LGPL license](LICENSE).

[⬆ back to top](#table-of-contents)

[bower-image]: https://img.shields.io/bower/v/jquery-asGalleryPicker.svg?style=flat
[bower-link]: https://david-dm.org/amazingSurge/jquery-asGalleryPicker/dev-status.svg
[npm-image]: https://badge.fury.io/js/jquery-asGalleryPicker.svg?style=flat
[npm-url]: https://npmjs.org/package/jquery-asGalleryPicker
[license]: https://img.shields.io/npm/l/jquery-asGalleryPicker.svg?style=flat
[prs-welcome]: https://img.shields.io/badge/PRs-welcome-brightgreen.svg
[daviddm-image]: https://david-dm.org/amazingSurge/jquery-asGalleryPicker.svg?style=flat
[daviddm-url]: https://david-dm.org/amazingSurge/jquery-asGalleryPicker
