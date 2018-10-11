export interface Chore {

    choreid: string;
    chorelist: string;
    choreName: string;
    startDate: Date;
    choreWeight: number;
    repeatType: string;
    choreImageUrl: string
}

export interface ChoreInstance {
    choreid: string;
    choreDate: Date;
    assignedTo: string;
    completed: boolean;
    choreImageUrl: string;
    selected: boolean;
}

export function newChore():Chore{
    const ch:Chore =  {choreid:'', choreName:'', chorelist:'', choreWeight:0, startDate: new Date(), repeatType: 'none', choreImageUrl: undefined};
    return ch;
}
