import { shareTypes, userShareTypes } from '../helpers/shareTypes'

export default {
  inProgress: state => {
    return state.inProgress
  },
  selectedFiles: (state, getters) => {
    return getters.filesAll.filter(f => state.selectedIds.includes(f.id))
  },
  files: state => {
    return state.files
  },
  filesAll: state => state.filesSearched || state.files,
  currentFolder: state => {
    return state.currentFolder
  },
  // a flat file list has no current folder nor parent
  flatFileList: state => !!state.currentFolder === false,
  activeFiles: (state, getters, rootState) => {
    let files = [].concat(getters.filesAll)

    if (!state.areHiddenFilesShown) {
      files = files.filter(file => !file.name.startsWith('.'))
    }

    const { itemsPerPage, currentPage } = rootState.Files.pagination
    if (itemsPerPage > 0) {
      const firstElementIndex = (currentPage - 1) * itemsPerPage

      return files.splice(firstElementIndex, itemsPerPage)
    }

    return files
  },
  activeFilesSize: (state, getters) => {
    return $_fileSizes(getters.activeFiles)
  },
  activeFilesCount: (state, getters) => {
    return $_fileCounts(getters.activeFiles)
  },
  totalFilesSize: (state, getters) => {
    return $_fileSizes(getters.filesAll)
  },
  totalFilesCount: (state, getters) => {
    return $_fileCounts(getters.filesAll)
  },
  dropzone: state => {
    return state.dropzone
  },
  currentFileOutgoingCollaborators: state => {
    return state.currentFileOutgoingShares.filter(share => {
      return userShareTypes.includes(share.shareType)
    })
  },
  currentFileOutgoingLinks: state => {
    return state.currentFileOutgoingShares.filter(share => {
      return share.shareType === shareTypes.link
    })
  },
  currentFileOutgoingSharesLoading: state => {
    return state.currentFileOutgoingSharesLoading
  },
  sharesTree: state => state.sharesTree,
  sharesTreeLoading: state => state.sharesTreeLoading,
  loadingFolder: (state, getter) => {
    // when loading the shares tree, it is only related to the full folder
    // whenever no file is selected / no sidebar is open.
    // else it means we're loading the shares only for the sidebar contents and shouldn't
    // be showing a progress bar for the whole folder
    return state.loadingFolder || (getter.highlightedFile === null && state.sharesTreeLoading)
  },
  quota: state => {
    return state.quota
  },
  highlightedFile: (state, getters) => {
    if (getters.selectedFiles.length > 0) {
      return getters.selectedFiles[0]
    }
    return state.currentFolder
  },
  versions: state => {
    return state.versions
  },
  publicLinkPassword: state => {
    // we need to use the state for reactivity
    if (state.publicLinkPassword) {
      return state.publicLinkPassword
    }

    let password = sessionStorage.getItem('publicLinkInfo')
    if (password) {
      try {
        password = atob(password)
      } catch (e) {
        sessionStorage.removeItem('publicLinkInfo')
      }
    }

    return password
  },
  uploaded: state => state.uploaded,
  actionsInProgress: state => state.actionsInProgress
}

// eslint-disable-next-line camelcase
function $_fileSizes(files) {
  return files.map(file => parseInt(file.size)).reduce((x, y) => x + y, 0)
}

// eslint-disable-next-line camelcase
function $_fileCounts(files) {
  const fileCount = files.filter(file => file.type === 'file').length
  const folderCount = files.filter(file => file.type === 'folder').length
  return {
    files: fileCount,
    folders: folderCount
  }
}
