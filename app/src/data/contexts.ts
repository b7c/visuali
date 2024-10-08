import type { ContextGroupDto, ContextDto, InputDto } from '@/data/dto'

const nameInput: InputDto = {
  id: 'name',
  name: 'Name',
}

const contexts: ContextGroupDto[] = [
  {
    name: 'HTML',
    contexts: [
      {
        name: 'Body',
        lang: 'html',
        inputs: [nameInput],
        output: `Name: <span>{{name}}</span>`,
      },
      {
        name: 'Attribute',
        lang: 'html',
        inputs: [nameInput],
        output: `Name: <input type="text" value="{{name}}">`,
      },
      {
        name: 'Href',
        lang: 'html',
        inputs: [
          {
            id: 'site',
            name: 'Site',
            value: 'https://example.com',
          },
        ],
        output: `<a href="{{site}}">Website link</a>`,
      },
      {
        name: 'Script',
        lang: 'html',
        inputs: [
          {
            id: 'name',
            name: 'Name',
          },
        ],
        output: `<div>Name: <span id="name"></span></div>
<script>
document.getElementById('name').innerText = '{{name}}';
</script>`,
      },
    ]
  },
  {
    name: 'SQL',
    contexts: [
      {
        name: 'Select Where String Like',
        lang: 'sql',
        inputs: [nameInput],
        output: `SELECT [name] FROM [users] WHERE [name] LIKE '%{{name}}%'`,
      },
      {
        name: 'Select Where ID Equals',
        lang: 'sql',
        inputs: [
          {
            id: 'ident',
            name: 'ID',
            value: '123',
          },
        ],
        output: `SELECT [name] FROM [users] WHERE [id] = {{ident}}`,
      },
    ]
  }
]

export default contexts
