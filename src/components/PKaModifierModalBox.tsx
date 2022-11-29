import * as mui from '@mui/material'
import { useState } from 'react'
import { BaseDataType, ModifierMapType } from '../types'

const modalBoxStyle = { 
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center', 
    position: 'absolute', 
    top: '50%', 
    left: '50%', 
    transform: 'translate(-50%, -50%)',
    backgroundColor: 'white',
    alignItems: 'center',
    padding: '10px',
    border: '1px solid rgba(100, 100, 100, 0.1)',
    borderRadius: '10px',
    boxShadow: '5px 5px 4px rgba(100, 100, 100, 0.3)',
    width: '30%'
}

type PropsType = {
    baseData: BaseDataType,
    modifiers: ModifierMapType,
    setModalState: React.Dispatch<React.SetStateAction<boolean>>,
}

const createAllowedModifiers = (sequence: string, modifiers: ModifierMapType) => {

    let allowedModifiers = []

    const ntKey = `0 ${sequence[0]} NT`
    if (!(ntKey in modifiers)) allowedModifiers.push(ntKey)

    for (let idx = 0; idx < sequence.length; idx++) {
        const scKey = `${idx} ${sequence[idx]} SC`
        if (!(scKey in modifiers)) allowedModifiers.push(scKey)
    }

    const lastIdx = sequence.length - 1
    const ctKey = `${lastIdx} ${sequence[lastIdx]} CT`
    if (!(ctKey in modifiers)) allowedModifiers.push(ctKey)

    return allowedModifiers

}

const PKaModifierModalBox = (props: PropsType) => {

    const [selectedKey, setSelectedKey] = useState<string>('')
    const [removeIsChecked, setRemoveIsChecked] = useState<boolean>(false)

    const allowedModifiers = createAllowedModifiers(props.baseData.sequence, props.modifiers)

    const submitHandler = (event: React.FormEvent<HTMLFormElement>) => {

        event.preventDefault()

        const data = new FormData(event.currentTarget)
        const pka = data.get('pka') || ''

        props.modifiers[selectedKey] = {
            remove: removeIsChecked,
            pka: removeIsChecked ? null : Number.parseFloat(pka.toString())
        }

        props.setModalState(false)
    }

    return (
        <mui.Box sx={modalBoxStyle} component='form' onSubmit={submitHandler}>

            <mui.FormControl fullWidth={true} sx={{ margin: '10px' }}>
                <mui.InputLabel>Residue</mui.InputLabel>
                <mui.Select 
                    labelId='residue-label' 
                    value={selectedKey} 
                    onChange={(event) => setSelectedKey(event.target.value)} 
                    label={'Residue'}
                    name='residue'
                    required={true}
                >{allowedModifiers.map((m) => <mui.MenuItem value={m}>{m}</mui.MenuItem>)}</mui.Select>
            </mui.FormControl>

            <mui.FormGroup sx={{ margin: '10px' }}>
                <mui.FormControlLabel 
                    control={
                        <mui.Checkbox 
                            id='remove-residue-checkbox' 
                            checked={removeIsChecked} 
                            onChange={(event) => setRemoveIsChecked(event.target.checked)}
                            name='remove'/>
                    } 
                    label={'Remove'} />
            </mui.FormGroup>

            <mui.TextField 
                name='pka' 
                label='pKa'
                required={!removeIsChecked} 
                disabled={removeIsChecked}
                inputProps={{ inputMode: 'numeric', pattern: '[0-9]*(\.[0-9]+)?' }} />

            <mui.Button type='submit'>add</mui.Button>

        </mui.Box>
    )
}

export default PKaModifierModalBox
// 