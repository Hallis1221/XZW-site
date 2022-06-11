import fetchAPI from "strapi/fetch";
import type { DBGlose } from "types/glose";
import type { GloseListe } from "types/gloseListe";

export default async function getListe({
  id,
}: {
  id: string | undefined;
}): Promise<{
  liste: GloseListe | undefined;
}> {
  let valid = false;

  if (!id) return { liste: undefined };

  const listeID: string | undefined = id.split("-")[1];

  let listeDB = await fetchAPI(`/glose-listes/${listeID}`, {
    populate: {
      Title: "*",
      Description: "*",
      Gloser: {
        populate: "*",
      },
    },
  })
    .then((res) => res.data.attributes)
    .catch((_) => {
    });

  if (listeDB && typeof listeDB === "object") valid = true;
  if (!valid) return { liste: undefined };

  // Remove each glose where Aktiv is false or undefined
  listeDB.Gloser = listeDB.Gloser.filter((glose: DBGlose) => {
    return glose.Aktiv === true;
  });

  let liste: GloseListe = {
    title: listeDB.Title,
    description: listeDB.Description,
    gloser: listeDB.Gloser,
  };

  console.log(liste);

  return {
    liste,
    
  };
}
