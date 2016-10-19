Tasks and plans
===============

- [x] rename global webpack flag DEBUG to DEVELOP
- [x] change licence
- [x] implement new package cjs-property-watcher
- [x] webui: draft plugin implementation
- [x] webui: provide persistent wamp connection for targets
- [x] fix async: remove func names (fail in release)
- [-] fix async: pass both array and object to method
- [ ] webui: implement app component list with search and property viewer
- [ ] rename cjs-emitter methods and remove some
- [ ] replace all DEVELOP checks with console.assert
- [ ] add recursive event bubbling in spa-app keydown
- [ ] break hardcoded connection between livereload and webpack
- [ ] investigate and rework CSS handling approach (OOCSS, ACSS, BEM, SMACSS, ...)
- [ ] rework spa/stb app module
- [ ] add tests
- [ ] rework spasdk/stbsdk commands to support user configs
- [ ] clean and publish repos
- [ ] move spa-gettext to cjs-gettext
- [ ] move spa-gettext to cjs-gettext
- [ ] spa-wamp: add close method



## For consideration ##

### cjs-emitter ###

New suggestions (http://collabedit.com/m68wv):

```js
// add listener
emitter.on('click', function ( event ) { /* ... */ });

// add listener to be triggered only once
emitter.once('click', function ( event ) { /* ... */ });

// clear all listeners for all events
emitter.events = {};

// clear all listeners for some specific event
emitter.events.click = [];

// remove some specific callback for a specific event
emitter.off('click', someCallback);

// notify listeners
emitter.emit('click');
```
