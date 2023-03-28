// pka_table0.json:
//     Source: https://wou.edu/chemistry/files/2019/07/table-of-pka-values.jpg
//     X = Cystine

import { ModifierMapType } from './types'

type resiConfigType = {
    [x: string]: [number, number] | [number, number, number, string] | null
}

const parseChar = (char: string, kaType: 'SC' | 'NT' | 'CT', resiConfig: resiConfigType): string | null => {

    if (!(char in resiConfig)) return null

    const resiValues = resiConfig[char]

    if (!resiValues) return null

    if (kaType === 'SC' && resiValues.length === 2) return null

    if (kaType === 'SC') return `${resiValues[3]}, ${resiValues[2]}`        
    else if (kaType === 'NT') return `PosOrNeu, ${resiValues[1]}`        
    else if (kaType === 'CT') return `NeuOrNeg, ${resiValues[0]}`

    return null
}

const parseSequence = (sequence: string, modifiers: ModifierMapType, pkaTableIdx: number): string[] | null => {

    const resiConfig: resiConfigType = require(`./resources/pka_table${pkaTableIdx}.json`)

    sequence = sequence.replace('\n', '').replace(' ', '')

    let output: string[] = []

    // Handle the N-terminal residue:

    const ntKey = `0 ${sequence[0]} NT`
    const ntKeyInModifiers = ntKey in modifiers
    const ntResiInConfig = sequence[0] in resiConfig

    if (ntKeyInModifiers && modifiers[ntKey].remove) { }

    else if (ntKeyInModifiers) output.push(`${modifiers[ntKey].ionType}, ${modifiers[ntKey].pka}`)

    else if (ntResiInConfig) {
        const ionisableGroup = parseChar(sequence[0], 'NT', resiConfig)
        if (ionisableGroup) output.push(ionisableGroup)
    }

    else return null

    // Handle the C-terminal residue:

    const ctKey = `${sequence.length - 1} ${sequence[sequence.length - 1]} CT`
    const ctKeyInModifiers = ctKey in modifiers
    const ctResiInConfig = sequence[sequence.length - 1] in resiConfig

    if (ctKeyInModifiers && modifiers[ctKey].remove) { }

    else if (ctKeyInModifiers) output.push(`${modifiers[ctKey].ionType}, ${modifiers[ctKey].pka}`)

    else if (ctResiInConfig) {
        const ionisableGroup = parseChar(sequence[sequence.length - 1], 'CT', resiConfig)
        if (ionisableGroup) output.push(ionisableGroup)
    }

    else return null

    // Handle side chain residues:

    for (let idx = 0; idx < sequence.length; idx++) {

        const scKey = `${idx} ${sequence[idx]} SC`
        const scKeyInModifiers = scKey in modifiers
        const scResiInConfig = sequence[idx] in resiConfig

        if (scKeyInModifiers && modifiers[scKey].remove) continue

        else if (scKeyInModifiers) output.push(`${modifiers[scKey].ionType}, ${modifiers[scKey].pka}`)

        else if (scResiInConfig) {
            const ionisableGroup = parseChar(sequence[idx], 'SC', resiConfig)
            if (ionisableGroup) output.push(ionisableGroup)
        }

        else return null
    }

    return output
}

export default parseSequence