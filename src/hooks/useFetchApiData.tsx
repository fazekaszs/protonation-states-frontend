import { useState } from 'react'
import parseSequence from '../sequenceParser'
import { ReqBodyType, ResBodyType, ReqResPairType, BaseDataType, ModifierMapType } from '../types'

type HookReturnType = [
    ReqResPairType | null,
    (baseData: BaseDataType, modifiers: ModifierMapType) => Promise<void>
]

const useFetchApiData = (): HookReturnType => {

    const [reqResPair, setReqResPair] = useState<ReqResPairType | null>(null)

    const fetchApiData = async (baseData: BaseDataType, modifiers: ModifierMapType) => {

        const parsedSeq = parseSequence(baseData.sequence, modifiers)
        if (!parsedSeq) {
            console.log("FAILED")
            return
        }

        const reqBody: ReqBodyType = {
            sequence: parsedSeq,
            ph_range: baseData.phRange,
            tol: baseData.tol
        }

        const backendPort: string = process.env.BACKEND_PATH ? process.env.BACKEND_PATH : 'http://localhost:8181/protonations'

        const fetchResult = await fetch(backendPort, {
            method: 'POST',
            body: JSON.stringify(reqBody),
            headers: { 'Content-Type': 'application/json' }
        })
        const resBody: ResBodyType = await fetchResult.json()

        setReqResPair({ req: reqBody, res: resBody })
    }

    return [reqResPair, fetchApiData]
}

export default useFetchApiData