import { DevolveUI, RootProps, useState, useInput } from '@raycenity/devolve-ui'

const ACCEPTABLE_WORD_LIST = ['TODOO']
const CHOSEN_WORD_LIST = ['TODOO']
const ALPHABET = [...'ABCDEFGHIJKLMNOPQRSTUVWXYZ']

type Color = 'gray' | 'yellow' | 'green'

interface Knowledge {
  [character: string]: 'unknown' | 'miss' | 'yellow' | { green: number }
}

interface CharacterProps {
  character: string
  color: Color
}

interface RowProps {
  guess: string
  knowledge?: Knowledge
}

interface WordleProps {
  knowledge: Knowledge
  prevGuesses: string[]
  won: boolean

  messages: {}
  prompts: {
    guess?: {
      resolve: (word: string) => void
    }
    invalidGuess?: {
      resolve: () => void
    }
  }
}

function getColor (index: number, knowledge: 'unknown' | 'miss' | 'yellow' | { green: number }): Color {
  if (typeof knowledge === 'string') {
    switch (knowledge) {
      case 'unknown':
        return 'gray'
      case 'miss':
        return 'gray'
      case 'yellow':
        return 'yellow'
    }
  } else if (knowledge.green === index) {
    return 'green'
  } else {
    return 'yellow'
  }
}

const Character = ({ character, color }: CharacterProps) => {
  return (
    <box width={3} height={3} >
      <text x={1} y={1} width={1} height={1}>{character}</text>
      <color name={color} />
    </box>
  )
}

const Row = ({ guess, knowledge }: RowProps) => (
  <hbox>
    {Array(5).map((_, i) => {
      const character = guess[i]
      const color = getColor(i, knowledge?.[character] ?? 'unknown')
      return <Character character={guess[i] ?? ''} color={color} />
    })}
  </hbox>
)

const Wordle = ({ knowledge, prevGuesses, prompts: { guess, invalidGuess } }: WordleProps) => {
  const [currentGuess, setCurrentGuess] = useState<string>('')

  useInput(key => {
    if (guess !== undefined) {
      if (ALPHABET.includes(key.name.toUpperCase())) {
        setCurrentGuess(currentGuess() + key.name.toUpperCase())
        if (currentGuess().length === 5) {
          guess.resolve(currentGuess())
        }
      } else if (key.name === 'Backspace' && currentGuess().length > 0) {
        setCurrentGuess(currentGuess().slice(0, -1))
      }
    }
  })

  // TODO: show invalid guess

  return (
    <vbox anchorX={0.5} anchorY={0.5}>
      {prevGuesses.map(guess => <Row guess={guess} knowledge={knowledge} />)}
      <Row guess={currentGuess()} />
    </vbox>
  )
}

export async function main() {
  const random = Math.random()
  const chosenWord = CHOSEN_WORD_LIST[Math.floor(random * CHOSEN_WORD_LIST.length)]

  const wordle = new DevolveUI<WordleProps>(Wordle, { knowledge: {}, prevGuesses: [], won: false })
  while (true) {
    const guess = await wordle.prompt('guess', {})
    if (guess === chosenWord) {
      wordle.p.won = true
      return
    }
    if (ACCEPTABLE_WORD_LIST.includes(guess)) {
      wordle.p.prevGuesses.push(guess);
      [...guess].forEach((character, index) => {
        if (chosenWord[index] === character) {
          wordle.p.knowledge[character] = { green: index }
        } else if (chosenWord.indexOf(guess) !== -1) {
          if (typeof wordle.p.knowledge[character] !== 'object') {
            wordle.p.knowledge[character] = 'yellow'
          }
        } else {
          wordle.p.knowledge[character] = 'miss'
        }
      })
      return
    } else {
      await wordle.prompt('invalidGuess', {})
    }
  }
}

if (typeof require !== 'undefined' && require.main === module) {
  void main()
}
