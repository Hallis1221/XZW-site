/* Types */
import { Glose } from "types/glose";

/**
 * @class GloseListe
 * @description Represents a list of gloses along with a title and a description.
 * @param title The title of the list.
 * @param description The description of the list.
 * @param gloser The list of gloses.
 */
export type GloseListe = {
    title: string;
    description: string;
    gloser: Glose[];
}
