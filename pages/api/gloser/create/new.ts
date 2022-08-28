import { NextApiRequest } from "next";
import fetchAPI from "strapi/fetch";
import convert from "hanzi-to-pinyin";
import { getSession } from "next-auth/react";

type UserScore = {
  id: string;
  name: string;
  tid: number;
};

async function handler(
  req: NextApiRequest,
  res
) {
  const session = await getSession({ req });

  if (!session) return res.status(401).json({ message: "Not logged in" });

  let values: any[] ;
  let liste;

  try {
    values = JSON.parse(req?.body).values || req?.body.values;
  if (!values) return res.status(400).json({ message: "Missing data." });

   liste = {
    title: JSON.parse(req.body).title ||req.body.title || "Title",
    description: JSON.parse(req.body).description || req.body.description || "No description provided",
    gloser: [],
  }} catch (error) {
    return res.status(400).json({ message: "Encontered missing data error, " + error +" The data you sent was: " + req.body});
  }

  /* Here is the explanation for the code below, powered by github copilot:
1. We loop over the values array with the variable tval. 
2. We get the value at index tval.
3. We convert the hanzi to pinyin.
4. If the conversion fails, we log an error and return a 400 status.
5. If the conversion succeeds, we loop over the pinyin array.
6. We get the value at index i.
7. If the value is longer than 1, we check if it is an array.
8. If it is, we get the first value and join the rest with a slash.
9. If it is not an array, we just return the value.
10. We push the value to the gloser array.
11. We return the liste object. 
*/

  for (let tval in Array.from(Array(values.length))) {
    let value: any = values[tval];
    let val = await convert(value.hanzi);

    if (!val || val === undefined || !val.length) {
      console.log("No pinyin found for " + value.hanzi + "/" + value.pinyin);
      res.status(400).json({ message: "Invalid hanzi" });
      return;
    }
    for (let i in Array.from(Array(val.length))) {
      let glose = val[i];
      if (glose.length > 1 && typeof glose === typeof []) {
        let normal = glose[0];
        let alternatives = glose.slice(1).join(" / ");

        val[i] = `${normal} (${alternatives})`;
      }
    }
    liste.gloser.push({
      Chinese: value.hanzi,
      Pinyin: val.join(""),
      Standard: value.standard,
      Aktiv: true,
    });
  }
console.log("Requesting strapi to create new liste");
  await fetchAPI(
    `/glose-listes`,
    {},

    {
      body: JSON.stringify({
        data: {
          Gloser: liste.gloser,
          Title: liste.title,
          Description: liste.description,
          ActionTekst: "Start å lære!",
        },
      }),
    },
    "POST"
  )
    .then((response) => {
      res.status(200).json({
        ...response.data,
      });
    })
    .catch((error) => {
      res.status(500).json({
        ...error,
      });
    });
}

export default handler;
