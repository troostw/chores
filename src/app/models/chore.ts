export interface Chore {
    choreid: string;
    groupid?:string;
    choreName: string;
    startDate: Date;
    choreWeight: number;
    repeatType: string;
    choreImageUrl: string
}

export interface ChoreInstance {
    choreid: string;
    choreDate: Date;
    choreName: string;
    assignedTo: string;
    completed: boolean;
    choreImageUrl: string;
    selected: boolean;
}

export function newChore():Chore{
    const ch:Chore =  {choreid:'', choreName:'', choreWeight:0, startDate: new Date(), repeatType: 'none', choreImageUrl: undefined};
    return ch;
}
