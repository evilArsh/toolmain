export interface RetryType {
  maxRetry: number
  currentRetry: number
  init: boolean
}
export interface Retry {
  updateMaxRetry: (id: string, maxRetry: number) => void
  getRetryTime: (id: string) => number
  isMax: (id: string) => boolean
  retry: (id: string) => boolean
  reset: (id: string) => void
  delayRetry: (id: string, cb: () => void, increase?: number) => number
}
export const useRetry = (): Retry => {
  const _status = { value: new Map<string, RetryType>() }
  const _maxRetry = { value: 3 }
  const _timeout = { value: 0 }
  const _increase = { value: new Map<string, number>() }
  const _retryTimer = { value: -1 }
  function _createStatus(): RetryType {
    return {
      maxRetry: _maxRetry.value,
      currentRetry: 0,
      init: true,
    }
  }

  function _getStatus(id: string): RetryType {
    const m = _status.value.get(id)
    if (!m) {
      const _init = _createStatus()
      _status.value.set(id, _init)
      return { ..._init }
    }
    return { ...m }
  }

  function _setStatus(id: string, data: Partial<RetryType>) {
    const m = _getStatus(id)
    _status.value.set(id, { ...m, ...data })
  }

  function _setIncrease(id: string, inc: number) {
    _increase.value.set(id, inc)
  }
  function _makeIncrease(id: string, increase = 500): number {
    const inc = _increase.value.get(id)
    if (!inc) {
      _setIncrease(id, increase)
      return increase
    }
    return inc
  }
  function updateMaxRetry(id: string, maxRetry: number): void {
    _setStatus(id, {
      maxRetry,
    })
  }

  function isMax(id: string): boolean {
    const m = _getStatus(id)
    return m.maxRetry < m.currentRetry
  }
  function reset(id: string): void {
    const m = _createStatus()
    _timeout.value = 0
    _setStatus(id, m)
    _retryTimer.value = 0
    _increase.value.delete(id)
  }
  function retry(id: string): boolean {
    if (isMax(id)) {
      return false
    }
    const m = _getStatus(id)
    m.currentRetry++
    if (m.maxRetry < m.currentRetry) {
      return false
    }
    _setStatus(id, m)
    return true
  }
  /**
   * 延迟重试
   * @param id 重试唯一id
   * @param cb 回调函数
   * @param increase 每次重试递增时间
   * @returns 0:超过重试次数，大于0:下次重试时间
   */
  function delayRetry(id: string, cb: () => void, increase = 500): number {
    if (!isMax(id)) {
      if (_retryTimer.value) {
        clearTimeout(_retryTimer.value)
        _retryTimer.value = 0
        _retryTimer.value = window.setTimeout(() => {
          cb()
          _retryTimer.value = 0
        }, _timeout.value)
        return _timeout.value
      } else {
        if (retry(id)) {
          _timeout.value += _makeIncrease(id, increase)
          _retryTimer.value = window.setTimeout(() => {
            cb()
            _retryTimer.value = 0
          }, _timeout.value)
          return _timeout.value
        }
        return 0
      }
    }
    return 0
  }
  function getRetryTime(id: string): number {
    const _status = _getStatus(id)
    return _status.currentRetry
  }
  return {
    updateMaxRetry,
    getRetryTime,
    isMax,
    retry,
    reset,
    delayRetry,
  }
}
