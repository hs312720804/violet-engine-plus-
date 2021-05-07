import Vue from "vue";


declare module "vue/types/vue" {
  interface Vue {
    /** admin-toolkit 工具库函数  */
    $c_utils: any;
  }
}

/**
  * Install "@ccprivate/admin-toolkit" into Vue.
  * Please do not invoke this method directly.
  * Call `Vue.use(AdminToolkit)` to install.
  */
export function install (Vue: Vue): void;