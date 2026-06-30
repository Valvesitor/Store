import { Fragment } from "react"

/**
 * Renderiza o corpo de um artigo escrito em texto simples.
 * Suporta:
 *  - Subtítulos: linha começando com "## "
 *  - Listas: bloco onde todas as linhas começam com "- "
 *  - Parágrafos: demais blocos (separados por linha em branco)
 * Sem dependência de markdown.
 */
export function ArticleBody({ body }: { body: string }) {
  const blocks = body
    .replace(/\r\n/g, "\n")
    .split(/\n{2,}/)
    .map((block) => block.trim())
    .filter(Boolean)

  return (
    <div className="space-y-5 leading-7 text-muted-foreground">
      {blocks.map((block, index) => {
        if (block.startsWith("## ")) {
          return (
            <h2
              key={index}
              className="font-display text-2xl font-bold uppercase text-foreground"
            >
              {block.slice(3).trim()}
            </h2>
          )
        }

        const lines = block.split("\n")
        const isList = lines.every((line) => line.trim().startsWith("- "))

        if (isList) {
          return (
            <ul key={index} className="grid gap-2">
              {lines.map((line, lineIndex) => (
                <li
                  key={lineIndex}
                  className="rounded-md border border-border bg-card/50 px-3 py-2 text-sm"
                >
                  {line.trim().slice(2).trim()}
                </li>
              ))}
            </ul>
          )
        }

        return (
          <p key={index} className="text-pretty">
            {lines.map((line, lineIndex) => (
              <Fragment key={lineIndex}>
                {line}
                {lineIndex < lines.length - 1 && <br />}
              </Fragment>
            ))}
          </p>
        )
      })}
    </div>
  )
}
