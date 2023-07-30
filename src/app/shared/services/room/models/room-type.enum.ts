export enum RoomTypes {
  small = "small",
  medium = "medium",
  large = "large",
  premium = "premium",
}

export const roomTypesNames: Record<RoomTypes, string> = {
  [RoomTypes.small]: "Small",
  [RoomTypes.medium]: "Medium",
  [RoomTypes.large]: "Large",
  [RoomTypes.premium]: "Premium"
}

export const roomTypes = [
  { name: "Small", value: RoomTypes.small },
  { name: "Medium", value: RoomTypes.medium },
  { name: "Large", value: RoomTypes.large },
  { name: "Premium", value: RoomTypes.premium },
]