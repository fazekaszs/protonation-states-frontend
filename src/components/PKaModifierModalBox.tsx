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
    width: '50%'
}

type PropsType = {
    baseData: BaseDataType,
    modifiers: ModifierMapType,
    setModifiers: React.Dispatch<React.SetStateAction<ModifierMapType>>,
    setModalState: React.Dispatch<React.SetStateAction<boolean>>,
}

const createAllowedModifiers = (sequence: string, modifiers: ModifierMapType): string[] => {

    let allowedModifiers: string[] = []

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

    const [selectedResidue, setSelectedResidue] = useState<string>('')
    const [selectedIonType, setSelectedIonType] = useState<string>('')
    const [removeIsChecked, setRemoveIsChecked] = useState<boolean>(false)

    const allowedModifiers = createAllowedModifiers(props.baseData.sequence, props.modifiers)

    const submitHandler = (event: React.FormEvent<HTMLFormElement>) => {

        event.preventDefault()

        const data = new FormData(event.currentTarget)
        const pka = data.get('pka') || ''

        let new_modifiers = {...props.modifiers}

        new_modifiers[selectedResidue] = {
            remove: removeIsChecked,
            pka: removeIsChecked ? null : Number.parseFloat(pka.toString()),
            ionType: selectedIonType
        }

        props.setModifiers(new_modifiers)
        props.setModalState(false)
    }

    return (
        <mui.Box sx={modalBoxStyle} component='form' onSubmit={submitHandler}>

            <mui.FormControl fullWidth={true} sx={{ margin: '10px' }}>
                <mui.InputLabel>Residue</mui.InputLabel>
                <mui.Select 
                    labelId='residue-label' 
                    value={selectedResidue} 
                    onChange={(event) => setSelectedResidue(event.target.value)} 
                    label={'Residue'}
                    name='residue'
                    required={true}
                >{allowedModifiers.map((m) => <mui.MenuItem key={`menu-item-${m}`} value={m}>{m}</mui.MenuItem>)}</mui.Select>
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
                sx={{ margin: '10px' }}
                name='pka' 
                label='pKa'
                required={!removeIsChecked} 
                disabled={removeIsChecked}
                inputProps={{ inputMode: 'numeric', pattern: '[0-9]*(\.[0-9]+)?' }} />

            <mui.FormControl fullWidth={true} sx={{ margin: '10px' }}>
                <mui.InputLabel>Ion type</mui.InputLabel>
                <mui.Select 
                    labelId='ion-type-label' 
                    value={selectedIonType} 
                    onChange={(event) => setSelectedIonType(event.target.value)} 
                    label={'Ion type'}
                    name='ion-type'
                    required={!removeIsChecked}
                    disabled={removeIsChecked}
                >
                    <mui.MenuItem key={'menu-item-PosOrNeu'} value={'PosOrNeu'}>positive/neutral</mui.MenuItem>
                    <mui.MenuItem key={'menu-item-NeuOrNeg'} value={'NeuOrNeg'}>neutral/negative</mui.MenuItem>
                </mui.Select>
            </mui.FormControl>

            <mui.Button type='submit'>add</mui.Button>

        </mui.Box>
    )
}

export default PKaModifierModalBox
// 