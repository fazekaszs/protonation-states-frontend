import * as mui from '@mui/material'

type PropsType = {
    formName: string, 
    label: string, 
    defaultValue: string,
    disabled: boolean
}

const PHTextField = (props: PropsType) => {
    return(
        <mui.TextField 
            sx={{width: '25%', margin: '2px'}} 
            label={props.label}
            name={props.formName}
            inputProps={{ inputMode: 'numeric', pattern: '[0-9]*(\.[0-9]+)?' }}
            required={true}
            defaultValue={props.defaultValue}
            disabled={props.disabled}
        />
    )
}

export default PHTextField