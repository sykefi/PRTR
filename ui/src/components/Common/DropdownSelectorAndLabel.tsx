import { FormLabel } from '@chakra-ui/form-control'
import { Box } from '@chakra-ui/layout'
import { OptionType } from '../../models/OptionType'
import { ChakraSelect } from '../ChakraReactSelect'

type OptionValue = string | number

export const DropdownSelectorAndLabel = <TOptionValue extends OptionValue>({
  width,
  minWidth,
  label,
  name,
  placeholder,
  isLoading,
  options,
  value,
  handleChange
}: {
  width: number
  minWidth: number
  label: string
  name: string
  placeholder: string
  isLoading?: boolean
  options: OptionType<TOptionValue>[]
  value: OptionType<TOptionValue> | null
  handleChange: (v: TOptionValue | undefined) => void
}) => {
  return (
    <Box width={width} minWidth={minWidth}>
      <FormLabel>{label} </FormLabel>
      <ChakraSelect
        isClearable
        closeMenuOnSelect
        name={name}
        placeholder={placeholder}
        isLoading={isLoading}
        options={options}
        value={value}
        onChange={e => handleChange(e?.value)}
      />
    </Box>
  )
}
