export const LOGIN_FREE_LIST = ['/login', '/register', '/404'] // 不用登录就能访问的路由
export const WHITE_LIST = [...LOGIN_FREE_LIST, '/desktop'] // 不用进行菜单校验的路由
export const BLACK_LIST = []
export const isInLoginFreeList = (path: string) => LOGIN_FREE_LIST.findIndex(p => p === path) > -1
export const isInWhiteList = (path: string) => WHITE_LIST.findIndex(p => p === path) > -1
export const isInBlackList = (path: string) => BLACK_LIST.findIndex(p => p === path) > -1
