<template>
  <div class="files-upload-progress uk-clearfix oc-py-rm">
    <div class="oc-m-rm uk-position-relative uk-width-expand">
      <oc-progress
        ref="progressbar"
        :aria-hidden="true"
        :max="100"
        :value="totalUploadProgress"
        class="uk-width-expand oc-m-rm"
      />
      <span :aria-hidden="true" class="uk-position-center oc-progress-text">
        {{ totalUploadProgress | roundNumber }} %
      </span>
      <oc-hidden-announcer :announcement="announcement" level="assertive" />
    </div>
    <oc-grid
      flex
      class="oc-mt-s oc-mb-s oc-text-muted oc-cursor-pointer"
      :aria-label="$gettext('Click row to toggle upload progress details')"
      @click.native="$_toggleExpanded"
    >
      <oc-icon class="uk-width-auto" :name="expanded ? 'expand_less' : 'expand_more'" />
      <div class="uk-width-expand uk-text-truncate">
        <translate
          v-if="count === 1"
          id="files-upload-progress-single"
          key="upload-progress-single"
          :translate-params="{ fileName: inProgress[0].name }"
          translate-comment="Upload progress when only uploading one file shows the name of the file."
        >
          Uploading "%{ fileName }"
        </translate>
        <translate
          v-else
          id="files-upload-progress-multi"
          key="upload-progress-multi"
          :translate-n="count"
          translate-plural="Uploading %{ count } items"
          translate-comment="Upload progress when uploading multiple files only shows the number of uploads."
        >
          Uploading %{ count } item
        </translate>
      </div>
      <div class="uk-width-auto">
        <translate
          v-if="expanded"
          id="files-upload-progress-collapse-details"
          key="upload-progress-collapse-details"
          translate-comment="Hide details panel of upload progress"
        >
          Hide Details
        </translate>
        <translate
          v-else
          id="files-upload-progress-expand-details"
          key="upload-progress-expand-details"
          translate-comment="Show details panel of upload progress"
        >
          Show Details
        </translate>
      </div>
    </oc-grid>
    <details-widget
      v-if="expanded"
      :items="inProgress"
      class="uk-width-expand oc-upload-details-scrollable"
    />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import DetailsWidget from './DetailsWidget.vue'
import Mixins from '../../mixins'

export default {
  name: 'UploadProgress',
  components: {
    DetailsWidget
  },
  mixins: [Mixins],
  data() {
    return {
      expanded: false,
      announcement: '',
      announcementOnComplete: this.$gettext('Upload complete')
    }
  },
  computed: {
    ...mapGetters('Files', ['inProgress', 'uploaded']),

    count() {
      return this.inProgress.length
    },

    totalUploadProgress() {
      let totalSizeSum = 0
      let progressSizeSum = 0

      for (const item of this.inProgress) {
        totalSizeSum += item.size
        progressSizeSum += (item.size * item.progress) / 100
      }

      for (const item of this.uploaded) {
        totalSizeSum += item.size
        progressSizeSum += item.size
      }

      if (this.inProgress.length > 0 && totalSizeSum > 0) {
        return (progressSizeSum / totalSizeSum) * 100
      } else {
        return 100
      }
    },

    uploadPending() {
      return this.totalUploadProgress < 100
    }
  },
  watch: {
    totalUploadProgress(value) {
      if (value === 100) {
        this.expanded = false
        this.announcement = this.announcementOnComplete
      }
    }
  },
  created() {
    this.$root.$on('upload-start', () => {
      this.$nextTick(() => {
        this.delayForScreenreader(() => this.$refs.progressbar.$el.focus())
      })
    })
    window.addEventListener('beforeunload', this.confirmUnload)
  },
  beforeDestroy() {
    window.removeEventListener('beforeunload', this.confirmUnload)
  },
  methods: {
    $_toggleExpanded() {
      this.expanded = !this.expanded
    },
    confirmUnload(event) {
      if (this.uploadPending) {
        event.preventDefault()
        event.returnValue = ''
      }
    }
  }
}
</script>

<style>
/* FIXME: move whole text part to ODS. it is useful to have a text component available for the progress bar. */
.files-upload-progress .oc-progress-text {
  font-size: 0.75em;
  color: var(--oc-color-text-inverse);
}
.files-upload-progress .uk-progress {
  box-shadow: 0 0 2px var(--oc-color-border);
}
</style>
<style scoped>
.files-upload-progress {
  background-color: var(--oc-color-background-muted);
}
/* FIXME: move to ODS somehow? with the very specific max-height it probably doesn't make a generic css class from it... */
.oc-upload-details-scrollable {
  max-height: 200px;
  overflow: auto;
  -webkit-overflow-scrolling: touch;
  resize: both;
}
</style>
