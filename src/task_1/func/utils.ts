export type TRows = string[][];

type TPipe = (...func: ((args: any) => any)[]) => (x: any) => any;
export const pipe: TPipe =
  (...func) =>
  x =>
    func.reduce((args, f, acc) => f(args), x);
