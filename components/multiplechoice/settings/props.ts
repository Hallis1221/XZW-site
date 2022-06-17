import { Dispatch, SetStateAction } from "react"
import { AnswerType, QuestionType } from "types/mchoiceQuestion"

export type MultiChoiceSettingsProps = {
    setQuestionType: Dispatch<SetStateAction<QuestionType>>,
    setAnswerType:Dispatch<SetStateAction<AnswerType>>
}