// All of these algorithms assume there are at most two children for a node.

export function* inOrder(node) {
  let left, right;

  if (node.children) {
    [left, right] = node.querySelectorAll(
      `:scope > .children:not(.lines) > .nodeContainer`,
    );
  }

  if (left) {
    yield* inOrder(left);
  }

  yield node.querySelector(':scope > .node');

  if (right) {
    yield* inOrder(right);
  }
}

export function* preOrder(node) {
  let left, right;

  if (node.children) {
    [left, right] = node.querySelectorAll(
      `:scope > .children:not(.lines) > .nodeContainer`,
    );
  }

  yield node.querySelector(':scope > .node');

  if (left) {
    yield* preOrder(left);
  }

  if (right) {
    yield* preOrder(right);
  }
}

export function* postOrder(node) {
  let left, right;

  if (node.children) {
    [left, right] = node.querySelectorAll(
      `:scope > .children:not(.lines) > .nodeContainer`,
    );
  }

  if (left) {
    yield* postOrder(left);
  }

  if (right) {
    yield* postOrder(right);
  }

  yield node.querySelector(':scope > .node');
}
