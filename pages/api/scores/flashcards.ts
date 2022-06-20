import md5 from "md5";
import { getSession } from "next-auth/react";
import fetchAPI from "strapi/fetch";

async function handler(req, res) {
  const session = await getSession({ req });

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

  fetchAPI(`/users/${session?.id}/`, {
    populate: {
      Poeng: {
        populate: "*",
      },
    },
  }).then((response) => {
    response?.Poeng?.Flashcards?.forEach(async (flashcard) => {
      if (flashcard.GameID === body.gameID && flashcard.Tid > body.time) {
        let remainingCards = response.Poeng.Flashcards.filter((card) => {
          card.id = undefined;
          return card.GameID !== body.gameID;

        });

        let cards = remainingCards || [];
        cards.push({
          Title: flashcard.Title,
          Tid: body.time,
          GameID: flashcard.GameID,
        });

        let resol = await fetchAPI(
          `/users/${session?.id}`,
          {},

          {
            body: JSON.stringify({
              Poeng: {
                Flashcards: cards,
              },
            }),
          },
          "PUT"
        );

        if (resol.status === 200) {
          return res.status(201).json({ message: "Success" });
        }
      }
    });
  });
  // Found the name.
  // Sends a HTTP success code
  res.status(304).json({});
}

export default handler;
