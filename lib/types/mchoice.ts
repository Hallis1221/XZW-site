
export type MultiChoice = {
    question: string,
    alternatives: Choice[],
}

export type Choice = {
    isCorrect: boolean,
    text: string,
}