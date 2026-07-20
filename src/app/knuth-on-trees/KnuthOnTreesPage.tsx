'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

import { RenderNode, Tree } from '@/components/Tree/Tree';
import { Radiogroup } from '@/components/Radiogroup/Radiogroup';
import { concatGenerators } from '@/utils/generators';
import { CodeExample } from '@/components/CodeExample';

import { CustomTreeNode } from './custom-tree-node.model';
import {
  createNodesFromIndentation,
  createNodesFromNumberedList,
  createNodesFromParentheses,
} from './node-creation';
import { makeBinaryTree } from './make-binary-tree';
import { preOrder, inOrder, postOrder } from './binary-traversal';
import { dynasticOrder } from './dynastic-order';

interface Props {
  noahFamilyTree: string;
  indentRepresentation: string;
  listRepresentation: string;
  parenthesisRepresentation: string;
  englishLineage: string;
}

type BinaryTraversal = 'Pre-order' | 'Post-order' | 'In-order';

export function KnuthOnTreesPage({
  noahFamilyTree,
  indentRepresentation,
  listRepresentation,
  parenthesisRepresentation,
  englishLineage,
}: Props) {
  const noahFamilyBinaryTreeRef = useRef<HTMLDivElement | null>(null),
    englishLineageTreeRef = useRef<HTMLDivElement | null>(null);

  const [indentString, setIndentString] = useState(indentRepresentation),
    [executedIndentString, setExecutedIndentString] = useState(indentString);

  const [listString, setListString] = useState(listRepresentation),
    [executedListString, setExecutedListString] = useState(listString);

  const [parenthesisString, setParenthesisString] = useState(
      parenthesisRepresentation,
    ),
    [executedParenthesisString, setExecutedParenthesisString] =
      useState(parenthesisString);

  const [binaryTraversal, setBinaryTraversal] =
    useState<BinaryTraversal>('Pre-order');

  const indentNodes = createNodesFromIndentation(executedIndentString),
    listNodes = createNodesFromNumberedList(executedListString),
    parenthesisNodes = createNodesFromParentheses(executedParenthesisString);

  let traversalAlgorithm: (node: HTMLDivElement) => Generator<HTMLElement>;

  switch (binaryTraversal) {
    case 'Pre-order':
      traversalAlgorithm = preOrder;
      break;
    case 'In-order':
      traversalAlgorithm = inOrder;
      break;
    case 'Post-order':
      traversalAlgorithm = postOrder;
      break;
  }

  const noahFamilyTreeNodes = createNodesFromNumberedList(noahFamilyTree),
    noahFamilyBinaryTreeNodes = makeBinaryTree(noahFamilyTreeNodes)!,
    englishLineageNodes = createNodesFromNumberedList(englishLineage);

  const animateTree = useCallback(
    (
      treeElement: HTMLDivElement,
      traversal: (node: HTMLDivElement) => Generator<HTMLElement>,
    ) => {
      const createGenerator = () =>
        concatGenerators(
          traversal(treeElement.querySelector(':scope > .nodeContainer')!),
        );

      let generator: Generator<HTMLElement> = createGenerator();

      const intervalId = setInterval(() => {
        const { value, done } = generator.next();

        treeElement
          .querySelectorAll('.node')
          .forEach((node) => ((node as HTMLElement).style.filter = ''));

        if (done) {
          generator = createGenerator();
        } else {
          value.style.filter = 'invert(1)';
        }
      }, 600);

      return () => {
        clearInterval(intervalId);
        generator.return(null);
      };
    },
    [],
  );

  useEffect(() => {
    const noahTreeElement = noahFamilyBinaryTreeRef.current;

    if (noahTreeElement) {
      return animateTree(noahTreeElement, traversalAlgorithm);
    }
  }, [noahFamilyBinaryTreeRef, traversalAlgorithm]);

  useEffect(() => {
    const englishTreeElement = englishLineageTreeRef.current;

    if (englishTreeElement) {
      return animateTree(englishTreeElement, dynasticOrder);
    }
  }, [englishLineageTreeRef]);

  const renderNode: RenderNode<CustomTreeNode> = useCallback((_, node) => {
    return <span>{node.label}</span>;
  }, []);

  return (
    <div className="knuthOnTreesPage">
      <h1>Knuth on Trees</h1>
      <p>
        Knuth has a charming chapter on Trees in the first book of his famous
        "The Art of Computer Programming".
      </p>
      <p>
        I happened to have been bored enough to write some frontend code
        rendering Trees.
      </p>
      <p>Per Knuth's example:</p>
      <div className="trees">
        {noahFamilyTreeNodes.map((node, i) => {
          return (
            <Tree<CustomTreeNode> key={i} root={node} renderNode={renderNode} />
          );
        })}
      </div>

      <p>Yeah, Knuth went hard, didn't he.</p>
      <p>This is the code in node form:</p>
      <pre>
        <p className="exampleJSON" tabIndex={0}>
          {JSON.stringify(noahFamilyTreeNodes, null, 2)}
        </p>
      </pre>
      <p>
        Something that bothered me in developing these trees is how repetitive
        and "wide" they can be.
      </p>
      <p>
        Basically, the most elegant form of the tree, is the tree itself. The
        boilerplate, in contrast, is very messy.
      </p>
      <p>
        Is there a way to remedy this? Fortunately, Knuth had some handy
        answers.
      </p>
      <p>
        He shows a few representations of a tree, most of which I'll show (the
        nested sets representation doesn't lend well to text format).
      </p>

      <p>
        The first up is an indent-based tree. Basically, the indentation level
        is the depth of the branch. One weakness is that these have to be in
        sequential order. (The below uses 4 spaces for indentation.)
      </p>

      <textarea
        aria-label="Indent tree editor"
        value={indentString}
        rows={6}
        onChange={(event) => setIndentString(event.target.value)}
      />

      <p>
        <button onClick={() => setExecutedIndentString(indentString)}>
          Calculate
        </button>
      </p>

      <div className="trees">
        {indentNodes.map((node, i) => (
          <Tree<CustomTreeNode> key={i} root={node} renderNode={renderNode} />
        ))}
      </div>

      <p>
        The second is a list-based system, using the list number to determine
        placement on the tree. What's interesting about this is that this allows
        the client to define the nodes out-of-order.
      </p>

      <textarea
        aria-label="List tree editor"
        value={listString}
        rows={6}
        onChange={(event) => setListString(event.target.value)}
      />

      <p>
        <button onClick={() => setExecutedListString(listString)}>
          Calculate
        </button>
      </p>

      <div className="trees">
        {listNodes.map((node, i) => (
          <Tree<CustomTreeNode> key={i} root={node} renderNode={renderNode} />
        ))}
      </div>

      <p>
        The last is a parenthesis-based system. The first string within a
        parenthesis is the node name, and what remains are child definitions.
        This one personally gets hard to read.
      </p>

      <textarea
        aria-label="Parenthesis tree editor"
        value={parenthesisString}
        rows={6}
        onChange={(event) => setParenthesisString(event.target.value)}
      />

      <p>
        <button onClick={() => setExecutedParenthesisString(parenthesisString)}>
          Calculate
        </button>
      </p>

      <div className="trees">
        {parenthesisNodes.map((node, i) => (
          <Tree<CustomTreeNode> key={i} root={node} renderNode={renderNode} />
        ))}
      </div>

      <p>
        Ultimately, what struck me as the most elegant and easiest form to write
        was the list representation. It's just easy to keep track of.
      </p>
      <p>And so, this is the opening example in list representation form:</p>
      <pre>
        <p className="exampleText" tabIndex={0}>
          {noahFamilyTree}
        </p>
      </pre>

      <p>
        These are quite wide and cumbersome in themselves. One can easily see
        how difficult it is for a writer to remember each bullet.
      </p>

      <h2>Binary Trees and Traversal</h2>
      <p>
        Knuth has an eye-popping algorithm for converting n-ary trees to binary
        trees. <code>B(F)</code> is the function transforming the n-ary tree to
        the binary tree. I quote this directly from my edition:
      </p>

      <ul>
        <li>If n = 0, B(F) is empty.</li>
        <li>
          If n {'>'} 0, the root of B(F) is root(T1); the left subtree of B(F)
          is B(T11, T12, ..., T1m), where T11, T12, ..., T1m are the subtrees of
          root(T1); and the right subtree of B(F) is B(T2, ..., Tn).
        </li>
      </ul>

      <p>
        We can combine this with Knuth's categories of binary tree traversal:
        pre-order, in-order, post-order. The code is below.
      </p>

      <p>And so, we have the converted family tree of Noah:</p>

      <div className="trees">
        <Tree<CustomTreeNode>
          ref={noahFamilyBinaryTreeRef}
          root={noahFamilyBinaryTreeNodes}
          renderNode={renderNode}
        />
      </div>

      <Radiogroup<BinaryTraversal>
        header="Binary traversal"
        type="radio"
        id="binary-traversal-options"
        selected={binaryTraversal}
        onChange={setBinaryTraversal}
        options={[
          {
            label: 'Pre-order',
            value: 'Pre-order',
          },
          {
            label: 'In-order',
            value: 'In-order',
          },
          {
            label: 'Post-order',
            value: 'Post-order',
          },
        ]}
      />

      <CodeExample code={traversalAlgorithm} hideRunner />

      <p>
        Knuth does mention the traversal order for n-ary trees, but those are
        more boring because n-ary trees are less structured than binary trees.
        However, he mentions that n-ary pre-order is dynastic order. So why not
        check it out? Knuth provides us with the lineage of English monarchs:
      </p>

      <pre>
        <p className="exampleText" tabIndex={0}>
          {englishLineage}
        </p>
      </pre>

      <div className="trees">
        {englishLineageNodes.map((node, i) => {
          return (
            <Tree<CustomTreeNode>
              key={i}
              ref={englishLineageTreeRef}
              root={node}
              renderNode={renderNode}
            />
          );
        })}
      </div>

      <p>
        And so we see in real-time the order of succession of the English royal
        line.
      </p>

      <p>
        I actually find Knuth simultaneously both really interesting and really
        boring. The programming part is surprisingly the most boring part of the
        book, and though Knuth insists one do the exercise sets, it's not
        immediately clear what one learns from them. However, the conceptual
        stuff is extremely interesting. Overall I would love to have all the
        volumes, but based on Knuth's instructions I don't think I have the mind
        suitable for his teaching style.
      </p>

      <p>
        I don't know why I devoted so much time to prepare this page. Hopefully
        it amuses you as it half-did for me.
      </p>
    </div>
  );
}
