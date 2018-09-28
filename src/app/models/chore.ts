export interface Chore {

    choreid: string;
    chorelist: string;
    choreName: String;
    choreWeight: Number;
}

export function newChore():Chore{
    const ch:Chore =  {choreid:'', choreName:'', chorelist:'', choreWeight:0};
    return ch;
}
