## dfuzz

Fuzzing JS/TS code with LLVM libFuzzer.

## Installation

```
deno install -Afn --unstable dfuzz https://deno.land/x/fuzz/fuzzer.ts
```

## Usage

```ts
export function fuzzTarget(input: Uint8Array): void {
  // ...
}
```

```
dfuzz fuzz_target.ts
```

## Trophy case

List of bugs found with dfuzz.

- Did dfuzz help you find a bug? Please add it to the list.

## License

All files in libfuzzer directory are licensed NCSA. All other files are licensed
under MIT license.
