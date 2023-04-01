#ifndef DENO_LLVM_FUZZER_H
#define DENO_LLVM_FUZZER_H

#include "libfuzzer/FuzzerDefs.h"
#include "libfuzzer/FuzzerPlatform.h"

#include <cstdlib>

__attribute__((no_sanitize("coverage")))
extern "C" ATTRIBUTE_INTERFACE int
DenoLLVMFuzzerRunDriver(int (*UserCb)(const uint8_t *Data, size_t Size)) {
  int argc = 1;
  char **argv = (char **)malloc(sizeof(char *) * 2);
  argv[0] = "deno";
  argv[1] = nullptr;
  return fuzzer::FuzzerDriver(&argc, &argv, UserCb);
}

extern "C" ATTRIBUTE_INTERFACE void DenoAbortProcess() {
  std::abort();
}

#endif  // DENO_LLVM_FUZZER_H