'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.VariableEditor = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _onHasCompletion = require('../utility/onHasCompletion');

var _onHasCompletion2 = _interopRequireDefault(_onHasCompletion);

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
 * VariableEditor
 *
 * An instance of CodeMirror for editing variables defined in QueryEditor.
 *
 * Props:
 *
 *   - variableToType: A mapping of variable name to GraphQLType.
 *   - value: The text of the editor.
 *   - onEdit: A function called when the editor changes, given the edited text.
 *
 */
var VariableEditor = exports.VariableEditor = function (_React$Component) {
  _inherits(VariableEditor, _React$Component);

  function VariableEditor(props) {
    _classCallCheck(this, VariableEditor);

    // Keep a cached version of the value, this cache will be updated when the
    // editor is updated, which can later be used to protect the editor from
    // unnecessary updates during the update lifecycle.
    var _this = _possibleConstructorReturn(this, (VariableEditor.__proto__ || Object.getPrototypeOf(VariableEditor)).call(this));

    _this._onKeyUp = function (cm, event) {
      var code = event.keyCode;
      if (code >= 65 && code <= 90 || // letters
      !event.shiftKey && code >= 48 && code <= 57 || // numbers
      event.shiftKey && code === 189 || // underscore
      event.shiftKey && code === 222 // "
      ) {
          _this.editor.execCommand('autocomplete');
        }
    };

    _this._onEdit = function () {
      if (!_this.ignoreChangeEvent) {
        _this.cachedValue = _this.editor.getValue();
        if (_this.props.onEdit) {
          _this.props.onEdit(_this.cachedValue);
        }
      }
    };

    _this._onHasCompletion = function (cm, data) {
      (0, _onHasCompletion2.default)(cm, data, _this.props.onHintInformationRender);
    };

    _this.cachedValue = props.value || '';
    return _this;
  }

  _createClass(VariableEditor, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      var _this2 = this;

      // Lazily require to ensure requiring GraphiQL outside of a Browser context
      // does not produce an error.
      var CodeMirror = require('codemirror');
      require('codemirror/addon/hint/show-hint');
      require('codemirror/addon/edit/matchbrackets');
      require('codemirror/addon/edit/closebrackets');
      require('codemirror/addon/fold/brace-fold');
      require('codemirror/addon/fold/foldgutter');
      require('codemirror/addon/lint/lint');
      require('codemirror/keymap/sublime');
      require('codemirror-graphql/variables/hint');
      require('codemirror-graphql/variables/lint');
      require('codemirror-graphql/variables/mode');

      this.editor = CodeMirror(_reactDom2.default.findDOMNode(this), {
        value: this.props.value || '',
        lineNumbers: true,
        tabSize: 2,
        mode: 'graphql-variables',
        theme: 'graphiql',
        keyMap: 'sublime',
        autoCloseBrackets: true,
        matchBrackets: true,
        showCursorWhenSelecting: true,
        foldGutter: {
          minFoldSize: 4
        },
        lint: {
          variableToType: this.props.variableToType
        },
        hintOptions: {
          variableToType: this.props.variableToType
        },
        gutters: ['CodeMirror-linenumbers', 'CodeMirror-foldgutter'],
        extraKeys: {
          'Cmd-Space': function CmdSpace() {
            return _this2.editor.showHint({ completeSingle: false });
          },
          'Ctrl-Space': function CtrlSpace() {
            return _this2.editor.showHint({ completeSingle: false });
          },
          'Alt-Space': function AltSpace() {
            return _this2.editor.showHint({ completeSingle: false });
          },
          'Shift-Space': function ShiftSpace() {
            return _this2.editor.showHint({ completeSingle: false });
          },

          'Cmd-Enter': function CmdEnter() {
            if (_this2.props.onRunQuery) {
              _this2.props.onRunQuery();
            }
          },
          'Ctrl-Enter': function CtrlEnter() {
            if (_this2.props.onRunQuery) {
              _this2.props.onRunQuery();
            }
          },

          // Editor improvements
          'Ctrl-Left': 'goSubwordLeft',
          'Ctrl-Right': 'goSubwordRight',
          'Alt-Left': 'goGroupLeft',
          'Alt-Right': 'goGroupRight'
        }
      });

      this.editor.on('change', this._onEdit);
      this.editor.on('keyup', this._onKeyUp);
      this.editor.on('hasCompletion', this._onHasCompletion);
    }
  }, {
    key: 'componentDidUpdate',
    value: function componentDidUpdate(prevProps) {
      var CodeMirror = require('codemirror');

      // Ensure the changes caused by this update are not interpretted as
      // user-input changes which could otherwise result in an infinite
      // event loop.
      this.ignoreChangeEvent = true;
      if (this.props.variableToType !== prevProps.variableToType) {
        this.editor.options.lint.variableToType = this.props.variableToType;
        this.editor.options.hintOptions.variableToType = this.props.variableToType;
        CodeMirror.signal(this.editor, 'change', this.editor);
      }
      if (this.props.value !== prevProps.value && this.props.value !== this.cachedValue) {
        this.cachedValue = this.props.value;
        this.editor.setValue(this.props.value);
      }
      this.ignoreChangeEvent = false;
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      this.editor.off('change', this._onEdit);
      this.editor.off('keyup', this._onKeyUp);
      this.editor.off('hasCompletion', this._onHasCompletion);
      this.editor = null;
    }
  }, {
    key: 'render',
    value: function render() {
      return _react2.default.createElement('div', { className: 'codemirrorWrap' });
    }

    /**
     * Public API for retrieving the CodeMirror instance from this
     * React component.
     */

  }, {
    key: 'getCodeMirror',
    value: function getCodeMirror() {
      return this.editor;
    }
  }]);

  return VariableEditor;
}(_react2.default.Component);

VariableEditor.propTypes = {
  variableToType: _react.PropTypes.object,
  value: _react.PropTypes.string,
  onEdit: _react.PropTypes.func,
  onHintInformationRender: _react.PropTypes.func,
  onRunQuery: _react.PropTypes.func
};