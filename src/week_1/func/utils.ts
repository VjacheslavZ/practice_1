export type TRows = string[][];

type TPipe = (...func: Array<(args: any) => any>) => (x: any) => any;
export const pipe: TPipe =
  (...func) =>
  x =>
    func.reduce((args, f) => f(args), x);
