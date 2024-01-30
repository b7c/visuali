import type { ContextDto } from "@/data/dto";

const contexts: ContextDto[] = [
    {
        name: 'Search user',
        lang: 'sql',
        inputs: [
            {
                id: 'name',
                name: 'Name',
                hint: 'Search by name',
            }
        ],
        output: `SELECT [name] FROM [users] WHERE [name] LIKE '%{{name}}%'`
    },
    {
        name: 'Html Body',
        lang: 'html',
        inputs: [
            {
                id: 'name',
                name: 'Name',
                hint: '',
            }
        ],
        output: `Name: <span>{{name}}</span>`
    }
]

export default contexts