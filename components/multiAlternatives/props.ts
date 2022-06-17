import { Dispatch, SetStateAction } from "react";
import { ChoiceManager } from "types/choiceManager";
import { Glose } from "types/glose";
import { MultiChoice } from "types/mchoice";

export type MultiChoiceAlternativeProps = {
    setGloser: Dispatch<SetStateAction<Glose[]>>;
    setCurrentChoiceIndex: (currentChoiceIndex: number) => void;
    setChoiceManager: (choiceManager: ChoiceManager) => void;
    choiceManager: ChoiceManager;
    currentChoiceIndex: number;
    gloser: Glose[];
    currentChoice: MultiChoice 
}