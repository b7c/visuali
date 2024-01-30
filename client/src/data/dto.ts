interface ContextDto {
    name: string,
    lang: string, 
    inputs: InputDto[],
    output: string,
}

interface InputDto {
    id: string,
    name: string,
    hint: string, 
}

export type { ContextDto, InputDto }