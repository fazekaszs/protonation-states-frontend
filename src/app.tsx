import React, { useState } from 'react'
import * as mui from '@mui/material'
import pHTextField from './components/pHTextField'
import { reqBodyType, resBodyType, reqResPairType } from './types'
import { rootBoxStyle, inputBoxStyle } from './sxStyles'
import protonationDataTable from './components/protonationDataTable'
import parseSequence from './sequenceParser'

const App = () => {

    const [reqResPair, setReqResPair] = useState<reqResPairType | null>(null)

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

        const reqBody: reqBodyType = {
            sequence: parsedSeq,
            ph_range: ph_range,
            tol: Number.parseFloat(tol.toString())
        }

        const fetchResult = await fetch('http://localhost:8000/protonations', {
            method: 'POST',
            body: JSON.stringify(reqBody),
            headers: { 'Content-Type': 'application/json' }
        })
        const resBody: resBodyType = await fetchResult.json()

        setReqResPair({ req: reqBody, res: resBody })
    }

    return (
    <mui.Box sx={rootBoxStyle}>
        <mui.Box sx={{...inputBoxStyle, width: '25%'}} component='form' onSubmit={fetchApiData}>
        
            <mui.TextField 
                sx={{ width: '70%', margin: '10px' }} 
                multiline={true} 
                rows={10} 
                label='Insert Your sequence here!'
                name='sequence'
                required={true}
            />

            <mui.Box sx={{ display: 'flex', flexDirection: 'row', width: '70%', margin: '10px' }}>
                {pHTextField({formName: 'ph_start', label: 'start pH', defaultValue: '1.0'})}      
                {pHTextField({formName: 'ph_end', label: 'end pH', defaultValue: '13.0'})}      
                {pHTextField({formName: 'ph_step', label: 'delta pH', defaultValue: '0.5'})} 
                {pHTextField({formName: 'tol', label: 'tolerance', defaultValue: '0.001'})}
            </mui.Box>

            <mui.Button type='submit'>submit</mui.Button>

        </mui.Box>

        <mui.Box sx={{...inputBoxStyle, width: '90%', overflow: 'scroll'}}>
            {reqResPair ? protonationDataTable({ reqResPair }) : <p>Your data will appear here!</p>}
        </mui.Box>

    </mui.Box>
    )
}

// 

export default App
