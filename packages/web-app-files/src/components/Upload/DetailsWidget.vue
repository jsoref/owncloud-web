<template>
  <ul class="uk-list uk-list-divider oc-ml-rm oc-mr-rm">
    <li v-for="item in items" :key="item.id">
      <div class="uk-flex uk-flex-middle">
        <oc-icon name="file_copy" class="oc-mr-s" />
        <div class="uk-width-expand">
          <div class="uk-flex">
            <div class="oc-text-bold uk-width-expand uk-text-truncate upload-details-item-name">
              {{ item.name }}
            </div>
            <div class="uk-width-auto uk-text-nowrap upload-details-item-size">
              {{ getResourceSize(item.size) }}
            </div>
          </div>
          <div class="oc-m-rm uk-position-relative uk-width-expand">
            <oc-progress
              :aria-hidden="true"
              :max="100"
              :value="item.progress | toInt"
              class="uk-width-expand oc-m-rm"
            />
            <span :aria-hidden="true" class="uk-position-center oc-progress-text">
              {{ item.progress | roundNumber }} %
            </span>
          </div>
        </div>
      </div>
    </li>
  </ul>
</template>
<script>
import Mixins from '../../mixins'
import MixinResources from '../../mixins/resources'

export default {
  filters: {
    toInt(value) {
      return parseInt(value)
    }
  },
  mixins: [Mixins, MixinResources],
  props: {
    items: {
      type: Array,
      default: () => [],
      required: true
    }
  }
}
</script>
