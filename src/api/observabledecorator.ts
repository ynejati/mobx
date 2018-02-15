import {
    asObservableObject,
    defineObservableProperty,
    setPropertyValue
} from "../types/observableobject"
import { invariant, assertPropertyConfigurable } from "../utils/utils"
import { createClassPropertyDecorator } from "../utils/decorators"
import { IEnhancer } from "../types/modifiers"

export function createDecoratorForEnhancer(enhancer: IEnhancer<any>) {
    invariant(!!enhancer, ":(")
    return createClassPropertyDecorator(
        (target, name, baseValue, _, baseDescriptor) => {
            assertPropertyConfigurable(target, name)
            invariant(
                !baseDescriptor || !baseDescriptor.get,
                "@observable can not be used on getters, use @computed instead"
            )

            const adm = asObservableObject(target, undefined)
            defineObservableProperty(adm, name, baseValue, enhancer)
        },
        function(name) {
            const observable = this.$mobx.values[name]
            if (
                observable === undefined // See #505
            )
                return undefined
            return observable.get()
        },
        function(name, value) {
            setPropertyValue(this, name, value)
        },
        true,
        false
    )
}
