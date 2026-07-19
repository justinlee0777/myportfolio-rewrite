export function* dynasticOrder(node: HTMLDivElement): Generator<HTMLElement> {
  let left, right;

  if (node.children) {
    [left, right] = node.querySelectorAll(
      `:scope > .children:not(.lines) > .nodeContainer`,
    );
  }

  yield node.querySelector(':scope > .node')!;

  for (const child of node.querySelectorAll(
    `:scope > .children:not(.lines) > .nodeContainer`,
  )) {
    yield* dynasticOrder(child as HTMLDivElement);
  }
}
