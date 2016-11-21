var _graphql = require('graphql');

export default function transpile(query) {
	var operationName,
  	source = new _graphql.Source(query, 'GraphQL request'),
  	documentAST = (0, _graphql.parse)(source),
    operationAST = (0, _graphql.getOperationAST)(documentAST, operationName);

  function selectionSetVisitor(selectionSet) {
    return selectionSet.selections.map(selectionVisitor);
  }

  function selectionVisitor(selection) {
    return {
      name: selection.name.value,
      selectionSet: selection.selectionSet ? selectionSetVisitor(selection.selectionSet) : null
    }
  }

  var slimTree = selectionSetVisitor(operationAST.selectionSet);

  function traverseFields(selectionSet, wrap) {
    var fields = selectionSet.map((selection) => {
      if (selection.selectionSet)
        return [selection.name, traverseFields(selection.selectionSet, true)];
      else
        return selection.name;
    });

     fields = fields.join(',');

    if (wrap)
      return `(${fields})`.replace(',(', '(');
    else
      return fields.replace(',(', '(');
  }


  var result = slimTree.map((st) => {
    var fields = traverseFields(st.selectionSet);
    return st.name + '?fields=' + fields;
  })

  return result[0];
}
