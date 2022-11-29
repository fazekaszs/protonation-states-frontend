export type BaseDataType = { sequence: string, ph_range: number[], tol: number }

export type ModifierMapType = Record<string, { remove: boolean, pka: number | null }>

export type ReqBodyType = { sequence: string[], ph_range: number[], tol: number }
export type ResBodyType = Record<string, number>[]
export type ReqResPairType = { req: ReqBodyType, res: ResBodyType }