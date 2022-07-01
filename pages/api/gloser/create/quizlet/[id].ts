import { getSession } from "next-auth/react";
import type { NextApiRequest } from "next/types";

import axios from "axios";
import { isHanzi } from "src/lib/regex/hanzi";
import { Glose } from "types/glose";

async function handler(req: NextApiRequest, res) {
  // If the user is not logged in, return 401
  const session = await getSession({ req });

  if (!session) return res.status(401).json({ message: "Not logged in" });

  /* Here is the explanation for the code above, powered by github copilot:
1. We get the data from the quizlet api. We can't use fetch() beacuse the quizlet api returns 403. We instead use axios, which (?) emulates a browser.
2. We loop through the data and extract the pinyin and hanzi.
3. We check if the pinyin includes any hanzi, if so we did not manage to extract the pinyin.
4. We check if the hanzi is a valid hanzi.
5. We push the data to the gloser array. */

  let quizletRes = await axios.get(
    `https://quizlet.com/webapi/3.4/studiable-item-documents?filters%5BstudiableContainerId%5D=${req.query.id}&filters%5BstudiableContainerType%5D=1`
  );

  let gloser: Glose[] = [];

  for (let itemIndex in quizletRes.data.responses[0].models.studiableItem) {
    let studiableItem =
      quizletRes.data.responses[0].models.studiableItem[itemIndex];

    let pinyinAndHanzi = studiableItem.cardSides[1].media[0].plainText;

    let hanziStart = 0;

    for (let i = 0; i < pinyinAndHanzi.length; i++) {
      if (isHanzi(pinyinAndHanzi[i])) {
        hanziStart = i;
        break;
      }
    }

    let pinyin = pinyinAndHanzi.slice(0, hanziStart);
    let hanzi = pinyinAndHanzi.slice(hanziStart);

    pinyin = pinyin.trim();
    hanzi = hanzi.trim().replace(")", "");

    // Check if pinyin includes any hanzi, if so we did not manage to extract the pinyin
    pinyin.split("").forEach((char) => {
      if (isHanzi(char)) {
        return res
          .status(500)
          .json({ message: "Unable to exctract hanzi, pinyin includes hanzi" });
      }
    });

    // Check if hanzi is a valid hanzi
    if (!isHanzi(hanzi)) {
      return res.status(500).json({
        message: "Unable to exctract hanzi. Error occured on hanzi: " + hanzi,
      });
    }

    let standard = studiableItem.cardSides[0].media[0].plainText;

    gloser.push({
      Standard: standard,
      Pinyin: pinyin,
      Chinese: hanzi,
    });
  }
  res.status(200).json({ gloser });
}

export default handler;
