
export type MultiChoice = {
    question: string,
    alternatives: [Choice, Choice, Choice],
}

export type Choice = {
    isCorrect: boolean,
    text: string,
}