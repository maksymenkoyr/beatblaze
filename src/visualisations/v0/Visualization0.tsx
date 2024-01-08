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
    const audioSrc = audioCtx.createMediaStreamSource(stream as MediaStream)
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
    ctx.lineWidth = (dataParm[0] / 125) ** 12
    dataParm = Uint8Array.from(dataParm);
    console.log((dataParm[0] / 120) ** 10)
    ctx.fillStyle = '#000000'
    ctx.strokeStyle = '#eae9ea'
    const angle = (Math.PI * 2) / dataParm.length

    dataParm.forEach((value: number, i: number) => {
      ctx.beginPath()
      ctx.setLineDash([5, 5])
      ctx.arc(0, 0, (value * 0.3) ** 1.5, angle * i, angle * ++i)
      ctx.stroke()
    })
  }
  useEffect(() => {
    const canvas = canvasRef.current as HTMLCanvasElement;

    const context = canvas.getContext('2d')
    // Set canvas size
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
    //@ts-ignore
    context.translate(canvas.width / 2, canvas.height / 2)
    const loopingFunction = () => {
      requestAnimationFrame(loopingFunction)
      analyser.getByteTimeDomainData(data)
      // @ts-ignore
      draw(context, data)
    }
    requestAnimationFrame(loopingFunction)
  }, [])
  let analyser: AnalyserNode

  return (
    <div>
      <canvas id='canvas' style={{ backgroundColor: 'black' }} ref={canvasRef} />
    </div>
  )
}

export default Visualization1
