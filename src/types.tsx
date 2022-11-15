export type reqBodyType = { sequence: string[], ph_range: number[], tol: number }
export type resBodyType = Record<string, number>[]
export type reqResPairType = { req: reqBodyType, res: resBodyType }