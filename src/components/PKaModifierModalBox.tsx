import * as mui from '@mui/material'

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
    boxShadow: '5px 5px 4px rgba(100, 100, 100, 0.3)'
}

const PKaModifierModalBox = () => {
    return (
        <mui.Box sx={modalBoxStyle}>
            <p>HAHA</p>
        </mui.Box>
    )
}

export default PKaModifierModalBox