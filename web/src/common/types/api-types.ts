import { Device, HouseholdMember, User } from '@/shared/types.ts'

// all the other api types can be reused from the @/shared/types backend types
// These are modified with the DateAsString type to be able to use them in the frontend

export type DateAsString = string

/**
 * Recursively converts all Date attributes to DateAsString
 */
type StringifyDates<T extends object> = {
    [P in keyof T]: T[P] extends Date
        ? DateAsString
        : T[P] extends object
          ? StringifyDates<T[P]>
          : T[P]
}

export type ApiUser = StringifyDates<User>

export type ApiDevice = StringifyDates<Device>

export type ApiHouseholdMember = StringifyDates<HouseholdMember>
