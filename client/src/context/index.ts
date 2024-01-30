import type { ContextDto } from "@/data/dto";

interface Context {
    name: string,
    lang: string,
    inputs: Map<string, Input>,
    output: string,
}

interface Input {
    id: string,
    name: string,
    hint: string,
    value: string,
}

function contextFromDto({name, lang, inputs, output}: ContextDto): Context {
    return {
        name,
        lang,
        inputs: new Map<string, Input>(inputs.map(input => [
            input.id,
            {
                ...input,
                value: '',
            }
        ])),
        output,
    } 
}

export type { Context, Input }
export { contextFromDto }