import * as mui from '@mui/material'
import { ReqResPairType } from '../types'

const ProtonationDataTable = ({ reqResPair }: { reqResPair: ReqResPairType }) => {

    // Extract the useful data from the input

    const protonationData = reqResPair.res
    const ph_range = reqResPair.req.ph_range

    // Get the row labels (pH values) and column labels (macrostate charges)

    let tableRowLabels = []
    let tableColLabelsSet = new Set<number>()

    let row_idx = 0
    for (const macrostates of protonationData) {

        tableRowLabels.push(ph_range[0] + row_idx * ph_range[2])
        row_idx += 1

        for (const charge in macrostates) {
            tableColLabelsSet.add(Number.parseInt(charge))
        }
    }

    let tableColLabelsVec = Array.from(tableColLabelsSet).sort()

    // Get the table elements

    let tableElements: number[][] = []

    row_idx = 0
    for (const macrostates of protonationData) {

        let rowElements: number[] = []

        rowElements.push(tableRowLabels[row_idx])

        let prevalenceSum: number = 0
        for (const charge of tableColLabelsVec) {

            if (`${charge}` in macrostates) rowElements.push(macrostates[`${charge}`])
            else rowElements.push(0.0)

            prevalenceSum += rowElements[rowElements.length - 1]
        }

        rowElements.push(1.0 - prevalenceSum)  // ignored fraction

        tableElements.push(rowElements)

        row_idx += 1
    }

    return(
        <mui.TableContainer component={mui.Paper}>
            <mui.Table stickyHeader={true}>

                <mui.TableHead>
                    <mui.TableRow>
                        <mui.TableCell sx={{ fontWeight:'bold' }}>pH</mui.TableCell>
                        {tableColLabelsVec.map((x) => <mui.TableCell sx={{ fontWeight:'bold' }}>{x}</mui.TableCell>)}
                        <mui.TableCell sx={{ fontWeight:'bold' }}>ignored</mui.TableCell>
                    </mui.TableRow>
                </mui.TableHead>

                <mui.TableBody>
                    {tableElements.map((row) => {
                        return (<mui.TableRow>
                            {row.map((element) => <mui.TableCell>{element.toFixed(3)}</mui.TableCell>)}
                        </mui.TableRow>)
                    })}
                </mui.TableBody>
            </mui.Table>
        </mui.TableContainer>
    )

}

export default ProtonationDataTable