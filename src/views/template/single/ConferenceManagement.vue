<template>
  <div style="position:relative">
    <c-card
      :title="title"
      @go-back="$emit('go-back')"
      v-if="!showIcon"
      class="add-page"
    >
      single/
      {{
        menuId
      }}
      {{
        $route.query.id
      }}
      <!-- <component
        :is="pageName"
        :mode="mode"
        :id="id"
        :menu-id="menuId"
        :menu="menu"
        @upsert-end="$emit('upsert-end')"
        @go-back="$emit('go-back')"
      >
      </component> -->
    </c-card>
  </div>
</template>

<script>
export default {
  props: ['menuId'],
  data () {
    return {

    }
  }
}
</script>
