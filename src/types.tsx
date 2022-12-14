export type BaseDataType = { sequence: string, phRange: [number, number, number], tol: number }

export type ModifierMapType = {[x: string]: { 
    remove: boolean, 
    pka: number | null, 
    ionType: string | null
}}

export type ReqBodyType = { sequence: string[], ph_range: [number, number, number], tol: number }
export type ResBodyType = {[x: string]: number}[]
export type ReqResPairType = { req: ReqBodyType, res: ResBodyType }