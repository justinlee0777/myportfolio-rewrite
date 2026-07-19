import { CustomTreeNode } from './custom-tree-node.model';

export function makeBinaryTree(
  trees: Array<CustomTreeNode>,
): CustomTreeNode | null {
  if (trees.length === 0) {
    return null;
  } else {
    const [tree, ...remainingTree] = trees;

    const leftNode = makeBinaryTree(
      (tree.children?.filter(Boolean) ?? []) as Array<CustomTreeNode>,
    );

    const rightNode = makeBinaryTree(remainingTree);

    const clone = structuredClone(tree);

    // I'm not going to bother to get the type definitions right for this one little exercise.
    clone.children = [leftNode, rightNode];

    return clone;
  }
}
