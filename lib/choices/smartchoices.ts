import { Glose } from "types/glose";
import { Choice, MultiChoice } from "types/mchoice";
import { QuestionType, AnswerType } from "types/mchoiceQuestion";
import { shuffle } from "../shuffle";

export default function CreateMChoice({
  glose,
  liste,
  questionType,
  answerType,
}: {
  glose: Glose;
  liste: Glose[];
  questionType: QuestionType;
  answerType: AnswerType;
}): MultiChoice {
  // Remove the glose from the liste for it not to be used again
  let gloser = liste;
  gloser.splice(liste.indexOf(glose), 1);

  let choice: MultiChoice = {
    question: "",
    alternatives: [],
  };

  let amountOfAlternatives = gloser.length >= 3 ? 3 : gloser.length;

  switch (questionType) {
    case "pinyin":
      choice.question = glose.Pinyin;
      break;
    case "hanzi":
      choice.question = glose.Chinese;
      break;
    case "standard":
      choice.question = glose.Standard;
      break;
    default:
      throw new Error(
        "Unknown question type or the question type is not supported at the moment"
      );
  }

  function createAlternatives() {
    let winners: Array<{
      similarity: number;
      glose: Glose;
    }> = [];

    let correctAnswerLength =
      answerType === "pinyin"
        ? glose.Pinyin.split("").length
        : answerType === "hanzi"
        ? glose.Chinese.split("").length
        : glose.Standard.split("").length;

    // Find the word that is the most similar to the glose
    gloser.forEach((word) => {
      let similarity = 0;

      // Increase the similarity based on how similair the length of the word is compared to the length of the glose
      let lengthDifference = correctAnswerLength;

      lengthDifference -=
        answerType === "pinyin"
          ? word.Pinyin.length
          : answerType === "hanzi"
          ? word.Chinese.length
          : word.Standard.length;

      lengthDifference =
        lengthDifference >= 0 ? lengthDifference : lengthDifference * -1;

      lengthDifference *= 1;
      similarity -= lengthDifference;

      let relevantWord =
        answerType === "pinyin"
          ? glose.Pinyin
          : answerType === "hanzi"
          ? glose.Chinese
          : glose.Standard;
      relevantWord.split("").forEach((letter) => {
        switch (answerType) {
          case "pinyin":
            word.Pinyin.split("").forEach((alternativeLetter) => {
              if (letter === alternativeLetter) {
                similarity++;
              }
            });

            break;
          case "hanzi":
            word.Chinese.split("").forEach((alternativeLetter) => {
              if (letter === alternativeLetter) {
                similarity++;
              }
            });

            break;
          case "standard":
            word.Standard.split("").forEach((alternativeLetter) => {
              if (letter === alternativeLetter) {
                similarity++;
              }
            });
            break;
          default:
            throw new Error(
              "Unknown answer type or the answer type is not supported at the moment"
            );
        }
      });

      // We dont want to add the word if its just a sentence with the question.
      if (
        !(
          choice.question.includes(word.Pinyin) ||
          choice.question.includes(word.Chinese) ||
          choice.question.includes(word.Standard) ||
          word.Pinyin.includes(choice.question) ||
          word.Chinese.includes(choice.question) ||
          word.Standard.includes(choice.question)
        ) ||
        winners.length >= 3
      ) {
        winners.push({
          similarity,
          glose: word,
        });
      }
    });

    // Sort the winners array by similarity
    winners.sort((a, b) => {
      return b.similarity - a.similarity;
    });

    winners.slice(0, amountOfAlternatives).forEach((alternative, index) => {
      switch (answerType) {
        case "pinyin":
          choice.alternatives[index] = {
            isCorrect: false,
            text: alternative.glose.Pinyin,
          };
          break;
        case "hanzi":
          choice.alternatives[index] = {
            isCorrect: false,
            text: alternative.glose.Chinese,
          };
          break;
        case "standard":
          choice.alternatives[index] = {
            isCorrect: false,
            text: alternative.glose.Standard,
          };
          break;
        default:
          throw new Error(
            "Unknown answer type or the answer type is not supported at the moment"
          );
      }
    });

    switch (answerType) {
      case "pinyin":
        choice.alternatives.push({
          isCorrect: true,
          text: glose.Pinyin,
        });
        break;
      case "hanzi":
        choice.alternatives.push({
          isCorrect: true,
          text: glose.Chinese,
        });
        break;
      case "standard":
        choice.alternatives.push({
          isCorrect: true,
          text: glose.Standard,
        });
        break;
      default:
        throw new Error(
          "Unknown answer type or the answer type is not supported at the moment"
        );
    }

    // Shuffle the alternatives
    choice.alternatives = shuffle(choice.alternatives);
  }
  createAlternatives();
  return choice;
}
