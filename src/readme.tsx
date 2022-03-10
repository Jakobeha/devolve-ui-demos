import { DevolveUI, useInterval, useState, VNode } from '@raycenity/devolve-ui'

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
      <vbox x={2} y={2} gap={1} width='100% - 4'>
        <zbox width='100%'>
          <hbox width='100%'>
            <text color='white'>Hello {name}</text>
            <text color='white' x='100%' anchorX={1}>{counter} seconds</text>
          </hbox>
          <color color='orange' />
        </zbox>
        <source src='dog.png' width='100%' />
      </vbox>
      <border style='single' color='orange' width='100%' height='prev + 4' />
    </zbox>
  )
}

new DevolveUI(App, { name: 'devolve-ui' }).show()

// Works in node or browser (with additional pixi.js script)
