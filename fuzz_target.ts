export function fuzzTarget(data: Uint8Array): void {
  // Do something with the data.
  try { atob(String.fromCharCode(...data)) } catch (e) {}
  atob(String.fromCharCode(...data));
}
