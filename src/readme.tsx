import { DevolveUI, React, useInterval, useState, VNode } from '@raycenity/devolve-ui'

interface AppProps {
  name: string
}

const App = ({ name }: AppProps): VNode => {
  const [counter, setCounter] = useState(0)
  useInterval(1000, () => {
    setCounter(counter + 1)
  })

  return (
    <zbox width='100%'>
      <vbox x={2} y={1} gap={1} width='100% - 4'>
        <zbox width='100%'>
          <hbox x={1} y={1} width='28'>
            <text color='yellow'>Hello {name}</text>
            <text color='yellow' x='100%' anchorX={1}>{counter} seconds</text>
          </hbox>
          <border style='rounded' color='yellow' width='30' height='prev + 2' />
        </zbox>
        <source src='../assets/dog.png' width='30' height='10' />
      </vbox>
      <border style='rounded' color='blue' width='100%' height='prev + 2' />
    </zbox>
  )
}

new DevolveUI(App, { name: 'devolve-ui' }).show()

// Works in node or browser (with additional pixi.js script)
