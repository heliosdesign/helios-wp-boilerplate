(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _exampleModule = require('modules/example-module');

var _exampleModule2 = _interopRequireDefault(_exampleModule);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(function ($, console, module) {
  console.log('The example script is firing.');
  console.log(module());
})(jQuery, console, _exampleModule2.default); /* global jQuery console */

},{"modules/example-module":2}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
/* global console */

var example = function example() {
  console.log('Module function is firing.');
  return 'Module is loading!';
};

exports.default = example;

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvanMvaW5kZXguanMiLCJzcmMvanMvbW9kdWxlcy9leGFtcGxlLW1vZHVsZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7O0FDRUE7Ozs7OztBQUVBLENBQUMsVUFBUyxDQUFULEVBQVksT0FBWixFQUFxQixNQUFyQixFQUE0QjtBQUMzQixVQUFRLEdBQVIsQ0FBWSwrQkFBWjtBQUNBLFVBQVEsR0FBUixDQUFZLFFBQVo7QUFDRCxDQUhELEVBR0csTUFISCxFQUdXLE9BSFgsMkIsQ0FKQTs7Ozs7Ozs7QUNBQTs7QUFFQSxJQUFNLFVBQVUsU0FBVixPQUFVLEdBQVc7QUFDekIsVUFBUSxHQUFSLENBQVksNEJBQVo7QUFDQSxTQUFPLG9CQUFQO0FBQ0QsQ0FIRDs7a0JBS2UsTyIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIvKiBnbG9iYWwgalF1ZXJ5IGNvbnNvbGUgKi9cblxuaW1wb3J0IG1vZHVsZSBmcm9tICdtb2R1bGVzL2V4YW1wbGUtbW9kdWxlJztcblxuKGZ1bmN0aW9uKCQsIGNvbnNvbGUsIG1vZHVsZSl7XG4gIGNvbnNvbGUubG9nKCdUaGUgZXhhbXBsZSBzY3JpcHQgaXMgZmlyaW5nLicpO1xuICBjb25zb2xlLmxvZyhtb2R1bGUoKSk7XG59KShqUXVlcnksIGNvbnNvbGUsIG1vZHVsZSk7IiwiLyogZ2xvYmFsIGNvbnNvbGUgKi9cblxuY29uc3QgZXhhbXBsZSA9IGZ1bmN0aW9uKCkge1xuICBjb25zb2xlLmxvZygnTW9kdWxlIGZ1bmN0aW9uIGlzIGZpcmluZy4nKTtcbiAgcmV0dXJuICdNb2R1bGUgaXMgbG9hZGluZyEnO1xufTtcblxuZXhwb3J0IGRlZmF1bHQgZXhhbXBsZTsiXX0=
