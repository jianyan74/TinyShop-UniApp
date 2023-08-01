import { InjectionKey } from "vue"
import { loadModules, context, modules } from "./modules"
import { createStore, useStore as baseUseStore, Store, createLogger } from "vuex"

export interface State {
    [key: string]: any
}

export const key: InjectionKey<Store<State>> = Symbol();

const store = createStore({
    modules
});

export function useStore() {
    return baseUseStore();
}

// 热重载
if (import.meta.hot) {
    import.meta.hot?.accept(Object.keys(context), () => {
        const { modules } = loadModules()
        store.hotUpdate({
            modules
        })
    })
}

export default store;
