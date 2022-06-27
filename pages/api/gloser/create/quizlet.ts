import { getSession } from "next-auth/react";
import type { NextApiRequest } from "next/types";

async function handler(req: NextApiRequest, res) {
    // If the user is not logged in, return 401
    const session = await getSession({ req });

    if (!session) return res.status(401).json({ message: "Not logged in" });


}

export default handler;
