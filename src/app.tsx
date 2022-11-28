import * as mui from '@mui/material'
import { useState } from 'react'

import { rootBoxStyle, cardBoxStyle } from './sxStyles'

import ProtonationDataTable from './components/ProtonationDataTable'
import BaseDataInputForm from './components/BaseDataInputForm'

import useFetchApiData from './hooks/useFetchApiData'
import PKaModifierBox from './components/PKaModifierBox'
import { baseDataType } from './types'

const App = () => {

    const [baseData, setBaseData] = useState<null | baseDataType>(null)

    const {getter: reqResPair, setter: fetchApiData} = useFetchApiData()

    return (
        <mui.Box sx={rootBoxStyle}>

            <mui.Box sx={{ display: 'flex', flexDirection: 'row', width: '90%' }}>
                <BaseDataInputForm baseDataSetter={setBaseData} disabled={baseData !== null} />
                <PKaModifierBox baseData={baseData} disabled={baseData === null} />
            </mui.Box>
            

            <mui.Box sx={{...cardBoxStyle, width: '90%', overflow: 'scroll'}}>
                {reqResPair ? ProtonationDataTable({ reqResPair }) : <p>Your data will appear here!</p>}
            </mui.Box>

        </mui.Box>
    )
}

// 

export default App
