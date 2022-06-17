import {Dropdown} from "flowbite-react";
import { FunctionComponent } from "react";
import { MultiChoiceSettingsProps } from "./props";

export const MultiChoiceSettings: FunctionComponent<MultiChoiceSettingsProps> = ({setQuestionType, setAnswerType}) => (
    <div className="w-full h-full mt-2 flex flex-row justify-between px-2 sm:px-4 xl:px-6">
    <Dropdown label="Spørsmåls type" placement="top" >
      <Dropdown.Item
        onClick={() => {
          setQuestionType("hanzi");
        }}
      >
        Hanzi
      </Dropdown.Item>
      <Dropdown.Item
        onClick={() => {
          setQuestionType("pinyin");
        }}
      >
        Pinyin
      </Dropdown.Item>
      <Dropdown.Item
        onClick={() => {
          setQuestionType("standard");
        }}
      >
        Standard
      </Dropdown.Item>
    </Dropdown>
    <Dropdown label="Svarstype" placement="top">
      <Dropdown.Item
        onClick={() => {
          setAnswerType("hanzi");
        }}
      >
        Hanzi
      </Dropdown.Item>
      <Dropdown.Item
        onClick={() => {
          setAnswerType("pinyin");
        }}
      >
        Pinyin
      </Dropdown.Item>
      <Dropdown.Item
        onClick={() => {
          setAnswerType("standard");
        }}
      >
        Standard
      </Dropdown.Item>
    </Dropdown>
  </div>
)