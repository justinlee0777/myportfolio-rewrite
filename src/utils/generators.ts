export function* concatGenerators<Value>(
  ...generators: Array<Generator<Value>>
) {
  for (const gen of generators) {
    yield* gen;
  }
}
