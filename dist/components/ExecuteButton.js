'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ExecuteButton = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *  Copyright (c) 2015, Facebook, Inc.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *  All rights reserved.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *  This source code is licensed under the license found in the
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *  LICENSE-examples file in the root directory of this source tree.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */

/**
 * ExecuteButton
 *
 * What a nice round shiny button. Shows a drop-down when there are multiple
 * queries to run.
 */
var ExecuteButton = exports.ExecuteButton = function (_React$Component) {
  _inherits(ExecuteButton, _React$Component);

  function ExecuteButton(props) {
    _classCallCheck(this, ExecuteButton);

    var _this = _possibleConstructorReturn(this, (ExecuteButton.__proto__ || Object.getPrototypeOf(ExecuteButton)).call(this, props));

    _this._onClick = function () {
      if (_this.props.isRunning) {
        _this.props.onStop();
      } else {
        _this.props.onRun();
      }
    };

    _this._onOptionSelected = function (operation) {
      _this.setState({ optionsOpen: false });
      _this.props.onRun(operation.name && operation.name.value);
    };

    _this._onOptionsOpen = function (downEvent) {
      var initialPress = true;
      var downTarget = downEvent.target;
      _this.setState({ highlight: null, optionsOpen: true });

      var _onMouseUp = function onMouseUp(upEvent) {
        if (initialPress && upEvent.target === downTarget) {
          initialPress = false;
        } else {
          document.removeEventListener('mouseup', _onMouseUp);
          _onMouseUp = null;
          var isOptionsMenuClicked = downTarget.parentNode.compareDocumentPosition(upEvent.target) & Node.DOCUMENT_POSITION_CONTAINED_BY;
          if (!isOptionsMenuClicked) {
            // menu calls setState if it was clicked
            _this.setState({ optionsOpen: false });
          }
        }
      };

      document.addEventListener('mouseup', _onMouseUp);
    };

    _this.state = {
      optionsOpen: false,
      highlight: null
    };
    return _this;
  }

  _createClass(ExecuteButton, [{
    key: 'render',
    value: function render() {
      var _this2 = this;

      var operations = this.props.operations;
      var optionsOpen = this.state.optionsOpen;
      var hasOptions = operations && operations.length > 1;

      var options = null;
      if (hasOptions && optionsOpen) {
        (function () {
          var highlight = _this2.state.highlight;
          options = _react2.default.createElement(
            'ul',
            { className: 'execute-options' },
            operations.map(function (operation) {
              return _react2.default.createElement(
                'li',
                {
                  key: operation.name ? operation.name.value : '*',
                  className: operation === highlight && 'selected',
                  onMouseOver: function onMouseOver() {
                    return _this2.setState({ highlight: operation });
                  },
                  onMouseOut: function onMouseOut() {
                    return _this2.setState({ highlight: null });
                  },
                  onMouseUp: function onMouseUp() {
                    return _this2._onOptionSelected(operation);
                  } },
                operation.name ? operation.name.value : '<Unnamed>'
              );
            })
          );
        })();
      }

      // Allow click event if there is a running query or if there are not options
      // for which operation to run.
      var onClick = void 0;
      if (this.props.isRunning || !hasOptions) {
        onClick = this._onClick;
      }

      // Allow mouse down if there is no running query, there are options for
      // which operation to run, and the dropdown is currently closed.
      var onMouseDown = void 0;
      if (!this.props.isRunning && hasOptions && !optionsOpen) {
        onMouseDown = this._onOptionsOpen;
      }

      var pathJSX = this.props.isRunning ? _react2.default.createElement('path', { d: 'M 10 10 L 23 10 L 23 23 L 10 23 z' }) : _react2.default.createElement('path', { d: 'M 11 9 L 24 16 L 11 23 z' });

      return _react2.default.createElement(
        'div',
        { className: 'execute-button-wrap' },
        _react2.default.createElement(
          'button',
          {
            className: 'execute-button',
            onMouseDown: onMouseDown,
            onClick: onClick,
            title: 'Execute Query (Ctrl-Enter)' },
          _react2.default.createElement(
            'svg',
            { width: '34', height: '34' },
            pathJSX
          )
        ),
        options
      );
    }
  }]);

  return ExecuteButton;
}(_react2.default.Component);

ExecuteButton.propTypes = {
  onRun: _react.PropTypes.func,
  onStop: _react.PropTypes.func,
  isRunning: _react.PropTypes.bool,
  operations: _react.PropTypes.array
};