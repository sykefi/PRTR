export enum FacilityTopMainActivity {
  ENERGY = '1',
  METALS = '2',
  MINERALS = '3',
  CHEMICAL = '4',
  WASTE = '5',
  WOOD = '6',
  LIVESTOCK = '7',
  FOOD = '8',
  OTHER = '9'
}

const values = Object.values(FacilityTopMainActivity)

export const isTopMainActivity = (
  value: string
): value is FacilityTopMainActivity => {
  return (values as string[]).includes(value)
}
