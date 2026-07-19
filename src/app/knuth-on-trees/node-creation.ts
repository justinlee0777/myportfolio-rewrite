import { CustomTreeNode } from './custom-tree-node.model';

export function createNodesFromNumberedList(
  text: string,
): Array<CustomTreeNode> {
  const matches = Array.from(text.matchAll(/([\d|\.]+) (.+)/g));

  const numberWordPairs = matches.map((match) => match.slice(1, 3));

  const rootNodes: Array<CustomTreeNode> = [];

  for (const [number, word] of numberWordPairs) {
    const indices = number
      .split('.')
      .filter(Boolean)
      .map(Number)
      .map((i) => i - 1);

    const path = indices.slice(0, -1),
      [toAdd] = indices.slice(-1);

    let nodes = rootNodes;

    for (const i of path) {
      nodes = (nodes[i].children ?? []) as Array<CustomTreeNode>;
    }

    nodes[toAdd] = {
      label: word,
      children: [],
    };
  }

  return rootNodes;
}

export function createNodesFromIndentation(
  text: string,
  whitespaces = 4,
): Array<CustomTreeNode> {
  const lines = text.split('\n');

  const indent = Array(whitespaces)
    .fill(undefined)
    .map(() => ' ')
    .join('');

  const rootNodes: Array<CustomTreeNode> = [];

  for (let line of lines) {
    let nodes = rootNodes;
    while (line.startsWith(indent)) {
      line = line.slice(indent.length);
      nodes = nodes[nodes.length - 1].children! as Array<CustomTreeNode>;
    }

    nodes.push({
      label: line,
      children: [],
    });
  }

  return rootNodes;
}

export function createNodesFromParentheses(
  text: string,
): Array<CustomTreeNode> {
  if (text[0] !== '(') {
    // The first character must be an opening parenthesis.
    return [];
  }

  const rootNodes: Array<CustomTreeNode> = [];

  let currentDepth = 0;

  let i = 0;

  while (i < text.length) {
    const c = text[i];
    if (c === '(') {
      currentDepth++;
      i++;
    } else if (c === ')') {
      currentDepth--;
      i++;
    } else {
      const remainingText = text.slice(i);

      // Basically, get all text that precedes a ( or )
      const labelRegex = /(.*?)[\(|\)]/;

      const [, label] = remainingText.match(labelRegex)!;

      let nodes = rootNodes,
        d = 0;

      while (d < currentDepth - 1) {
        nodes = nodes[nodes.length - 1].children! as Array<CustomTreeNode>;
        d++;
      }

      nodes.push({
        label,
        children: [],
      });

      i += label.length;
    }
  }

  return rootNodes;
}
