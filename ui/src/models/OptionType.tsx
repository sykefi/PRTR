export interface OptionType<T extends string | number> {
  value: T
  label: string
  bold?: boolean
  indent?: boolean
}

export const asOption = <T extends string | number>(
  v: T[] | undefined,
  label: (number | string)[] | undefined
): OptionType<T>[] | null => {
  return (v !== undefined && label !== undefined)
    ? v.map((elem, index) => ({
      value: elem,
      label: label[index].toString()
    }))
    : null
}

export const asSingleOption = <T extends string | number>(
  v: T | undefined,
  label: number | string | undefined
): OptionType<T> | null => {
  return v && label
    ? {
        value: v,
        label: label.toString()
      }
    : null
}