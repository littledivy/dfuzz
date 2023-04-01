CC = clang++
CFLAGS = -std=c++17 -w -fno-omit-frame-pointer -fsanitize=fuzzer-no-link -fno-sanitize=undefined -DCOMPILER_RT_SANITIZERS_TO_BUILD="" -g -O3 -shared -fPIC

UNAME_S := $(shell uname -s)
ifeq ($(UNAME_S),Linux)
	TARGET = libfuzzer.so
endif
ifeq ($(UNAME_S),Darwin)
	TARGET = libfuzzer.dylib
endif

SOURCES = $(filter-out libfuzzer/FuzzerMain.cpp, $(wildcard libfuzzer/*.cpp)) fuzzer.cc

build:
	$(CC) $(CFLAGS)  $(SOURCES) -o $(TARGET)