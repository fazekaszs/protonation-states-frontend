import { useState } from 'react'
import parseSequence from '../sequenceParser'
import { ReqBodyType, ResBodyType, ReqResPairType, BaseDataType, ModifierMapType } from '../types'

type HookReturnType = [
    ReqResPairType | null,
    (baseData: BaseDataType, modifiers: ModifierMapType, pkaTableIdx: number) => Promise<void>
]

const useFetchApiData = (): HookReturnType => {

    const [reqResPair, setReqResPair] = useState<ReqResPairType | null>(null)

    const fetchApiData = async (baseData: BaseDataType, modifiers: ModifierMapType, pkaTableIdx: number) => {

        const parsedSeq = parseSequence(baseData.sequence, modifiers, pkaTableIdx)
        if (!parsedSeq) {
            console.error(`FAILED: I was unable to parse the sequence! The sequence is:\n${baseData.sequence}`)
            return
        }

        const reqBody: ReqBodyType = {
            sequence: parsedSeq,
            ph_range: baseData.phRange,
            tol: baseData.tol
        }

        const backendPort = process.env.REACT_APP_BACKEND_PATH

        if (!backendPort) {
            console.error('FAILED: I was unable to access the environmental variable \"REACT_APP_BACKEND_PATH\"!')
            return            
        }

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