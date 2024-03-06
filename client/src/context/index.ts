import type { ContextDto } from "@/data/dto";

interface ContextInit {
    name: string
    lang: string
    inputs: Input[]
    output?: string
}

class Context {
    name: string
    lang: string
    inputs: Map<string, Input>
    output?: string
    
    constructor({ name, lang, inputs, output }: ContextInit) {
        this.name = name
        this.lang = lang
        this.inputs = new Map<string, Input>(inputs.map(input => [
            input.id,
            {
                ...input,
                value: '',
            }
        ]))
        this.output = output
    }
}

interface Input {
    id: string,
    name: string,
    hint: string,
    value: string,
}

function contextFromDto({name, lang, inputs, output}: ContextDto): Context {
    return new Context({
        name,
        lang,
        inputs: inputs.map(input => ({ ...input, value: '', })),
        output,
    })
}

export { Context, type Input }
export { contextFromDto }