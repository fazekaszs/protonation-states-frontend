import * as mui from '@mui/material'
import Plot from 'react-plotly.js'

import { ResBodyType } from '../types'


const processResults = (phRange: [number, number, number], protonationData: ResBodyType): [number[], number[], number[][]] => {

    // Get the row labels (pH values) and column labels (macrostate charges)

    let phValues = []
    let macrostateChargeSet = new Set<number>()

    let rowIdx = 0
    for (const macrostates of protonationData) {

        phValues.push(phRange[0] + rowIdx * phRange[2])
        rowIdx += 1

        for (const charge in macrostates) macrostateChargeSet.add(Number.parseInt(charge))
    }

    let macrostateChargeVec = Array.from(macrostateChargeSet).sort()

    // Get the table elements

    let tableElements: number[][] = []

    rowIdx = 0
    for (const macrostates of protonationData) {

        let rowElements: number[] = []

        let prevalenceSum: number = 0
        for (const charge of macrostateChargeVec) {

            if (`${charge}` in macrostates) rowElements.push(macrostates[`${charge}`])
            else rowElements.push(0.0)

            prevalenceSum += rowElements[rowElements.length - 1]
        }

        rowElements.push(1.0 - prevalenceSum)  // ignored fraction

        tableElements.push(rowElements)

        rowIdx += 1
    }

    return [macrostateChargeVec, phValues, tableElements]
}

type CreateTablePropsType = {
    macrostateChargeVec: number[], 
    phValues: number[], 
    tableElements: number[][]
}

const ProtonationDataTable = (props: CreateTablePropsType) => {

    const jsxTableHeader = [
        <mui.TableCell sx={{ fontWeight:'bold' }}>pH</mui.TableCell>,
        ...props.macrostateChargeVec.map((x) => <mui.TableCell sx={{ fontWeight:'bold' }}>{x}</mui.TableCell>),
        <mui.TableCell sx={{ fontWeight:'bold' }}>ignored</mui.TableCell>
    ]

    var jsxTableBody = []

    var rowIdx = 0
    for (const row of props.tableElements) {

        var jsxTableRow = []

        jsxTableRow.push(<mui.TableCell>{props.phValues[rowIdx]}</mui.TableCell>)  // add pH
        jsxTableRow.push(...row.map((element) => <mui.TableCell>{element.toFixed(3)}</mui.TableCell>))  // add prevalences

        jsxTableBody.push(<mui.TableRow>{jsxTableRow}</mui.TableRow>)

        rowIdx += 1
    }
    
    return(
        <mui.TableContainer component={mui.Paper} sx={{ overflow: 'scroll', height: '390px', margin: '10px' }}>
            <mui.Table stickyHeader={true}>

                <mui.TableHead>
                    <mui.TableRow>{jsxTableHeader}</mui.TableRow>
                </mui.TableHead>

                <mui.TableBody>{jsxTableBody}</mui.TableBody>

            </mui.Table>
        </mui.TableContainer>)
}

type ResultDisplayerPropsType = {
    phRange: [number, number, number],
    protonationData: ResBodyType
}

const ResultDisplayer = (props: ResultDisplayerPropsType) => {

    const [macrostateChargeVec, phValues, tableElements] = processResults(props.phRange, props.protonationData)

    return(
        <mui.Box sx={{ display: 'flex', flexDirection: 'row', width: '100%', justifyContent: 'center' }}>

            <ProtonationDataTable 
                macrostateChargeVec={macrostateChargeVec} 
                phValues={phValues}
                tableElements={tableElements}
            />

            <Plot

                data={[{
                    x: [1, 2, 3],
                    y: [2, 3, 4],
                    type: 'scatter',
                    mode: 'lines',
                }]}

                layout={{
                    height: 370,
                    width: 370
                }}
            />

        </mui.Box>
    )

}

export default ResultDisplayer