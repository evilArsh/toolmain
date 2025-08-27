<template>
  <ComponentPanel :lib :provider :configs :type-maps="componentMap"></ComponentPanel>
</template>
<script lang="ts" setup>
import { h } from "vue"
import ComponentPanel from "../../views/index.vue"
import type { ComponentLibrary, ComponentProvider, ComponentUIGroup } from "../../../types"

// ICONS
import IcBaselineImportExport from "~icons/ic/baseline-import-export"
import IcBaselinePalette from "~icons/ic/baseline-palette"
import IcOutlineCalendarMonth from "~icons/ic/outline-calendar-month"
import IcBaselineAlarm from "~icons/ic/baseline-alarm"
import IcSharpSettingsInputComponent from "~icons/ic/sharp-settings-input-component"
import IcBaselineMessage from "~icons/ic/baseline-message"
import IcSharpAdsClick from "~icons/ic/sharp-ads-click"
import IcTwotoneElectricMoped from "~icons/ic/twotone-electric-moped"
import MdiButtonPointer from "~icons/mdi/button-pointer"
import MdiFormatText from "~icons/mdi/format-text"

// ELEMENT PLUS ICONS
import EpGrid from "~icons/ep/grid"
import EpElementPlus from "~icons/ep/element-plus"
import EpLink from "~icons/ep/link"
import EpBox from "~icons/ep/box"
import EpMenu from "~icons/ep/menu"
import EpFold from "~icons/ep/fold"
import EpHouse from "~icons/ep/house"
import EpPlace from "~icons/ep/place"
import EpSearch from "~icons/ep/search"
import EpShare from "~icons/ep/share"
import EpCheck from "~icons/ep/check"
import EpChecked from "~icons/ep/checked"
import EpTickets from "~icons/ep/tickets"
import EpTicket from "~icons/ep/ticket"
import EpEdit from "~icons/ep/edit"
import EpPlus from "~icons/ep/plus"
import EpPriceTag from "~icons/ep/price-tag"
import EpUser from "~icons/ep/user"
import EpCircleCheck from "~icons/ep/circle-check"
import EpCircleCheckFilled from "~icons/ep/circle-check-filled"
import EpStar from "~icons/ep/star"
import EpArrowDown from "~icons/ep/arrow-down"
import EpArrowDownBold from "~icons/ep/arrow-down-bold"
import EpSwitchButton from "~icons/ep/switch-button"
import EpSwitch from "~icons/ep/switch"
import EpClock from "~icons/ep/clock"
import EpTimer from "~icons/ep/timer"
import EpConnection from "~icons/ep/connection"
import EpCopyDocument from "~icons/ep/copy-document"
import EpUpload from "~icons/ep/upload"
import EpUserFilled from "~icons/ep/user-filled"
import EpBellFilled from "~icons/ep/bell-filled"
import EpCalendar from "~icons/ep/calendar"
import EpPostcard from "~icons/ep/postcard"
import EpPicture from "~icons/ep/picture"
import EpPictureFilled from "~icons/ep/picture-filled"
import EpList from "~icons/ep/list"
import EpDocumentDelete from "~icons/ep/document-delete"
import EpArrowLeft from "~icons/ep/arrow-left"
import EpLoading from "~icons/ep/loading"
import EpSunny from "~icons/ep/sunny"
import EpSetting from "~icons/ep/setting"
import EpDataAnalysis from "~icons/ep/data-analysis"
import EpPosition from "~icons/ep/position"
import EpTop from "~icons/ep/top"
import EpArrowRight from "~icons/ep/arrow-right"
import EpDocument from "~icons/ep/document"
import EpSort from "~icons/ep/sort"
import EpWarning from "~icons/ep/warning"
import EpMessage from "~icons/ep/message"
import EpFolder from "~icons/ep/folder"
import EpMinus from "~icons/ep/minus"
import EpWatermelon from "~icons/ep/watermelon"

const props = defineProps<{
  lib: ComponentLibrary
  provider: ComponentProvider
}>()
const configs = props.lib.getRawConfig()

const componentMap: Record<string, ComponentUIGroup> = {
  Basic: {
    label: "基础组件",
    list: [
      { label: "el-button", icon: h(MdiButtonPointer) },
      { label: "el-row", icon: h(EpGrid) },
      { label: "el-col", icon: h(EpGrid) },
      { label: "el-icon", icon: h(EpElementPlus) },
      { label: "el-text", icon: h(MdiFormatText) },
      { label: "el-scrollbar", icon: h(IcBaselineImportExport) },
      { label: "el-link", icon: h(EpLink) },
      { label: "el-container", icon: h(EpBox) },
      { label: "el-header", icon: h(EpMenu) },
      { label: "el-aside", icon: h(EpFold) },
      { label: "el-main", icon: h(EpHouse) },
      { label: "el-footer", icon: h(EpPlace) },
    ],
  },
  Form: {
    label: "表单组件",
    list: [
      { label: "el-autocomplete", icon: h(EpSearch) },
      { label: "el-cascader", icon: h(EpShare) },
      { label: "el-checkbox-group", icon: h(EpCheck) },
      { label: "el-checkbox", icon: h(EpChecked) },
      { label: "el-color-picker", icon: h(IcBaselinePalette) },
      { label: "el-date-picker", icon: h(IcOutlineCalendarMonth) },
      { label: "el-form", icon: h(EpTickets) },
      { label: "el-form-item", icon: h(EpTicket) },
      { label: "el-input", icon: h(EpEdit) },
      { label: "el-input-number", icon: h(EpPlus) },
      { label: "el-input-tag", icon: h(EpPriceTag) },
      { label: "el-mention", icon: h(EpUser) },
      { label: "el-radio-group", icon: h(EpCircleCheck) },
      { label: "el-radio", icon: h(EpCircleCheckFilled) },
      { label: "el-rate", icon: h(EpStar) },
      { label: "el-select", icon: h(EpArrowDown) },
      { label: "el-select-v2", icon: h(EpArrowDownBold) },
      { label: "el-slider", icon: h(EpSwitchButton) },
      { label: "el-switch", icon: h(EpSwitch) },
      { label: "el-time-picker", icon: h(EpClock) },
      { label: "el-time-select", icon: h(EpTimer) },
      { label: "el-tree-select", icon: h(EpConnection) },
      { label: "el-transfer", icon: h(EpCopyDocument) },
      { label: "el-upload", icon: h(EpUpload) },
    ],
  },
  Data: {
    label: "数据展示",
    list: [
      { label: "el-avatar", icon: h(EpUserFilled) },
      { label: "el-badge", icon: h(EpBellFilled) },
      { label: "el-calendar", icon: h(EpCalendar) },
      { label: "el-card", icon: h(EpPostcard) },
      { label: "el-carousel", icon: h(EpPicture) },
      { label: "el-carous-el-item", icon: h(EpPictureFilled) },
      { label: "el-collapse", icon: h(EpArrowDownBold) },
      { label: "el-collapse-item", icon: h(EpArrowDown) },
      { label: "el-descriptions", icon: h(EpList) },
      { label: "el-empty", icon: h(EpDocumentDelete) },
      { label: "el-image", icon: h(EpPicture) },
      { label: "el-pagination", icon: h(EpArrowLeft) },
      { label: "el-progress", icon: h(EpLoading) },
      { label: "el-result", icon: h(EpCircleCheck) },
      { label: "el-skeleton", icon: h(EpSunny) },
      { label: "el-table", icon: h(EpGrid) },
      { label: "el-table-column", icon: h(EpSetting) },
      { label: "el-tag", icon: h(EpPriceTag) },
      { label: "el-timeline", icon: h(IcBaselineAlarm) },
      { label: "el-tree", icon: h(EpConnection) },
      { label: "el-statistic", icon: h(EpDataAnalysis) },
      { label: "el-segmented", icon: h(IcSharpSettingsInputComponent) },
    ],
  },
  Navigation: {
    label: "导航",
    list: [
      { label: "el-affix", icon: h(EpPosition) },
      { label: "el-anchor", icon: h(EpLink) },
      { label: "el-backtop", icon: h(EpTop) },
      { label: "el-breadcrumb", icon: h(EpArrowRight) },
      { label: "el-dropdown", icon: h(EpArrowDown) },
      { label: "el-menu-item", icon: h(EpMenu) },
      { label: "el-menu-item-group", icon: h(EpMenu) },
      { label: "el-menu", icon: h(EpMenu) },
      { label: "el-page-header", icon: h(EpDocument) },
      { label: "el-steps", icon: h(EpSort) },
      { label: "el-tabs", icon: h(EpCopyDocument) },
    ],
  },
  Feedback: {
    label: "反馈组件",
    list: [
      { label: "el-alert", icon: h(EpWarning) },
      { label: "el-dialog", icon: h(EpMessage) },
      { label: "el-drawer", icon: h(EpFolder) },
      { label: "el-loading", icon: h(EpLoading) },
      { label: "el-message", icon: h(IcBaselineMessage) },
      { label: "el-popconfirm", icon: h(IcSharpAdsClick) },
      { label: "el-tooltip", icon: h(IcTwotoneElectricMoped) },
    ],
  },
  Others: {
    label: "其它",
    list: [
      { label: "el-divider", icon: h(EpMinus) },
      { label: "el-watermark", icon: h(EpWatermelon) },
    ],
  },
}
</script>
