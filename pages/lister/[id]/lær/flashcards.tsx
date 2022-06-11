import { Card } from "flowbite-react";
import type { NextPage } from "next";
import type { GloseListe } from "types/gloseListe";

const Page: NextPage<{ page: any; liste: GloseListe }> = ({ page, liste }) => {
  
    return (
        <Card>
            <h1>{page.title}</h1>
        </Card>
    )
}