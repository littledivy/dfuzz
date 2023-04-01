const { dlopen } = Deno;

const { symbols } = dlopen("./libfuzzer.dylib", {
  // extern "C" int LLVMFuzzerRunDriver(int *argc, char ***argv,
  //     int (*UserCb)(const uint8_t *Data, size_t Size));
  LLVMFuzzerRunDriver: {
    parameters: ["buffer", "buffer", "pointer"],
    result: "i32",
  },
  // extern "C" int DenoLLVMFuzzerRunDriver(int (*UserCb)(const uint8_t *Data, size_t Size));
  DenoLLVMFuzzerRunDriver: {
    parameters: ["pointer"],
    result: "i32",
  },
  DenoLLVMFuzzerRunDriverAsync: {
    parameters: ["pointer"],
    result: "i32",
    name: "DenoLLVMFuzzerRunDriver",
    nonblocking: true,
  },
  // extern "C" void DenoAbortProcess();
  DenoAbortProcess: {
    parameters: [],
    result: "void",
  },
});

const { DenoLLVMFuzzerRunDriver, DenoLLVMFuzzerRunDriverAsync } = symbols;

async function loadFuzzFunction(module: string) {
  const mod = await import(module);

  if (typeof mod.fuzzTarget !== "function") {
    throw new Error("fuzzTarget function not found");
  }

  const async = mod.fuzzTarget.constructor.name === "AsyncFunction";

  async function fuzzTarget(
    data: Deno.PointerValue,
    size: number,
  ): Promise<number> {
    // Do something with the data.
    const buffer = Deno.UnsafePointerView.getArrayBuffer(data!, size);

    try {
      const int = await mod.fuzzTarget(new Uint8Array(buffer));
      if (int) return int;
    } catch (e) {
      const error = new Error(e.message);
      error.stack = e.stack;
      console.error(error);
      Deno.exit(1);
    }

    return 0;
  }

  const userCb = Deno.UnsafeCallback.threadSafe({
    parameters: ["pointer", "i32"],
    result: "i32",
  }, fuzzTarget as any);

  if (async) {
    return DenoLLVMFuzzerRunDriverAsync(userCb.pointer);
  }
  return DenoLLVMFuzzerRunDriver(userCb.pointer);
}

await loadFuzzFunction("./fuzz_target.ts");
