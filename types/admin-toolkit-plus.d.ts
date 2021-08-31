/* eslint-disable @typescript-eslint/ban-types */

declare module '@ccprivate/admin-toolkit-plus' {
  import type { Plugin } from 'vue'
  import type { RouteMeta } from 'vue-router'
  export interface CMenuItems {
    title: string
    icon: string
    route: string
    children?: Array<CMenuItems>
  }
  interface Breadcrumb {
    name: string
    to?: { name: string; }
  }
  export type CBreadcrumbItems = Array<Breadcrumb>
  interface TagNav {
    name: string
    meta: RouteMeta
    fullPath: string
  }
  export type CTagNavInitTags = Array<TagNav>

  export type CTagNav = import('vue').DefineComponent<
    {
      defaultPath: { type: StringConstructor; default: string; }
      initTags: { type: ArrayConstructor; default: () => []; }
      titles: { type: ObjectConstructor; default: () => {}; }
      theme: { type: StringConstructor; default: () => ''; }
    },
    {
      tags: CTagNavInitTags
    },
    unknown,
    {},
    {},
    import('vue').ComponentOptionsMixin,
    import('vue').ComponentOptionsMixin,
    'navigate'[],
    'navigate',
    import('vue').VNodeProps & import('vue').AllowedComponentProps & import('vue').ComponentCustomProps,
    Readonly<{
      initTags: CTagNavInitTags
    } & {
      defaultPath?: string
      titles?: Record<string, any>
      theme?: string
    }>,
    {
      initTags: CTagNavInitTags
    }>

  declare const _default: Plugin
  export default _default
}
