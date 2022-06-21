import { NextApiRequest } from "next";
import fetchAPI from "strapi/fetch";

type UserScore = {
  id: string;
  name: string;
  tid: number;
};

async function handler(
  req: NextApiRequest,

  res
) {
  let response = await fetchAPI(`/users/`, {
    populate: {
      Poeng: {
        populate: "*",
      },
    },
  });

  if (!response)
    return res.status(500).json({ message: "Unable to find any users" });

  let userScores: UserScore[] = [];
  await response.forEach(async (user) => {
    user.Poeng.Flashcards.forEach(async (flashcard) => {
      if (flashcard.GameID === req.query.id) {
        userScores.push({
          id: user.id,
          name: user.username,
          tid: flashcard.Tid,
        });
      }
    });
  });

  res.status(200).json({ data: userScores });
}

export default handler;
