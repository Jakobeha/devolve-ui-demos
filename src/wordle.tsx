import { PLATFORM, PromptDevolveUI, React, useDelay, useInput, useState, VNode } from '@raycenity/devolve-ui'
import { range } from '@raycenity/misc-ts'
import additionalGuesses from 'additional-guesses.txt'
import chosenWords from 'chosen-words.txt'

const CHOSEN_WORD_LIST = chosenWords.split('\n').map(word => word.toUpperCase())
const ACCEPTABLE_WORD_LIST = [...CHOSEN_WORD_LIST, ...additionalGuesses.split('\n').map(word => word.toUpperCase())]
const ALPHABET = [...'ABCDEFGHIJKLMNOPQRSTUVWXYZ']

type Color = 'gray' | 'yellow' | 'green'
type CharKnowledge = 'unknown' | 'miss' | 'yellow' | { green: Set<number> }

interface Knowledge {
  [character: string]: CharKnowledge
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
  prompts: {
    guess?: {
      resolve: (word: string) => void
    }
    invalidGuess?: {
      guess: string
      resolve: () => void
    }
    won?: {
      resolve: () => void
    }
  }
}

function getColor (index: number, knowledge: CharKnowledge): Color {
  if (typeof knowledge === 'string') {
    switch (knowledge) {
      case 'unknown':
        return 'gray'
      case 'miss':
        return 'gray'
      case 'yellow':
        return 'yellow'
    }
  } else if (knowledge.green.has(index)) {
    return 'green'
  } else {
    return 'yellow'
  }
}

const Character = ({ character, color }: CharacterProps): VNode => {
  return (
    <zbox width={5} height={3}>
      <text x={2} y={1}>{character}</text>
      <border style='single' />
      <color color={color} />
    </zbox>
  )
}

const Row = ({ guess, knowledge }: RowProps): VNode => (
  <hbox>
    {range(5).map(i => {
      const character = guess[i]
      const color = getColor(i, knowledge?.[character] ?? 'unknown')
      return <Character key={i} character={guess[i] ?? ''} color={color} />
    })}
  </hbox>
)

const Wordle = ({ knowledge, prevGuesses, prompts: { guess, invalidGuess, won } }: WordleProps): VNode => {
  let [currentGuess, setCurrentGuess] = useState<string>('')

  useInput(key => {
    if (guess !== undefined) {
      if (ALPHABET.includes(key.name.toUpperCase())) {
        currentGuess += key.name.toUpperCase()
        if (currentGuess.length === 5) {
          guess.resolve(currentGuess)
          setCurrentGuess('')
        } else {
          setCurrentGuess(currentGuess)
        }
      } else if (key.name === 'Backspace' && currentGuess.length > 0) {
        setCurrentGuess(currentGuess.slice(0, -1))
      }
    }
  })

  useDelay(1000, () => {
    invalidGuess?.resolve()
  }, { onDefine: [invalidGuess] })

  useDelay(5000, () => {
    won?.resolve()
  }, { onDefine: [won] })

  return (
    <vbox>
      <box height={3}>
        <text x={1} y={1} color='white'>W o r d l e</text>
      </box>
      <vbox>
        {prevGuesses.slice(-5).map((guess, i) => <Row key={i} guess={guess} knowledge={knowledge} />)}
        {guess !== undefined ? <Row guess={currentGuess} /> : null}
        {invalidGuess !== undefined ? <text color='white'>Invalid Guess: {invalidGuess.guess}</text> : null}
        {won !== undefined ? <text color='white'>You won! {prevGuesses.length} attempts</text> : null}
      </vbox>
    </vbox>
  )
}

export async function main (): Promise<void> {
  const random = Math.random()
  const chosenWord = CHOSEN_WORD_LIST[Math.floor(random * CHOSEN_WORD_LIST.length)]

  const wordle = new PromptDevolveUI<WordleProps>(Wordle, { knowledge: {}, prevGuesses: [], won: false }, PLATFORM === 'web'
    ? ({
        width: 560,
        height: 336,
        view: (document.getElementById('wordle') as HTMLCanvasElement | null) ?? undefined
      })
    : {})
  wordle.show()

  while (!wordle.p.won) {
    const guess = (await wordle.prompt('guess', {}))
    if (guess === chosenWord) {
      wordle.p.won = true
    }
    if (ACCEPTABLE_WORD_LIST.includes(guess)) {
      wordle.p.prevGuesses.push(guess);
      [...guess].forEach((character, index) => {
        if (chosenWord[index] === character) {
          if (typeof wordle.p.knowledge[character] !== 'object') {
            wordle.p.knowledge[character] = { green: new Set() }
          }
          (wordle.p.knowledge[character] as { green: Set<number> }).green.add(index)
        } else if (chosenWord.includes(character)) {
          if (typeof wordle.p.knowledge[character] !== 'object') {
            wordle.p.knowledge[character] = 'yellow'
          }
        } else {
          wordle.p.knowledge[character] = 'miss'
        }
      })
    } else {
      await wordle.prompt('invalidGuess', { guess })
    }
  }

  await wordle.prompt('won', {})
}

if (typeof window !== 'undefined' || process?.argv[1].endsWith('wordle.js')) {
  void main()
}
