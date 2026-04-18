export  function getTenderNumber(id: number): string {
  return `L-${id.toString().padStart(6, "0")}`;
}