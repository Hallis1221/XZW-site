import { NextApiRequest } from "next";
import fetchAPI from "strapi/fetch";
import convert from "hanzi-to-pinyin";
import { GloseListe } from "types/gloseListe";

type UserScore = {
  id: string;
  name: string;
  tid: number;
};

async function handler(
  req: NextApiRequest,

  res
) {

  let values: any[] = JSON.parse(req.body).values;
  console.log(JSON.parse(req.body));

  let liste: any = {
    title: JSON.parse(req.body).title || "Title",
    description: JSON.parse(req.body).description || "No description provided",
    gloser: [],
  };

  console.log(values.length);
  if (!values) return res.status(400).json({ message: "Missing data." });

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
    console.log(val);
    liste.gloser.push({
      Chinese: value.hanzi,
      Pinyin: val.join(""),
      Standard: value.standard,
      Aktiv: true,
    });
  }

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
  );
  res.status(200).json({});
}

export default handler;
