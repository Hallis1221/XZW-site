import md5 from "md5";
import { NextApiRequest } from "next";
import { getSession } from "next-auth/react";
import fetchAPI from "strapi/fetch";

async function handler(req: NextApiRequest, res) {
  const session = await getSession({ req });
  let newHighscore = false;
  let highScore;

  if (!session) return res.status(401).json({ message: "Not logged in" });
  // Get data submitted in request's body.
  const body = req.body;

  // Optional logging to see the responses
  // in the command line where next.js app is running.

  // Guard clause checks for first and last name,
  // and returns early if they are not found
  if (!body.session || !body.time)
    // Sends a HTTP bad request error code
    return res.status(400).json({ data: "Missing data." });

  if (md5(JSON.stringify(session + body.time)) !== body.session)
    return res.status(400).json({ message: "Session mismatch" });

  let response = await fetchAPI(`/users/${session?.id}/`, {
    populate: {
      Poeng: {
        populate: "*",
      },
    },
  });
  await response?.Poeng?.Flashcards?.forEach(async (flashcard) => {
    if (flashcard.GameID === body.gameID)
      if (flashcard.Tid > body.time) {
        newHighscore = true;
        let remainingCards = await response.Poeng.Flashcards.filter((card) => {
          console.log(card.id);
          return card.GameID !== body.gameID;
        });

        let cards = remainingCards || [];
        cards.push({
          id: flashcard.id,
          Title: flashcard.Title,
          Tid: body.time,
          GameID: flashcard.GameID,
        });

        await fetchAPI(
          `/users/${session?.id}`,
          {},

          {
            body: JSON.stringify({
              Poeng: {
                Flashcards: Array.from(cards),
              },
            }),
          },
          "PUT"
        ).catch((error) => {});

        return res.status(201).json();
      } else {
        highScore = flashcard.Tid;
      }
  });

  // Found the name.
  // Sends a HTTP success code
  if (!newHighscore) res.status(400).json({ highScore });
}

export default handler;
