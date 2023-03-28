import * as mui from '@mui/material'
import { SelectChangeEvent } from '@mui/material'

type PropsType = {
    pkaTableIdx: number,
    handlePkaTableSelection: (event: SelectChangeEvent) => void
}

const PKaTableSelector = (props: PropsType) => {
    return (
        <mui.FormControl sx={{ width: '80%' }}>

            <mui.InputLabel>pKa table</mui.InputLabel>

            <mui.Select 
                value={props.pkaTableIdx.toString()} 
                onChange={props.handlePkaTableSelection} 
                defaultValue='0'
                label='pKa table'                    
            >
                <mui.MenuItem value='0'>WOU CH450/CH451: Biochemistry textbook</mui.MenuItem>
                <mui.MenuItem value='1'>Thurlkill et al., Protein Science (2006), 15:1214-1218</mui.MenuItem>
            </mui.Select>

        </mui.FormControl>
    )
}

export default PKaTableSelector