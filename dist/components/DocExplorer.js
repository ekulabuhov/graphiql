'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DocExplorer = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _marked = require('marked');

var _marked2 = _interopRequireDefault(_marked);

var _graphql = require('graphql');

var _debounce = require('../utility/debounce');

var _debounce2 = _interopRequireDefault(_debounce);

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
 * DocExplorer
 *
 * Shows documentations for GraphQL definitions from the schema.
 *
 * Props:
 *
 *   - schema: A required GraphQLSchema instance that provides GraphQL document
 *     definitions.
 *
 * Children:
 *
 *   - Any provided children will be positioned in the right-hand-side of the
 *     top bar. Typically this will be a "close" button for temporary explorer.
 *
 */
var DocExplorer = exports.DocExplorer = function (_React$Component) {
  _inherits(DocExplorer, _React$Component);

  function DocExplorer() {
    _classCallCheck(this, DocExplorer);

    var _this = _possibleConstructorReturn(this, (DocExplorer.__proto__ || Object.getPrototypeOf(DocExplorer)).call(this));

    _this.handleNavBackClick = function () {
      _this.setState({ navStack: _this.state.navStack.slice(0, -1) });
    };

    _this.handleClickTypeOrField = function (typeOrField) {
      _this.showDoc(typeOrField);
    };

    _this.handleSearch = function (value) {
      _this.showSearch({
        name: 'Search Results',
        searchValue: value
      });
    };

    _this.state = { navStack: [] };
    return _this;
  }

  _createClass(DocExplorer, [{
    key: 'shouldComponentUpdate',
    value: function shouldComponentUpdate(nextProps, nextState) {
      return this.props.schema !== nextProps.schema || this.state.navStack !== nextState.navStack || this.state.searchValue !== nextState.searchValue;
    }
  }, {
    key: 'render',
    value: function render() {
      var schema = this.props.schema;
      var navStack = this.state.navStack;

      var navItem = void 0;
      if (navStack.length > 0) {
        navItem = navStack[navStack.length - 1];
      }

      var title = void 0;
      var content = void 0;
      if (navItem) {
        if (navItem.name === 'Search Results') {
          title = navItem.name;
          content = _react2.default.createElement(SearchDoc, {
            searchValue: navItem.searchValue,
            schema: schema,
            onClickType: this.handleClickTypeOrField,
            onClickField: this.handleClickTypeOrField
          });
        } else {
          title = navItem.name;
          if ((0, _graphql.isType)(navItem)) {
            content = _react2.default.createElement(TypeDoc, {
              key: navItem.name,
              schema: schema,
              type: navItem,
              onClickType: this.handleClickTypeOrField,
              onClickField: this.handleClickTypeOrField
            });
          } else {
            content = _react2.default.createElement(FieldDoc, {
              key: navItem.name,
              field: navItem,
              onClickType: this.handleClickTypeOrField
            });
          }
        }
      } else if (schema) {
        title = 'Documentation Explorer';
        content = _react2.default.createElement(SchemaDoc, { schema: schema, onClickType: this.handleClickTypeOrField });
      }

      var prevName = void 0;
      if (navStack.length === 1) {
        prevName = 'Schema';
      } else if (navStack.length > 1) {
        prevName = navStack[navStack.length - 2].name;
      }

      var spinnerDiv = _react2.default.createElement(
        'div',
        { className: 'spinner-container' },
        _react2.default.createElement('div', { className: 'spinner' })
      );

      var shouldSearchBoxAppear = content && (content.type === SearchDoc || content.type === SchemaDoc);

      return _react2.default.createElement(
        'div',
        { className: 'doc-explorer' },
        _react2.default.createElement(
          'div',
          { className: 'doc-explorer-title-bar' },
          prevName && _react2.default.createElement(
            'div',
            {
              className: 'doc-explorer-back',
              onClick: this.handleNavBackClick },
            prevName
          ),
          _react2.default.createElement(
            'div',
            { className: 'doc-explorer-title' },
            title
          ),
          _react2.default.createElement(
            'div',
            { className: 'doc-explorer-rhs' },
            this.props.children
          )
        ),
        _react2.default.createElement(
          'div',
          { className: 'doc-explorer-contents' },
          _react2.default.createElement(SearchBox, {
            isShown: shouldSearchBoxAppear,
            onSearch: this.handleSearch
          }),
          this.props.schema ? content : spinnerDiv
        )
      );
    }

    // Public API

  }, {
    key: 'showDoc',
    value: function showDoc(typeOrField) {
      var navStack = this.state.navStack;
      var isCurrentlyShown = navStack.length > 0 && navStack[navStack.length - 1] === typeOrField;
      if (!isCurrentlyShown) {
        navStack = navStack.concat([typeOrField]);
      }

      this.setState({ navStack: navStack });
    }

    // Public API

  }, {
    key: 'showSearch',
    value: function showSearch(searchItem) {
      var navStack = this.state.navStack;
      var lastEntry = navStack.length > 0 && navStack[navStack.length - 1];
      if (!lastEntry) {
        navStack = navStack.concat([searchItem]);
      } else if (lastEntry.searchValue !== searchItem.searchValue) {
        navStack = navStack.slice(0, -1).concat([searchItem]);
      }

      this.setState({ navStack: navStack });
    }
  }]);

  return DocExplorer;
}(_react2.default.Component);

DocExplorer.propTypes = {
  schema: _react.PropTypes.instanceOf(_graphql.GraphQLSchema)
};

var SearchBox = function (_React$Component2) {
  _inherits(SearchBox, _React$Component2);

  function SearchBox(props) {
    _classCallCheck(this, SearchBox);

    var _this2 = _possibleConstructorReturn(this, (SearchBox.__proto__ || Object.getPrototypeOf(SearchBox)).call(this, props));

    _this2.handleChange = function (event) {
      _this2.setState({ value: event.target.value });
      _this2._debouncedOnSearch();
    };

    _this2.state = { value: '' };

    _this2._debouncedOnSearch = (0, _debounce2.default)(200, function () {
      _this2.props.onSearch(_this2.state.value);
    });
    return _this2;
  }

  _createClass(SearchBox, [{
    key: 'shouldComponentUpdate',
    value: function shouldComponentUpdate(nextProps, nextState) {
      return nextProps.isShown !== this.props.isShown || nextState.value !== this.state.value;
    }
  }, {
    key: 'render',
    value: function render() {
      return _react2.default.createElement(
        'div',
        null,
        this.props.isShown && _react2.default.createElement(
          'label',
          { className: 'search-box-outer' },
          _react2.default.createElement('input', { className: 'search-box-input',
            onChange: this.handleChange,
            type: 'text',
            value: this.state.value,
            placeholder: 'Search the schema ...'
          })
        )
      );
    }
  }]);

  return SearchBox;
}(_react2.default.Component);

// Render Search Results


SearchBox.propTypes = {
  isShown: _react.PropTypes.bool,
  onSearch: _react.PropTypes.func
};

var SearchDoc = function (_React$Component3) {
  _inherits(SearchDoc, _React$Component3);

  function SearchDoc() {
    _classCallCheck(this, SearchDoc);

    return _possibleConstructorReturn(this, (SearchDoc.__proto__ || Object.getPrototypeOf(SearchDoc)).apply(this, arguments));
  }

  _createClass(SearchDoc, [{
    key: 'shouldComponentUpdate',
    value: function shouldComponentUpdate(nextProps) {
      return this.props.schema !== nextProps.schema || this.props.searchValue !== nextProps.searchValue;
    }
  }, {
    key: 'render',
    value: function render() {
      var _this4 = this;

      var searchValue = this.props.searchValue;
      var schema = this.props.schema;
      var onClickType = this.props.onClickType;
      var onClickField = this.props.onClickField;

      var typeMap = schema.getTypeMap();

      var matchedTypes = [];
      var matchedFields = [];

      var typeNames = Object.keys(typeMap);
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        var _loop = function _loop() {
          var typeName = _step.value;

          if (matchedTypes.length + matchedFields.length >= 100) {
            return 'break';
          }

          var type = typeMap[typeName];
          var matchedOn = [];
          if (_this4._isMatch(typeName, searchValue)) {
            matchedOn.push('Type Name');
          }

          if (matchedOn.length) {
            matchedTypes.push(_react2.default.createElement(
              'div',
              { className: 'doc-category-item' },
              _react2.default.createElement(TypeLink, { type: type, onClick: onClickType })
            ));
          }

          if (type.getFields) {
            (function () {
              var fields = type.getFields();
              Object.keys(fields).forEach(function (fieldName) {
                var field = fields[fieldName];
                if (_this4._isMatch(fieldName, searchValue)) {
                  matchedFields.push(_react2.default.createElement(
                    'div',
                    { className: 'doc-category-item' },
                    _react2.default.createElement(
                      'a',
                      { className: 'field-name',
                        onClick: function onClick(event) {
                          return onClickField(field, type, event);
                        } },
                      field.name
                    ),
                    ' on ',
                    _react2.default.createElement(TypeLink, { type: type, onClick: onClickType })
                  ));
                } else if (field.args && field.args.length) {
                  var matches = field.args.filter(function (arg) {
                    return _this4._isMatch(arg.name, searchValue);
                  });
                  if (matches.length > 0) {
                    matchedFields.push(_react2.default.createElement(
                      'div',
                      { className: 'doc-category-item' },
                      _react2.default.createElement(
                        'a',
                        { className: 'field-name',
                          onClick: function onClick(event) {
                            return onClickField(field, type, event);
                          } },
                        field.name
                      ),
                      '(',
                      _react2.default.createElement(
                        'span',
                        null,
                        matches.map(function (arg) {
                          return _react2.default.createElement(
                            'span',
                            { className: 'arg', key: arg.name },
                            _react2.default.createElement(
                              'span',
                              { className: 'arg-name' },
                              arg.name
                            ),
                            ': ',
                            _react2.default.createElement(TypeLink, { type: arg.type, onClick: onClickType })
                          );
                        })
                      ),
                      ')',
                      ' on ',
                      _react2.default.createElement(TypeLink, { type: type, onClick: onClickType })
                    ));
                  }
                }
              });
            })();
          }
        };

        for (var _iterator = typeNames[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var _ret = _loop();

          if (_ret === 'break') break;
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }

      if (matchedTypes.length === 0 && matchedFields.length === 0) {
        return _react2.default.createElement(
          'span',
          { className: 'doc-alert-text' },
          'No results found.'
        );
      }

      return _react2.default.createElement(
        'div',
        null,
        _react2.default.createElement(
          'div',
          { className: 'doc-category' },
          (matchedTypes.length > 0 || matchedFields.length > 0) && _react2.default.createElement(
            'div',
            { className: 'doc-category-title' },
            'search results'
          ),
          matchedTypes,
          matchedFields
        )
      );
    }
  }, {
    key: '_isMatch',
    value: function _isMatch(sourceText, searchValue) {
      try {
        var escaped = searchValue.replace(/[^_0-9A-Za-z]/g, function (ch) {
          return '\\' + ch;
        });
        return sourceText.search(new RegExp(escaped, 'i')) !== -1;
      } catch (e) {
        return sourceText.toLowerCase().indexOf(searchValue.toLowerCase()) !== -1;
      }
    }
  }]);

  return SearchDoc;
}(_react2.default.Component);

// Render the top level Schema


SearchDoc.propTypes = {
  schema: _react.PropTypes.object,
  searchValue: _react.PropTypes.string,
  onClickType: _react.PropTypes.func,
  onClickField: _react.PropTypes.func
};

var SchemaDoc = function (_React$Component4) {
  _inherits(SchemaDoc, _React$Component4);

  function SchemaDoc() {
    _classCallCheck(this, SchemaDoc);

    return _possibleConstructorReturn(this, (SchemaDoc.__proto__ || Object.getPrototypeOf(SchemaDoc)).apply(this, arguments));
  }

  _createClass(SchemaDoc, [{
    key: 'shouldComponentUpdate',
    value: function shouldComponentUpdate(nextProps) {
      return this.props.schema !== nextProps.schema;
    }
  }, {
    key: 'render',
    value: function render() {
      var schema = this.props.schema;
      var queryType = schema.getQueryType();
      var mutationType = schema.getMutationType && schema.getMutationType();
      var subscriptionType = schema.getSubscriptionType && schema.getSubscriptionType();

      return _react2.default.createElement(
        'div',
        null,
        _react2.default.createElement(MarkdownContent, {
          className: 'doc-type-description',
          markdown: 'A GraphQL schema provides a root type for each kind of operation.'
        }),
        _react2.default.createElement(
          'div',
          { className: 'doc-category' },
          _react2.default.createElement(
            'div',
            { className: 'doc-category-title' },
            'root types'
          ),
          _react2.default.createElement(
            'div',
            { className: 'doc-category-item' },
            _react2.default.createElement(
              'span',
              { className: 'keyword' },
              'query'
            ),
            ': ',
            _react2.default.createElement(TypeLink, { type: queryType, onClick: this.props.onClickType })
          ),
          mutationType && _react2.default.createElement(
            'div',
            { className: 'doc-category-item' },
            _react2.default.createElement(
              'span',
              { className: 'keyword' },
              'mutation'
            ),
            ': ',
            _react2.default.createElement(TypeLink, { type: mutationType, onClick: this.props.onClickType })
          ),
          subscriptionType && _react2.default.createElement(
            'div',
            { className: 'doc-category-item' },
            _react2.default.createElement(
              'span',
              { className: 'keyword' },
              'subscription'
            ),
            ': ',
            _react2.default.createElement(TypeLink, {
              type: subscriptionType,
              onClick: this.props.onClickType
            })
          )
        )
      );
    }
  }]);

  return SchemaDoc;
}(_react2.default.Component);

// Documentation for a Type


SchemaDoc.propTypes = {
  schema: _react.PropTypes.object,
  onClickType: _react.PropTypes.func
};

var TypeDoc = function (_React$Component5) {
  _inherits(TypeDoc, _React$Component5);

  function TypeDoc() {
    _classCallCheck(this, TypeDoc);

    return _possibleConstructorReturn(this, (TypeDoc.__proto__ || Object.getPrototypeOf(TypeDoc)).apply(this, arguments));
  }

  _createClass(TypeDoc, [{
    key: 'shouldComponentUpdate',
    value: function shouldComponentUpdate(nextProps) {
      return this.props.type !== nextProps.type || this.props.schema !== nextProps.schema;
    }
  }, {
    key: 'render',
    value: function render() {
      var schema = this.props.schema;
      var type = this.props.type;
      var onClickType = this.props.onClickType;
      var onClickField = this.props.onClickField;

      var typesTitle = void 0;
      var types = void 0;
      if (type instanceof _graphql.GraphQLUnionType) {
        typesTitle = 'possible types';
        types = schema.getPossibleTypes(type);
      } else if (type instanceof _graphql.GraphQLInterfaceType) {
        typesTitle = 'implementations';
        types = schema.getPossibleTypes(type);
      } else if (type instanceof _graphql.GraphQLObjectType) {
        typesTitle = 'implements';
        types = type.getInterfaces();
      }

      var typesDef = void 0;
      if (types && types.length > 0) {
        typesDef = _react2.default.createElement(
          'div',
          { className: 'doc-category' },
          _react2.default.createElement(
            'div',
            { className: 'doc-category-title' },
            typesTitle
          ),
          types.map(function (subtype) {
            return _react2.default.createElement(
              'div',
              { key: subtype.name, className: 'doc-category-item' },
              _react2.default.createElement(TypeLink, { type: subtype, onClick: onClickType })
            );
          })
        );
      }

      // InputObject and Object
      var fieldsDef = void 0;
      if (type.getFields) {
        (function () {
          var fieldMap = type.getFields();
          var fields = Object.keys(fieldMap).map(function (name) {
            return fieldMap[name];
          });
          fieldsDef = _react2.default.createElement(
            'div',
            { className: 'doc-category' },
            _react2.default.createElement(
              'div',
              { className: 'doc-category-title' },
              'fields'
            ),
            fields.map(function (field) {

              // Field arguments
              var argsDef = void 0;
              if (field.args && field.args.length > 0) {
                argsDef = field.args.map(function (arg) {
                  return _react2.default.createElement(
                    'span',
                    { className: 'arg', key: arg.name },
                    _react2.default.createElement(
                      'span',
                      { className: 'arg-name' },
                      arg.name
                    ),
                    ': ',
                    _react2.default.createElement(TypeLink, { type: arg.type, onClick: onClickType })
                  );
                });
              }

              return _react2.default.createElement(
                'div',
                { key: field.name, className: 'doc-category-item' },
                _react2.default.createElement(
                  'a',
                  {
                    className: 'field-name',
                    onClick: function onClick(event) {
                      return onClickField(field, type, event);
                    } },
                  field.name
                ),
                argsDef && ['(', _react2.default.createElement(
                  'span',
                  { key: 'args' },
                  argsDef
                ), ')'],
                ': ',
                _react2.default.createElement(TypeLink, { type: field.type, onClick: onClickType }),
                (field.isDeprecated || field.deprecationReason) && _react2.default.createElement(
                  'span',
                  { className: 'doc-alert-text' },
                  ' (DEPRECATED)'
                )
              );
            })
          );
        })();
      }

      var valuesDef = void 0;
      if (type instanceof _graphql.GraphQLEnumType) {
        valuesDef = _react2.default.createElement(
          'div',
          { className: 'doc-category' },
          _react2.default.createElement(
            'div',
            { className: 'doc-category-title' },
            'values'
          ),
          type.getValues().map(function (value) {
            return _react2.default.createElement(
              'div',
              { key: value.name, className: 'doc-category-item' },
              _react2.default.createElement(
                'div',
                { className: 'enum-value' },
                value.name,
                (value.isDeprecated || value.deprecationReason) && _react2.default.createElement(
                  'span',
                  { className: 'doc-alert-text' },
                  ' (DEPRECATED)'
                )
              ),
              _react2.default.createElement(MarkdownContent, {
                className: 'doc-value-description',
                markdown: value.description
              }),
              value.deprecationReason && _react2.default.createElement(MarkdownContent, {
                className: 'doc-alert-text',
                markdown: value.deprecationReason
              })
            );
          })
        );
      }

      return _react2.default.createElement(
        'div',
        null,
        _react2.default.createElement(MarkdownContent, {
          className: 'doc-type-description',
          markdown: type.description || 'No Description'
        }),
        type instanceof _graphql.GraphQLObjectType && typesDef,
        fieldsDef,
        valuesDef,
        !(type instanceof _graphql.GraphQLObjectType) && typesDef
      );
    }
  }]);

  return TypeDoc;
}(_react2.default.Component);

// Documentation for a field


TypeDoc.propTypes = {
  schema: _react.PropTypes.instanceOf(_graphql.GraphQLSchema),
  type: _react.PropTypes.object,
  onClickType: _react.PropTypes.func,
  onClickField: _react.PropTypes.func
};

var FieldDoc = function (_React$Component6) {
  _inherits(FieldDoc, _React$Component6);

  function FieldDoc() {
    _classCallCheck(this, FieldDoc);

    return _possibleConstructorReturn(this, (FieldDoc.__proto__ || Object.getPrototypeOf(FieldDoc)).apply(this, arguments));
  }

  _createClass(FieldDoc, [{
    key: 'shouldComponentUpdate',
    value: function shouldComponentUpdate(nextProps) {
      return this.props.field !== nextProps.field;
    }
  }, {
    key: 'render',
    value: function render() {
      var _this8 = this;

      var field = this.props.field;

      var argsDef = void 0;
      if (field.args && field.args.length > 0) {
        argsDef = _react2.default.createElement(
          'div',
          { className: 'doc-category' },
          _react2.default.createElement(
            'div',
            { className: 'doc-category-title' },
            'arguments'
          ),
          field.args.map(function (arg) {
            return _react2.default.createElement(
              'div',
              { key: arg.name, className: 'doc-category-item' },
              _react2.default.createElement(
                'div',
                null,
                _react2.default.createElement(
                  'span',
                  { className: 'arg-name' },
                  arg.name
                ),
                ': ',
                _react2.default.createElement(TypeLink, { type: arg.type, onClick: _this8.props.onClickType })
              ),
              _react2.default.createElement(MarkdownContent, {
                className: 'doc-value-description',
                markdown: arg.description
              })
            );
          })
        );
      }

      return _react2.default.createElement(
        'div',
        null,
        _react2.default.createElement(MarkdownContent, {
          className: 'doc-type-description',
          markdown: field.description || 'No Description'
        }),
        field.deprecationReason && _react2.default.createElement(MarkdownContent, {
          className: 'doc-alert-text',
          markdown: field.deprecationReason
        }),
        _react2.default.createElement(
          'div',
          { className: 'doc-category' },
          _react2.default.createElement(
            'div',
            { className: 'doc-category-title' },
            'type'
          ),
          _react2.default.createElement(TypeLink, { type: field.type, onClick: this.props.onClickType })
        ),
        argsDef
      );
    }
  }]);

  return FieldDoc;
}(_react2.default.Component);

// Renders a type link


FieldDoc.propTypes = {
  field: _react.PropTypes.object,
  onClickType: _react.PropTypes.func
};

var TypeLink = function (_React$Component7) {
  _inherits(TypeLink, _React$Component7);

  function TypeLink() {
    _classCallCheck(this, TypeLink);

    return _possibleConstructorReturn(this, (TypeLink.__proto__ || Object.getPrototypeOf(TypeLink)).apply(this, arguments));
  }

  _createClass(TypeLink, [{
    key: 'shouldComponentUpdate',
    value: function shouldComponentUpdate(nextProps) {
      return this.props.type !== nextProps.type;
    }
  }, {
    key: 'render',
    value: function render() {
      return renderType(this.props.type, this.props.onClick);
    }
  }]);

  return TypeLink;
}(_react2.default.Component);

TypeLink.propTypes = {
  type: _react.PropTypes.object,
  onClick: _react.PropTypes.func
};


function renderType(type, _onClick) {
  if (type instanceof _graphql.GraphQLNonNull) {
    return _react2.default.createElement(
      'span',
      null,
      renderType(type.ofType, _onClick),
      '!'
    );
  }
  if (type instanceof _graphql.GraphQLList) {
    return _react2.default.createElement(
      'span',
      null,
      '[',
      renderType(type.ofType, _onClick),
      ']'
    );
  }
  return _react2.default.createElement(
    'a',
    { className: 'type-name', onClick: function onClick(event) {
        return _onClick(type, event);
      } },
    type.name
  );
}

// Renders arbitrary markdown content

var MarkdownContent = function (_React$Component8) {
  _inherits(MarkdownContent, _React$Component8);

  function MarkdownContent() {
    _classCallCheck(this, MarkdownContent);

    return _possibleConstructorReturn(this, (MarkdownContent.__proto__ || Object.getPrototypeOf(MarkdownContent)).apply(this, arguments));
  }

  _createClass(MarkdownContent, [{
    key: 'shouldComponentUpdate',
    value: function shouldComponentUpdate(nextProps) {
      return this.props.markdown !== nextProps.markdown;
    }
  }, {
    key: 'render',
    value: function render() {
      var markdown = this.props.markdown;
      if (!markdown) {
        return _react2.default.createElement('div', null);
      }

      var html = (0, _marked2.default)(markdown, { sanitize: true });
      return _react2.default.createElement('div', {
        className: this.props.className,
        dangerouslySetInnerHTML: { __html: html }
      });
    }
  }]);

  return MarkdownContent;
}(_react2.default.Component);

MarkdownContent.propTypes = {
  markdown: _react.PropTypes.string,
  className: _react.PropTypes.string
};