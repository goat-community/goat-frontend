// ** MUI Imports
import { Theme } from '@mui/material/styles'

// ** Util Import
// import { hexToRGBA } from 'src/@core/utils/hex-to-rgba'

const Tooltip = (theme: Theme) => {
  return {
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
        },
        arrow: {
        }
      }
    }
  }
}

export default Tooltip