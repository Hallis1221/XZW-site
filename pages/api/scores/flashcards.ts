import { getSession } from "next-auth/react"

 async function handler(req, res) {
  const  session = await getSession({req});

  if (!session) return res.status(401).json({ message: "Not logged in" }); 
    // Get data submitted in request's body.
    const body = req.body
  
    // Optional logging to see the responses
    // in the command line where next.js app is running.
    console.log('body: ', body)
  
    // Found the name.
    // Sends a HTTP success code
    res.status(200).json({})
  }

  export default handler;