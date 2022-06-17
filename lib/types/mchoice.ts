import { Glose } from "./glose"
import { GloseListe } from "./gloseListe"

export type MultiChoice = {
    parent?: GloseListe | undefined,
    choices: Choice[],
}

export type Choice = {
    question: string,
    alternatives: [string, string, string]
}