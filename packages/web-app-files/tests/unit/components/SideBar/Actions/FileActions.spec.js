import Vuex from 'vuex'
import DesignSystem from 'owncloud-design-system'
import stubs from '@/tests/unit/stubs/index.js'
import { createLocalVue, mount } from '@vue/test-utils'
import FileActions from '@files/src/components/SideBar/Actions/FileActions.vue'

import GetTextPlugin from 'vue-gettext'

import { apps, getActions, fileActions } from '@files/tests/__fixtures__/fileActions.js'

const localVue = createLocalVue()
localVue.use(DesignSystem)
localVue.use(Vuex)
localVue.use(GetTextPlugin, {
  translations: 'does-not-matter.json',
  silent: true
})

const filesPersonalRoute = { name: 'files-personal' }

function getWrapper(route, { filename = 'testfile', extension, actions = [], type = 'file' }) {
  const mountStubs = { ...stubs, 'oc-button': false }
  const mountOptions = {
    localVue,
    store: createStore({}, filename, extension, type),
    stubs: mountStubs,
    mocks: {
      $route: route,
      publicPage: () => false
    },
    computed: {
      actions: () => getActions(actions)
    }
  }
  return mount(FileActions, mountOptions)
}

describe('FileActions', () => {
  describe('when user is on personal route', () => {
    afterEach(() => {
      jest.clearAllMocks()
    })

    it.each([
      [['copy']],
      [['copy', 'move']],
      [['copy', 'markdown-editor']],
      [['copy', 'move', 'download', 'markdown-editor']]
    ])('should show the actions correctly', actions => {
      const wrapper = getWrapper(filesPersonalRoute, {
        filename: 'welcome',
        extension: 'md',
        actions
      })

      expect(wrapper).toMatchSnapshot()
    })

    it('should trigger the action handlers on click', async () => {
      const actions = ['copy', 'download', 'move', 'open-folder', 'markdown-editor']
      const wrapper = getWrapper(filesPersonalRoute, {
        filename: 'welcome',
        extension: 'md',
        actions
      })

      for (const button of actions) {
        const action = fileActions[button]

        const buttonElement = wrapper.find(action.selector)
        expect(buttonElement.exists()).toBeTruthy()

        await buttonElement.trigger('click.stop')
        expect(action.handler).toHaveBeenCalledTimes(1)
      }
    })
  })
})

function getResource({ filename, extension, type }) {
  return {
    id: '4',
    fileId: '4',
    icon: type,
    name: type === 'file' ? `${filename}.${extension}` : filename,
    extension: extension,
    path: type === 'file' ? `/${filename}.${extension}` : `/${filename}`,
    type,
    mdate: 'Mon, 12 Jul 2021 11:04:33 GMT',
    size: '163',
    indicators: [],
    permissions: 'RDNVW',
    starred: false,
    etag: '"89128c0e8122002db57bd19c9ec33004"',
    shareTypes: [],
    downloadURL: '',
    ownerDisplayName: 'user1',
    ownerId: 'user1',
    canDownload: () => true,
    isReceivedShare: () => true,
    canBeDeleted: () => true,
    canRename: () => true
  }
}

function createStore(state, filename, extension, type = 'file') {
  return new Vuex.Store({
    state: {
      apps: apps
    },
    modules: {
      Files: {
        state: {
          ...state,
          currentFolder: { path: '' }
        },
        namespaced: true,
        getters: {
          highlightedFile: () => {
            return getResource({ filename, extension, type })
          },
          currentFolder: () => '/'
        }
      }
    }
  })
}
