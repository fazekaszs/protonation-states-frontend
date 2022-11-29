import React, { useState } from 'react'
import parseSequence from '../sequenceParser'
import { ReqBodyType, ResBodyType, ReqResPairType } from '../types'

const useFetchApiData = () => {

    const [reqResPair, setReqResPair] = useState<ReqResPairType | null>(null)

    const fetchApiData = async (event: React.FormEvent<HTMLFormElement>) => {

        event.preventDefault()

        const data = new FormData(event.currentTarget)
        const sequence = data.get('sequence') || ''
        const ph_start = data.get('ph_start') || ''
        const ph_end = data.get('ph_end') || ''
        const ph_step = data.get('ph_step') || ''
        const tol = data.get('tol') || ''

        const ph_range = [
            Number.parseFloat(ph_start.toString()), 
            Number.parseFloat(ph_end.toString()), 
            Number.parseFloat(ph_step.toString())
        ]

        const parsedSeq = parseSequence(sequence.toString())
        if (!parsedSeq) {
            console.log("FAILED")
            return
        }

        const reqBody: ReqBodyType = {
            sequence: parsedSeq,
            ph_range: ph_range,
            tol: Number.parseFloat(tol.toString())
        }

        const fetchResult = await fetch('http://localhost:8000/protonations', {
            method: 'POST',
            body: JSON.stringify(reqBody),
            headers: { 'Content-Type': 'application/json' }
        })
        const resBody: ResBodyType = await fetchResult.json()

        setReqResPair({ req: reqBody, res: resBody })
    }

    return {getter: reqResPair, setter: fetchApiData}
}

export default useFetchApiData