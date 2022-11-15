import * as mui from '@mui/material'

const pHTextField = ({formName, label, defaultValue} : {formName: string, label: string, defaultValue: string}) => {
    return(
        <mui.TextField 
            sx={{width: '25%', margin: '2px'}} 
            label={label}
            name={formName}
            inputProps={{ inputMode: 'numeric', pattern: '[0-9]*(\.[0-9]+)?' }}
            required={true}
            defaultValue={defaultValue}
        />
    )
}

export default pHTextField