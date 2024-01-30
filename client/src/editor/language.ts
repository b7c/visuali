import type { Extension } from "@codemirror/state"
import { html } from "@codemirror/lang-html"
import { sql } from "@codemirror/lang-sql"

const extensions = new Map<string, Extension>([
    ['html', html()],
    ['sql', sql()],
])

export const getLanguageExtension = (id: string) => extensions.get(id)