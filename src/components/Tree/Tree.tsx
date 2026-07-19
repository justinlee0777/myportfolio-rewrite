import './Tree.css';

import clsx from 'clsx';
import { RefObject, useEffect, useMemo, useState, type JSX } from 'react';

export type NodeId = Array<{
  position: number;
}>;

// Figure out how to hide nodes intelligently based on viewport size
// This actually might be easier just to pass to the client i.e. when to render node
// Or, allow the client to configure at which breakpoints to render / not render a node

// OR, only show the first two levels and show further levels when its specific parent has been expanded.
// Another idea is, only show the path to the activated node, do not show extraneous nodes

export interface TreeNode<NodeType extends TreeNode<NodeType>> {
  children?: Array<NodeType | null>;
}

interface Classes<NodeType extends TreeNode<NodeType>> {
  node: (nodeId: NodeId, node: NodeType) => string;
}

interface AddNode {
  (nodeId: NodeId): void;
}

interface ActivateNode<NodeType extends TreeNode<NodeType>> {
  (nodes: NodeId, node: NodeType): void;
}

interface NodeState {
  activated: {
    partial: boolean;
    exact: boolean;
  };
}

export interface RenderNode<NodeType extends TreeNode<NodeType>> {
  (nodeId: NodeId, node: NodeType, state: NodeState): JSX.Element | Symbol;
}

interface Props<NodeType extends TreeNode<NodeType>> {
  root: NodeType;

  ref?: RefObject<HTMLDivElement | null>;

  mobileMediaQuery?: string;

  activatedNode?: NodeId;

  classes?: Classes<NodeType>;

  renderNode?: RenderNode<NodeType>;

  /** TODO: Remember to focus on new node. */
  addNode?: AddNode;

  activateNode?: ActivateNode<NodeType>;
}

function isPartOfNode(node: NodeId, path: NodeId): boolean {
  return node.every(({ position }, i) => {
    const node = path.at(i);

    return node ? node.position === position : false;
  });
}

function isNode(node: NodeId, path: NodeId): boolean {
  if (node.length !== path.length) {
    return false;
  }

  return isPartOfNode(node, path);
}

function getChildren<NodeType extends TreeNode<NodeType>>(
  node: NodeType,
): Array<NodeType> {
  return (node.children?.filter(Boolean) ?? []) as Array<NodeType>;
}

export function Tree<NodeType extends TreeNode<NodeType>>({
  ref,
  root,
  classes,
  mobileMediaQuery,
  activatedNode,
  addNode,
  renderNode,
  activateNode,
}: Props<NodeType>): JSX.Element {
  const addFn: AddNode = useMemo(() => {
    return addNode ?? (() => {});
  }, [addNode]);

  const renderFn: RenderNode<NodeType> = useMemo(() => {
    return renderNode ?? (() => <></>);
  }, [renderNode]);

  const [mobileView, setMobileView] = useState(false);

  useEffect(() => {
    if (mobileMediaQuery) {
      const mql = window.matchMedia(mobileMediaQuery);
      const handleChange = () => setMobileView(mql.matches);

      handleChange();
      mql.addEventListener('change', handleChange);
      return () => mql.removeEventListener('change', handleChange);
    }
  }, [mobileMediaQuery]);

  return (
    <div
      ref={ref}
      className={clsx('tree', {
        mobileView,
      })}
      tabIndex={0}
    >
      <TreeNode
        classes={classes}
        node={root}
        nodeId={[{ position: 0 }]}
        children={getChildren(root)}
        lastChild
        activatedNode={activatedNode}
        onAdd={addFn}
        onActivate={activateNode}
        render={renderFn}
      />
    </div>
  );
}

interface TreeNodeProps<NodeType extends TreeNode<NodeType>> {
  node: NodeType;

  nodeId: NodeId;

  lastChild: boolean;

  children: Array<NodeType | null>;

  activatedNode?: NodeId;

  render: RenderNode<NodeType>;
  onAdd: AddNode;
  onActivate?: ActivateNode<NodeType>;

  classes?: Classes<NodeType>;
}

function TreeNode<NodeType extends TreeNode<NodeType>>({
  node,
  nodeId,
  lastChild,
  children,
  ...passedDownProps
}: TreeNodeProps<NodeType>): JSX.Element {
  let partiallyActivated = false,
    exactActivated = false;

  if (passedDownProps.activatedNode) {
    partiallyActivated = isPartOfNode(nodeId, passedDownProps.activatedNode);

    exactActivated = isNode(nodeId, passedDownProps.activatedNode);
  }

  const renderedContent = passedDownProps.render(nodeId, node, {
    activated: { partial: partiallyActivated, exact: exactActivated },
  });

  const firstChild = nodeId.at(-1)!.position === 0;

  const nodeClasses = passedDownProps.classes?.node(nodeId, node);

  return (
    <div
      className={clsx('nodeContainer', {
        firstNode: firstChild,
        lastNode: lastChild,
      })}
    >
      <div className={clsx('children', 'lines')}>
        <div className="horizontalLine"></div>
        <div className="horizontalLine"></div>
      </div>
      {nodeId.length > 1 && <div className="verticalLine"></div>}
      <div
        role="button"
        className={clsx('node', nodeClasses, {
          nodeActivated: partiallyActivated,
          nodeExact: exactActivated,
        })}
        onClick={() => passedDownProps.onActivate?.(nodeId, node)}
      >
        {renderedContent as JSX.Element}
      </div>
      {(children.length ?? 0) > 1 && <div className="verticalLine"></div>}
      <div className="children">
        {children.map((child, i) => (
          <TreeNode
            key={i}
            node={child!}
            nodeId={nodeId.concat({ position: i })}
            children={getChildren(child!)}
            lastChild={i === children.length - 1}
            {...passedDownProps}
          />
        ))}
      </div>
    </div>
  );
}
