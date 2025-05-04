export interface Tree {
  x: number;
  height: number;
  leafHeight: number;
}

export const createTree = (i: number, treeHeight: number) => {
  return {
    x: 150 + i * 200,
    height: treeHeight,
    leafHeight: treeHeight - 20,
  };
};
