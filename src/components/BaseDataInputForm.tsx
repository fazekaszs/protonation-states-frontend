
import * as mui from '@mui/material'
import React from 'react'

import { cardBoxStyle } from '../sxStyles'
import PHTextField from './PHTextField'
import { BaseDataType } from '../types'

type propsType = {
    baseDataSetter: React.Dispatch<React.SetStateAction<BaseDataType | null>>,
    disabled: boolean
}

const formDataParser = (event: React.FormEvent<HTMLFormElement>) => {

    const data = new FormData(event.currentTarget)
    const sequence = data.get('sequence') || ''
    const ph_start = data.get('ph_start') || ''
    const ph_end = data.get('ph_end') || ''
    const ph_step = data.get('ph_step') || ''
    const tol = data.get('tol') || ''

    const ph_range: [number, number, number] = [
        Number.parseFloat(ph_start.toString()), 
        Number.parseFloat(ph_end.toString()), 
        Number.parseFloat(ph_step.toString())
    ]

    const parsedFormData: BaseDataType = {
        sequence: sequence.toString(),
        ph_range: ph_range,
        tol: Number.parseFloat(tol.toString())
    }

    return parsedFormData
}

const BaseDataInputForm = (props: propsType) => {

    const submitHandler = (event: React.FormEvent<HTMLFormElement>) => {

        event.preventDefault()

        if (!props.disabled) {
            const parsedData = formDataParser(event)
            props.baseDataSetter(parsedData)
        } else props.baseDataSetter(null)

    }

    return(
        <mui.Box sx={{...cardBoxStyle, width: '40%'}} component='form' onSubmit={submitHandler}>
        
            <mui.TextField 
                sx={{ width: '80%', margin: '10px' }} 
                multiline={true} 
                rows={10} 
                label='Insert Your sequence here!'
                name='sequence'
                required={true}
                disabled={props.disabled}
            />

            <mui.Box sx={{ display: 'flex', flexDirection: 'row', width: '80%', margin: '10px' }}>
                <PHTextField formName='ph_start' label='start pH' defaultValue='1.0' disabled={props.disabled} />
                <PHTextField formName='ph_end' label='end pH' defaultValue='13.0' disabled={props.disabled} />
                <PHTextField formName='ph_step' label='delta pH' defaultValue='0.5' disabled={props.disabled} />
                <PHTextField formName='tol' label='tolerance' defaultValue='0.001' disabled={props.disabled} />
            </mui.Box>

            <mui.Button type='submit' sx={{ color: props.disabled ? 'red' : 'green' }}>
                {props.disabled ? "uncommit sequence" : "commit sequence"}
            </mui.Button>

        </mui.Box>
    )
}

export default BaseDataInputForm