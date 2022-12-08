import * as mui from '@mui/material'
import { useEffect, useState } from 'react'

import { cardBoxStyle } from "../sxStyles"
import { BaseDataType, ModifierMapType } from '../types'
import PKaModifierModalBox from './PKaModifierModalBox'

type PropsType = {
    baseData: BaseDataType,
    disabled: boolean,
    apiDataFetcher: (baseData: BaseDataType, modifiers: ModifierMapType) => Promise<void>
}

const PKaModifierBox = (props: PropsType) => {

    const [modalIsOpen, setModalState] = useState<boolean>(false)
    const [modifiers, setModifiers] = useState<ModifierMapType>({})
    const [modifierJSXList, setModifierJSXList] = useState<JSX.Element[]>([])

    const refreshModifierJSXList = () => {

        let newJSXListElements = []
    
        for (const key in modifiers) {

            const handleClick = () => {

                delete modifiers[key]
                refreshModifierJSXList()
            }

            newJSXListElements.push(
                <mui.ListItemButton 
                    onClick={handleClick} 
                    key={`list-item-button-${key}`}
                    sx={{ ':hover': { backgroundColor: 'rgba(255, 0, 0, 0.5)' } }}
                >
                    <mui.ListItemText 
                        primary={`Residue: ${key}`} 
                        secondary={
                            modifiers[key].remove ? 
                            'Action: remove ionisable group' : 
                            `Action: set pKa to ${modifiers[key].pka} and ion type to ${modifiers[key].ionType}`
                        } />
                </mui.ListItemButton>
            )
        }
    
        setModifierJSXList(newJSXListElements)
    }

    useEffect(() => setModifiers({}), [props.baseData, ])

    useEffect(refreshModifierJSXList, [modifiers, ])

    // Modal child (PKaModifierModalBox) is wrapped inside a fragment (<></>).
    // This is to eliminate a React warning. See the following link:
    // https://github.com/mui/material-ui/issues/31261
    return(
        <mui.Box sx={{...cardBoxStyle, width: '60%'}}>

            <mui.List sx={{ overflowY: 'scroll', height: '100%', width: '80%' }}>
                {modifierJSXList}
            </mui.List>

            <hr style={{ width: '80%' }} />

            <mui.Button disabled={props.disabled} onClick={(_event) => setModalState(true)}>
                add modifier
            </mui.Button>

            <mui.Button 
                disabled={props.disabled} 
                onClick={(_event) => props.apiDataFetcher(props.baseData, modifiers)}
            >
                submit
            </mui.Button>

            <mui.Modal open={modalIsOpen} onClose={(_event) => setModalState(false)}><>
                <PKaModifierModalBox 
                    baseData={props.baseData} 
                    modifiers={modifiers}
                    setModifiers={setModifiers}
                    setModalState={setModalState} />
            </></mui.Modal>

        </mui.Box>
    )
}

export default PKaModifierBox