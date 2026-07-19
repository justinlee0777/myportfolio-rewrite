import type { TreeNode } from '@/components/Tree/Tree';

interface LabelNode extends TreeNode<CustomTreeNode> {
  label: string;
}

export type CustomTreeNode = LabelNode;
