import { ActionContext } from 'vuex'
import { RootState } from '@/store/index'

export interface TagViews {
  path: string
  name: string
  meta: { title: string; noCache: boolean; affix: string; }
}

export interface TagModuleState {
  visitedViews: Array<TagViews>
  cachedViews: Array<string>
}

type TagsActionContext = ActionContext<TagModuleState, RootState>


const tagsView = {
  state: {
    visitedViews: [],
    cachedViews: []
  },
  mutations: {
    ADD_VISITED_VIEW: (state: TagModuleState, view: TagViews) => {
      if (state.visitedViews.some(v => v.path === view.path)) return
      state.visitedViews.push(
        Object.assign({}, view, {
          title: view.meta.title || 'no-name'
        })
      )
    },
    ADD_CACHED_VIEW: (state: TagModuleState, view: TagViews) => {
      if (state.cachedViews.includes(view.name)) return
      if (!view.meta.noCache) {
        state.cachedViews.push(view.name)
      }
    },

    DEL_VISITED_VIEW: (state: TagModuleState, view: TagViews) => {
      for (const [i, v] of state.visitedViews.entries()) {
        if (v.path === view.path) {
          state.visitedViews.splice(i, 1)
          break
        }
      }
    },
    DEL_CACHED_VIEW: (state: TagModuleState, view: TagViews) => {
      for (const i of state.cachedViews) {
        if (i === view.name) {
          const index = state.cachedViews.indexOf(i)
          state.cachedViews.splice(index, 1)
          break
        }
      }
    },

    DEL_OTHERS_VISITED_VIEWS: (state: TagModuleState, view: TagViews) => {
      state.visitedViews = state.visitedViews.filter(v => {
        return v.meta.affix || v.path === view.path
      })
    },
    DEL_OTHERS_CACHED_VIEWS: (state: TagModuleState, view: TagViews) => {
      for (const i of state.cachedViews) {
        if (i === view.name) {
          const index = state.cachedViews.indexOf(i)
          state.cachedViews = state.cachedViews.slice(index, index + 1)
          break
        }
      }
    },

    DEL_ALL_VISITED_VIEWS: (state: TagModuleState) => {
      // keep affix tags
      const affixTags = state.visitedViews.filter(tag => tag.meta.affix)
      state.visitedViews = affixTags
    },
    DEL_ALL_CACHED_VIEWS: (state: TagModuleState) => {
      state.cachedViews = []
    },

    UPDATE_VISITED_VIEW: (state: TagModuleState, view: TagViews) => {
      for (let v of state.visitedViews) {
        if (v.path === view.path) {
          v = Object.assign(v, view)
          break
        }
      }
    }

  },
  actions: {
    addView ({ dispatch }: TagsActionContext, view: TagViews) {
      dispatch('addVisitedView', view)
      dispatch('addCachedView', view)
    },
    addVisitedView ({ commit }: TagsActionContext, view: TagViews) {
      commit('ADD_VISITED_VIEW', view)
    },
    addCachedView ({ commit }: TagsActionContext, view: TagViews) {
      commit('ADD_CACHED_VIEW', view)
    },

    delView ({ dispatch, state }: TagsActionContext, view: TagViews) {
      return new Promise(resolve => {
        dispatch('delVisitedView', view)
        dispatch('delCachedView', view)
        resolve({
          visitedViews: [...state.visitedViews],
          cachedViews: [...state.cachedViews]
        })
      })
    },
    delVisitedView ({ commit, state }: TagsActionContext, view: TagViews) {
      return new Promise(resolve => {
        commit('DEL_VISITED_VIEW', view)
        resolve([...state.visitedViews])
      })
    },
    delCachedView ({ commit, state }: TagsActionContext, view: TagViews) {
      return new Promise(resolve => {
        commit('DEL_CACHED_VIEW', view)
        resolve([...state.cachedViews])
      })
    },

    delOthersViews ({ dispatch, state }: TagsActionContext, view: TagViews) {
      return new Promise(resolve => {
        dispatch('delOthersVisitedViews', view)
        dispatch('delOthersCachedViews', view)
        resolve({
          visitedViews: [...state.visitedViews],
          cachedViews: [...state.cachedViews]
        })
      })
    },
    delOthersVisitedViews ({ commit, state }: TagsActionContext, view: TagViews) {
      return new Promise(resolve => {
        commit('DEL_OTHERS_VISITED_VIEWS', view)
        resolve([...state.visitedViews])
      })
    },
    delOthersCachedViews ({ commit, state }: TagsActionContext, view: TagViews) {
      return new Promise(resolve => {
        commit('DEL_OTHERS_CACHED_VIEWS', view)
        resolve([...state.cachedViews])
      })
    },

    delAllViews ({ dispatch, state }: TagsActionContext, view: TagViews) {
      return new Promise(resolve => {
        dispatch('delAllVisitedViews', view)
        dispatch('delAllCachedViews', view)
        resolve({
          visitedViews: [...state.visitedViews],
          cachedViews: [...state.cachedViews]
        })
      })
    },
    delAllVisitedViews ({ commit, state }: TagsActionContext) {
      return new Promise(resolve => {
        commit('DEL_ALL_VISITED_VIEWS')
        resolve([...state.visitedViews])
      })
    },
    delAllCachedViews ({ commit, state }: TagsActionContext) {
      return new Promise(resolve => {
        commit('DEL_ALL_CACHED_VIEWS')
        resolve([...state.cachedViews])
      })
    },

    updateVisitedView ({ commit }: TagsActionContext, view: TagViews) {
      commit('UPDATE_VISITED_VIEW', view)
    }
  }
}

export default tagsView
