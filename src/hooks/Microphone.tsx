import { useEffect, useState } from 'react'

export const useMicrophone = () => {
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [audioCtx, setAudioCtx] = useState<AudioContext | null>(null)
  const [analyser, setAnalyser] = useState<AnalyserNode | null>(null)
  const [data, setData] = useState<Uint8Array | null>(null)
  const [error, setError] = useState<Error | null>(null)

  const setupAudio = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: false,
      })
      setStream(stream)
      const audioCtx = new AudioContext()
      const analyser = audioCtx.createAnalyser()
      const audioSrc = audioCtx.createMediaStreamSource(stream)
      audioSrc.connect(analyser)
      const data = new Uint8Array(analyser.frequencyBinCount)
      setAudioCtx(audioCtx)
      setAnalyser(analyser)
      setData(data)
    } catch (err) {
      setError(err as Error)
    }
  }

  const getByteTimeDomainData = (size: number) => {
    if (!analyser) return new Uint8Array(0)
    const data = new Uint8Array(0)
    analyser.fftSize = size
    analyser?.getByteTimeDomainData(data)
    return data
  }

  useEffect(() => {
    setupAudio()
  }, [])

  return {
    stream,
    audioCtx,
    analyser,
    data,
    error,
    getByteTimeDomainData,
  }
}
