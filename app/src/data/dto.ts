interface ContextGroupDto {
  name: string,
  contexts: ContextDto[]
}

interface ContextDto {
  name: string,
  lang: string,
  inputs: InputDto[],
  output: string,
}

interface InputDto {
  id: string,
  name: string,
  hint?: string,
  value?: string
}

export type { ContextGroupDto, ContextDto, InputDto }