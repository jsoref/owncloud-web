const meta = {
  files: {
    name: 'Files',
    id: 'files',
    icon: 'folder'
  },
  mediaviewer: {
    name: 'Mediaviewer',
    id: 'mediaviewer',
    icon: 'image'
  },
  'draw-io': {
    name: 'Draw.io',
    id: 'draw-io',
    icon: 'grid_on'
  },
  'markdown-editor': {
    name: 'MarkdownEditor',
    id: 'markdown-editor',
    icon: 'text'
  }
}

const routes = [
  'files-personal',
  'files-favorites',
  'files-shared-with-others',
  'files-shared-with-me',
  'files-public-list'
]

const editors = [
  {
    app: 'draw-io',
    extension: 'drawio',
    handler: null,
    icon: null,
    newTab: true,
    routeName: 'draw-io-edit',
    routes
  },
  {
    app: 'mediaviewer',
    extension: 'png',
    handler: null,
    icon: null,
    newTab: false,
    routeName: 'mediaviewer-media',
    routes
  },
  {
    app: 'markdown-editor',
    extension: 'md',
    handler: null,
    icon: null,
    newTab: false,
    routeName: 'markdown-editor',
    routes
  }
]

const sideBars = [
  {
    app: 'details-item',
    enabled: jest.fn(),
    icon: 'info_outline'
  },
  {
    app: 'actions-item',
    enabled: jest.fn(),
    icon: 'info_outline'
  }
]

exports.apps = {
  customFileListIndicators: [],
  file: {
    edit: false,
    path: ''
  },
  fileEditors: editors,
  fileSideBars: sideBars,
  newFileHandlers: editors,
  meta
}

const fileActions = {
  download: {
    label: 'Download',
    class: 'oc-files-actions-sidebar-download-trigger',
    selector: '.oc-files-actions-sidebar-download-trigger',
    handler: jest.fn()
  },
  copy: {
    label: 'Copy',
    class: 'oc-files-actions-sidebar-copy-trigger',
    selector: '.oc-files-actions-sidebar-copy-trigger',
    handler: jest.fn()
  },
  rename: {
    label: 'Rename',
    class: 'oc-files-actions-sidebar-rename-trigger',
    selector: '.oc-files-actions-sidebar-rename-trigger',
    handler: jest.fn()
  },
  move: {
    label: 'Move',
    class: 'oc-files-actions-sidebar-move-trigger',
    selector: '.oc-files-actions-sidebar-move-trigger',
    handler: jest.fn()
  },
  delete: {
    label: 'Delete',
    class: 'oc-files-actions-sidebar-delete-trigger',
    selector: '.oc-files-actions-sidebar-delete-trigger',
    handler: jest.fn()
  },

  'markdown-editor': {
    label: 'Open in Markdown Editor',
    class: 'oc-files-actions-sidebar-markdown-editor-trigger',
    selector: '.oc-files-actions-sidebar-markdown-editor-trigger',
    handler: jest.fn(),
    opensInNewWindow: true
  },
  'draw-io': {
    label: 'Open in DrawIO',
    class: 'oc-files-actions-sidebar-draw-io-trigger',
    selector: '.oc-files-actions-sidebar-draw-io-trigger',
    handler: jest.fn(),
    opensInNewWindow: true
  },
  mediaviewer: {
    label: 'Open in MediaViewer',
    class: 'oc-files-actions-sidebar-mediaviewer-trigger',
    selector: '.oc-files-actions-sidebar-mediaviewer-trigger',
    handler: jest.fn()
  },
  'open-folder': {
    label: 'Open Folder',
    class: 'oc-files-actions-sidebar-navigate-trigger',
    selector: '.oc-files-actions-sidebar-navigate-trigger',
    handler: jest.fn()
  }
}

exports.fileActions = fileActions

exports.getActions = function(actions = []) {
  const defaultActions = ['download', 'markdown-editor', 'draw-io', 'mediaviewer', 'open-folder']

  const res = []
  for (const key of actions) {
    const action = fileActions[key]

    const actionObj = {
      icon: key,
      handler: action.handler,
      isEnabled: () => true,
      label: () => action.label,
      componentType: 'oc-button',
      class: action.class,
      canBeDefault: defaultActions.indexOf(key) > -1,
      opensInNewWindow: action.opensInNewWindow || false
    }
    res.push(actionObj)
  }
  return res
}

exports.filesPersonalRoute = { name: 'files-personal' }
