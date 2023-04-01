const c = new CompressionStream("gzip");
const w = c.writable.getWriter();

export async function fuzzTarget(data: Uint8Array) {
  await w.write(data);
}
