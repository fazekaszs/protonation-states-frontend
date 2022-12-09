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

    // We need a comparator function in sort, otherwise stupid JS sorts the values
    // as if they were strings... 
    let macrostateChargeVec = Array.from(macrostateChargeSet).sort((a, b) => a - b)

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

const ProtonationDataPlot = (props: CreateTablePropsType) => {
    
    let dataContainer: Plotly.Data[] = []

    const traceNames = props.macrostateChargeVec.map((x) => `${x}`)
    traceNames.push('ignored')

    const minCharge = Math.min(...props.macrostateChargeVec)
    const maxCharge = Math.max(...props.macrostateChargeVec)
    const traceColors = props.macrostateChargeVec
        .map((x) => Math.floor(255 * (x - minCharge) / (maxCharge - minCharge)))
        .map((x) => `rgb(${255 - x}, 0, ${x})`)
    traceColors.push('rgb(0, 0, 0)')

    for (let idx = 0; idx < traceNames.length; idx++) {
        const macroStatePropensities = props.tableElements.map((row) => row[idx])
        dataContainer.push({
            x: props.phValues,
            y: macroStatePropensities,
            type: 'scatter',
            mode: 'lines',
            name: traceNames[idx],
            marker: {
                color: traceColors[idx]
            }
        })
    }

    // See:
    // https://github.com/plotly/react-plotly.js/#basic-props
    // https://plotly.com/javascript/configuration-options/
    // https://plotly.com/javascript/reference/scatter/
    // 
    return <Plot
        data={dataContainer}
        layout={{
            height: 470,
            width: 470,
            xaxis: { title: 'pH values' },
            yaxis: { title: 'macrostate prevalences' }
        }}
        config={{
            toImageButtonOptions: {
                format: 'svg',
                height: 1000,
                width: 1000
            }
        }}
        
    />

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

            <ProtonationDataPlot
                macrostateChargeVec={macrostateChargeVec} 
                phValues={phValues}
                tableElements={tableElements}                
            />

        </mui.Box>
    )

}

export default ResultDisplayer