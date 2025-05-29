export type TRows = string[][];

type TPipe = (
  ...func: Array<(args: unknown) => unknown>
) => (x: unknown) => unknown;
export const pipe: TPipe =
  (...func) =>
  x =>
    func.reduce((args, f, acc) => f(args), x);
