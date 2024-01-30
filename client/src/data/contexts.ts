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
    }
]

export default contexts