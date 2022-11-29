import * as mui from '@mui/material'
import { useEffect, useState } from 'react'

import { cardBoxStyle } from "../sxStyles"
import { BaseDataType, ModifierMapType } from '../types'
import PKaModifierModalBox from './PKaModifierModalBox'

type PropsType = {
    baseData: BaseDataType,
    disabled: boolean
}

const PKaModifierBox = (props: PropsType) => {

    const [modalIsOpen, setModalState] = useState<boolean>(false)
    const [modifiers, setModifiers] = useState<ModifierMapType>({})

    const modifiersToJSX = () => {

        let output = []
    
        for (const key in modifiers) {
            output.push(
                <mui.ListItemButton onClick={(_event) => delete modifiers[key]}>
                    <mui.ListItemText 
                        primary={key} 
                        secondary={
                            modifiers[key].remove ? 
                            'Action: remove ionisable group' : 
                            `Action: set pKa to ${modifiers[key].pka}`
                        } />
                </mui.ListItemButton>
            )
        }
    
        return output
    }

    useEffect(() => {
        setModifiers({})
    }, [props.baseData, ])

    useEffect(() => {
        modifiersToJSX()
    }, [modifiers, ])

    return(
        <mui.Box sx={{...cardBoxStyle, width: '60%'}}>

            <mui.List sx={{ overflowY: 'scroll', height: '100%', width: '80%' }}>
                {modifiersToJSX()}
            </mui.List>

            <hr style={{ width: '80%' }} />

            <mui.Button disabled={props.disabled} onClick={(_event) => setModalState(true)}>
                add modifier
            </mui.Button>

            <mui.Button disabled={props.disabled}>
                submit
            </mui.Button>

            <mui.Modal open={modalIsOpen} onClose={(_event) => setModalState(false)}>
                <PKaModifierModalBox 
                    baseData={props.baseData} 
                    modifiers={modifiers}
                    setModalState={setModalState} />
            </mui.Modal>

        </mui.Box>
    )
}

export default PKaModifierBox