// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"../src/index.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ReactDom = exports.React = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function createElement(tag, attrs) {
  for (var _len = arguments.length, children = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
    children[_key - 2] = arguments[_key];
  }

  return {
    tag: tag,
    attrs: attrs,
    children: children
  };
} // 渲染虚拟DOM


function render(vdom, container, dom) {
  if (dom) {
    diff(dom, vdom, container);
    return;
  }

  var vdomType = Object.prototype.toString.call(vdom);
  if (!vdomType.match(/String|Object|Number/)) vdom = 'hello breact'; // 渲染文本节点

  if (vdomType.match(/String|Number/)) {
    var textNode = document.createTextNode(vdom);
    return container.appendChild(textNode);
  } // 渲染DOM节点


  var _vdom = vdom,
      tag = _vdom.tag,
      attrs = _vdom.attrs;
  var tagType = typeof tag === 'function' ? 'Component' : 'Dom';

  if (tagType === 'Dom') {
    var _dom = renderDom(vdom);

    return container.appendChild(_dom);
  } // 渲染组件


  if (tagType === 'Component') {
    var funcType = tag && vdom.tag.prototype && vdom.tag.prototype.render ? 'class' : 'function';

    if (funcType === 'function') {
      //无状态组件
      var _dom2 = renderDom(tag(attrs));

      return container.appendChild(_dom2);
    } else {
      // 有状态组件
      var instance = new vdom.tag(vdom.attrs);
      renderComponent(instance, container);
      if (instance.componentDidMount) instance.componentDidMount();
      return container.appendChild(instance.dom);
    }
  }
} // 创建DOM节点


function renderDom(_ref) {
  var tag = _ref.tag,
      attrs = _ref.attrs,
      children = _ref.children;
  var dom = document.createElement(tag); // 处理属性

  if (attrs) {
    Object.keys(attrs).forEach(function (key) {
      var value = attrs[key]; // 处理className

      if (key === 'className') key = 'class'; // 处理事件绑定

      if (/on\w+/.test(key)) {
        key = key.toLowerCase();
        dom[key] = value;
        return;
      } // 处理内联样式


      if (key === 'style') {
        if (!value || typeof value === 'string') {
          dom.style.cssText = value;
          return;
        } else if (value && _typeof(value) === 'object') {
          throw new Error('暂不支持对象样式');
        }
      }

      dom.setAttribute(key, value);
    });
  } // 递归渲染子元素


  if (children && Object.prototype.toString.call(children).match(/Array/)) children.forEach(function (child) {
    return render(child, dom);
  });
  return dom;
} // 渲染有状态组件


function renderComponent(instance) {
  var component = instance.render();
  var dom = renderDom(component);

  if (instance.dom && instance.dom.parentNode) {
    instance.dom.parentNode.replaceChild(dom, instance.dom);
  }

  instance.dom = dom;
} // 原型类


var Component =
/*#__PURE__*/
function () {
  function Component(props) {
    _classCallCheck(this, Component);

    this.state = {};
  }

  _createClass(Component, [{
    key: "setState",
    value: function setState(state) {
      // 更新状态
      Object.assign(this.state, state); // 重新渲染

      this.componentDidUpdate();
      renderComponent(this); // const queue = [];
      // const queueSetState = (state, component) => {
      //     queue.push({state, component})
      // };
      // const flash = (queue) => {
      //     let item;
      //     while (item === queue.shift()) {
      //         const {state, component} = item;
      //         if (!component.prevState) component.prevState = Object.assign({}, component.state)
      //         if (typeof state === 'function') {
      //
      //         }
      //     }
      // }
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate() {}
  }, {
    key: "componentDidMount",
    value: function componentDidMount() {}
  }]);

  return Component;
}(); // diff算法


function diff(dom, vdom, container) {
  var diffDom = function diffDom() {
    var vdomType = Object.prototype.toString.call(vdom);
    if (!vdomType.match(/String|Object|Number/)) vdom = 'hello breact'; // 对比/渲染文本节点

    if (vdomType.match(/String|Number/)) {
      if (dom && dom.nodeType === 3 && dom.textContent === vdom) {
        console.log('无需更新');
      } else {
        var textNode = document.createTextNode(vdom);
        return container.appendChild(textNode);
      }
    } // 对比/渲染非文本节点


    console.log(vdomType);

    if (vdomType.match(/Object/)) {
      // 对比/渲染JXS节点
      if (typeof vdom.tag !== 'function') {}
    }
  };

  var result = diffDom(dom, vdom);
  if (container) container.appendChild(result);
  return result;
}

var React = {
  createElement: createElement,
  Component: Component
};
exports.React = React;
var ReactDom = {
  render: render
};
exports.ReactDom = ReactDom;
},{}],"App.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _index = require("../src/index");

var _default = function _default() {
  return _index.React.createElement("div", null, "\u6211\u662F\u4E00\u4E2A\u5C0F\u4E3B\u9875");
};

exports.default = _default;
},{"../src/index":"../src/index.js"}],"index.js":[function(require,module,exports) {
"use strict";

var _index = require("../src/index");

var _App = _interopRequireDefault(require("./App.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var dom = _index.React.createElement("div", {
  "data-set": 'haha',
  title: 'xixi',
  id: 'demo',
  className: 'main',
  onClick: function onClick() {},
  style: 'color:green;text-align:center'
}, _index.React.createElement("h1", null, "Breact"), _index.React.createElement("span", null, "hello breact framework"));

var Comp1 = function Comp1(props) {
  return _index.React.createElement("div", null, "\u54C8\u54C8\u54C8\u54C8");
};

var Comp2 =
/*#__PURE__*/
function (_React$Component) {
  _inherits(Comp2, _React$Component);

  function Comp2(props) {
    var _this;

    _classCallCheck(this, Comp2);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Comp2).call(this, props));
    console.log('constructor');
    _this.props = props;
    _this.state = {
      count: 0
    };
    return _this;
  }

  _createClass(Comp2, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      console.log('componentDidMount', this.state);
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate() {
      console.log('我更新啦');
    }
  }, {
    key: "add",
    value: function add() {
      this.setState({
        count: this.state.count + 1
      });
    }
  }, {
    key: "reduce",
    value: function reduce() {
      this.setState({
        count: this.state.count - 1
      });
    }
  }, {
    key: "crazy",
    value: function crazy() {
      for (var i = 0; i < 100; i++) {
        this.setState({
          count: this.state.count + 1
        });
        console.log(this.state.count);
      }
    }
  }, {
    key: "render",
    value: function render() {
      var _this2 = this;

      console.log('render');
      return _index.React.createElement("div", null, _index.React.createElement("h3", null, this.props.name), _index.React.createElement("p", null, "\u6211\u662F\u4E00\u4E2A\u7C7B\u7EC4\u4EF6"), _index.React.createElement("p", null, "\u6211\u7684\u5185\u90E8\u72B6\u6001\u662F ", this.state.count), _index.React.createElement("button", {
        onClick: function onClick() {
          return _this2.add();
        }
      }, "+"), _index.React.createElement("button", {
        onClick: function onClick() {
          return _this2.reduce();
        }
      }, "-"));
    }
  }]);

  return Comp2;
}(_index.React.Component);

_index.ReactDom.render(_index.React.createElement("div", null, _index.React.createElement(Comp2, {
  name: '组件'
})), document.getElementById('root'));
},{"../src/index":"../src/index.js","./App.js":"App.js"}],"../../../../.config/yarn/global/node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "53142" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["../../../../.config/yarn/global/node_modules/parcel-bundler/src/builtins/hmr-runtime.js","index.js"], null)
//# sourceMappingURL=/public.e31bb0bc.js.map