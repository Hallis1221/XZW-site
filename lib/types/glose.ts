/**
 * @class Glose
 * @description Represents a glose.
 * @param Standard The common language standard of the glose. Mostly norwegian.
 * @param Pinyin The pinyin of the glose.
 * @param Chinese The hanzi typed version of the glose.
 */

export type Glose = {
    Standard: string;
    Pinyin: string;
    Chinese: string;
}

/**
 * @class DBGlose
 * @extends Glose
 * @description Represents a gloses as they appear in the database. That is to say, it is a glose with an added Aktiv tag (this is removed before the glose enteres the frontend).
 * @param Aktiv Wheter the glose is active or not.
 */
export type DBGlose = Glose & {Aktiv: boolean};