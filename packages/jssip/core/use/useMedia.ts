import { ulid } from "ulid"

export interface AutoMedia {
  /**
   * audio标签用于播放远程音频流；默认动态创建audio标签
   */
  setAudio: (audio: HTMLAudioElement | string) => void
  playRemote: (media: readonly MediaStream[]) => void
  playUrl: (url: string) => void
  stopPlayUrl: () => void
}
export const useMedia = (): AutoMedia => {
  const oldUrl = { value: "" }
  const globalId = { value: "" }
  let uniqueAudio: HTMLAudioElement | string | undefined = undefined
  function _createGlobalAudio(id: string): HTMLAudioElement {
    const audio = document.createElement("audio")
    audio.id = id
    audio.controls = false
    audio.autoplay = true
    audio.loop = true
    document.body.appendChild(audio)
    return audio
  }
  function setAudio(audio: HTMLAudioElement | string): void {
    uniqueAudio = audio
  }

  // --- play stream start
  function removeAudio(target: string | HTMLElement) {
    if (typeof target === "string") {
      const ele = document.getElementById(target)
      if (ele) {
        document.body.removeChild(ele)
      }
    } else {
      document.body.removeChild(target)
    }
  }
  function listenAudioEvent(audio: HTMLAudioElement, id: string) {
    audio.addEventListener("abort", e => {
      console.log(">>>abort", e)
      removeAudio(id)
    })
    audio.addEventListener("stalled", e => {
      console.log(">>>stalled", e)
      removeAudio(id)
    })
    audio.addEventListener("suspend", e => {
      console.log(">>>suspend", e)
      removeAudio(id)
    })
    audio.addEventListener("ended", e => {
      console.log(">>>ended", e)
      removeAudio(id)
    })
    audio.addEventListener("error", e => {
      console.log(">>>error", e)
      removeAudio(id)
    })
  }
  // 动态创建audio并播放
  function _autoPlay(id: string, stream: MediaProvider) {
    const audio = document.createElement("audio")
    audio.id = id
    audio.controls = false
    audio.autoplay = true
    listenAudioEvent(audio, id)
    document.body.appendChild(audio)
    audio.srcObject = stream
    return audio
  }

  function playAudio(id: string, stream: MediaProvider): HTMLAudioElement {
    if (uniqueAudio) {
      const audio =
        typeof uniqueAudio == "string"
          ? (document.getElementById(uniqueAudio) as HTMLAudioElement)
          : (uniqueAudio as HTMLAudioElement)
      if (audio) {
        audio.srcObject = stream
        return audio
      }
    }
    return _autoPlay(id, stream)
  }
  function playRemote(medias: readonly MediaStream[]) {
    medias.forEach((val: MediaStream) => {
      const internalId = ulid()
      playAudio(internalId, val)
    })
  }
  // --- play stream end
  // --- play url start
  function playUrl(url: string) {
    if (!globalId.value) {
      globalId.value = ulid() + "_global_audio"
    }
    const audio = document.getElementById(globalId.value) ?? _createGlobalAudio(globalId.value)
    if (url) {
      const a = audio as HTMLAudioElement
      if (url !== oldUrl.value) {
        a.src = url
      } else {
        oldUrl.value = url
        a.currentTime = 0
      }
      void a.play()
    }
  }
  function stopPlayUrl() {
    const audio = document.getElementById(globalId.value)
    if (audio) {
      ;(audio as HTMLAudioElement).pause()
    }
  }

  return {
    setAudio,
    playRemote,
    playUrl,
    stopPlayUrl,
  }
}
