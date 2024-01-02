import { useEffect, useRef } from 'react'

const Visualization1 = () => {
  let data: Uint8Array = new Uint8Array(0)
  const setupAudio = async () => {
    const stream = await navigator.mediaDevices
      .getUserMedia({ audio: true, video: false })
      .then(stream => {
        return stream
      })
      .catch(err => {
        console.log(err)
      })

    const audioCtx = new AudioContext()
    analyser = audioCtx.createAnalyser()
    analyser.fftSize = 2048
    const audioSrc = audioCtx.createMediaStreamSource(stream)
    audioSrc.connect(analyser)
    data = new Uint8Array(analyser.frequencyBinCount)
  }
  setupAudio()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const draw = (ctx: CanvasRenderingContext2D, dataParm: Uint8Array) => {
    ctx.clearRect(
      -window.innerWidth / 2,
      -window.innerHeight / 2,
      window.innerWidth,
      window.innerHeight,
    )
    dataParm = [...dataParm]
    ctx.lineWidth = 1 //width of candle/bar
    ctx.fillStyle = '#000000'
    ctx.strokeStyle = '#d5d4d5'
    let angle = (Math.PI * 2) / dataParm.length
    console.log(dataParm)
    dataParm.forEach((value: number, i: number) => {
      ctx.beginPath()
      ctx.setLineDash([5, 5])
      ctx.arc(0, 0, (value * 0.5) ** 1.4 - 50, angle * i, angle * ++i)
      ctx.stroke()
    })
  }
  useEffect(() => {
    const canvas = canvasRef.current

    const context = canvas.getContext('2d')
    // Set canvas size
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
    context.translate(canvas.width / 2, canvas.height / 2)
    const loopingFunction = () => {
      requestAnimationFrame(loopingFunction)
      analyser.getByteTimeDomainData(data)
      draw(context, data)
    }
    requestAnimationFrame(loopingFunction)
  }, [])
  let analyser: AnalyserNode

  return (
    <div>
      <canvas id='canvas' style={{backgroundColor: 'black'}} ref={canvasRef} />
    </div>
  )
}

export default Visualization1
