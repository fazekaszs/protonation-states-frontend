import * as mui from '@mui/material'
import { useState } from 'react'

import { cardBoxStyle } from "../sxStyles"
import { baseDataType } from '../types'
import PKaModifierModalBox from './PKaModifierModalBox'

type propsType = {
    baseData: baseDataType | null,
    disabled: boolean
}

const PKaModifierBox = (props: propsType) => {

    const [modalIsOpen, setModalState] = useState(false)

    return(
        <mui.Box sx={{...cardBoxStyle, width: '60%'}}>

            <mui.List sx={{ overflowY: 'scroll', height: '100%', width: '80%' }}>
                Nothing
            </mui.List>

            <hr style={{ width: '80%' }} />

            <mui.Button disabled={props.disabled} onClick={(_event) => setModalState(true)}>
                modify entry
            </mui.Button>

            <mui.Button disabled={props.disabled}>
                submit
            </mui.Button>

            <mui.Modal open={modalIsOpen} onClose={(_event) => setModalState(false)}>
                <PKaModifierModalBox />
            </mui.Modal>

        </mui.Box>
    )
}

export default PKaModifierBox