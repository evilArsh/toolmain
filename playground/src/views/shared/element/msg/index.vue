<template>
  <div class="flex flex-col gap1rem">
    <el-button @click="hdl.onClick('消息弹框')">msg("消息弹框")</el-button>
    <el-button @click="hdl.onClick(new Error('测试'))">msg("new Error('测试')")</el-button>
    <el-button @click="hdl.onClick(NaN)">msg(NaN)</el-button>
    <el-button @click="hdl.onClick({ a: 1, b: 2 })">msg({ a: 1, b: 2 })</el-button>
    <el-button @click="hdl.onClick(['消息弹框', 1, 2, 3])">msg(['消息弹框', 1, 2, 3])</el-button>
    <el-button @click="hdl.onClick('消息弹框', 'success')">msg("消息弹框","success")</el-button>
    <el-button @click="hdl.onClick({ code: 400, msg: '消息弹框' })">msg({code:400,msg:"消息弹框"})</el-button>
    <el-button @click="hdl.onClick({ code: 500, msg: '消息弹框', type: 'danger123' })">
      msg({code:500,msg:"消息弹框",type:"danger123"})
    </el-button>
    <el-button @click="hdl.onClick({ code: 500, msg: '消息弹框', type: 'error' })">
      msg({code:500,msg:"消息弹框",type:"error"})
    </el-button>
    <el-button @click="hdl.onClick({ code: 500, msg: '消息弹框' })"> msg({code:500,msg:"消息弹框"}) </el-button>
    <el-button @click="hdl.onClick({ code: 500, msg: '消息弹框' }, { plain: true, offset: 100 })">
      msg({ code: 500, msg: '消息弹框' }, undefined, { plain: true, offset: 100 })
    </el-button>
  </div>
</template>
<script setup>
import { msg } from "@toolmain/shared"

const hdl = {
  onClick(...args) {
    msg(...args)
  },
}
</script>
