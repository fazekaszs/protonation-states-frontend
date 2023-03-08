import { ModifierMapType } from './types'

type resiConfigType = {
    [x: string]: [number, number] | [number, number, number, string] | null
}

// Source: https://wou.edu/chemistry/files/2019/07/table-of-pka-values.jpg
const resiConfig: resiConfigType = {
    'G': [2.34, 9.60],
    'A': [2.34, 9.69],
    'V': [2.32, 9.62],
    'L': [2.36, 9.68],
    'I': [2.36, 9.68],
    'P': [1.99, 10.6],
    'M': [2.28, 9.21],
    'F': [1.83, 9.13],
    'Y': [2.20, 9.11, 10.07, 'NeuOrNeg'],
    'W': [2.38, 9.39],
    'S': [2.21, 9.15],
    'T': [2.63, 10.43],
    'C': [1.71, 10.78, 8.33, 'NeuOrNeg'],
    'X': [1.71, 10.78],  // Cystine
    'N': [2.02, 8.80],
    'Q': [2.17, 9.13],
    'D': [2.09, 9.82, 3.86, 'NeuOrNeg'],
    'E': [2.19, 9.67, 4.25, 'NeuOrNeg'],
    'R': [2.17, 9.04, 12.48, 'PosOrNeu'],
    'H': [1.82, 9.17, 6.00, 'PosOrNeu'],
    'K': [2.18, 8.95, 10.53, 'PosOrNeu'],
}

const parseChar = (char: string, kaType: 'SC' | 'NT' | 'CT'): string | null => {

    if (!(char in resiConfig)) return null

    const resiValues = resiConfig[char]

    if (!resiValues) return null

    if (kaType === 'SC' && resiValues.length === 2) return null

    if (kaType === 'SC') return `${resiValues[3]}, ${resiValues[2]}`        
    else if (kaType === 'NT') return `PosOrNeu, ${resiValues[1]}`        
    else if (kaType === 'CT') return `NeuOrNeg, ${resiValues[0]}`

    return null
}

const parseSequence = (sequence: string, modifiers: ModifierMapType): string[] | null => {

    sequence = sequence.replace('\n', '').replace(' ', '')

    let output: string[] = []

    // Handle the N-terminal residue:

    const ntKey = `0 ${sequence[0]} NT`
    const ntKeyInModifiers = ntKey in modifiers
    const ntResiInConfig = sequence[0] in resiConfig

    if (ntKeyInModifiers && modifiers[ntKey].remove) { }

    else if (ntKeyInModifiers) output.push(`${modifiers[ntKey].ionType}, ${modifiers[ntKey].pka}`)

    else if (ntResiInConfig) {
        const ionisableGroup = parseChar(sequence[0], 'NT')
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
        const ionisableGroup = parseChar(sequence[sequence.length - 1], 'CT')
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
            const ionisableGroup = parseChar(sequence[idx], 'SC')
            if (ionisableGroup) output.push(ionisableGroup)
        }

        else return null
    }

    return output
}

export default parseSequence