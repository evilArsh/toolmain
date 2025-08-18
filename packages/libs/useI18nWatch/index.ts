import { watch } from "vue"
import { useI18n } from "vue-i18n"
export function useI18nWatch(callback: (locale: string) => void) {
  const { locale } = useI18n()
  watch(locale, () => {
    callback(locale.value)
  })
  callback(locale.value)
}
