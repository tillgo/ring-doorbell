import { DateAsString } from '@/common/types/api-types.ts'

export const dateToXMagnitudeAgo = (date: DateAsString): string => {
    const now = new Date()
    const diff = now.getTime() - new Date(date).getTime()

    const seconds = diff / 1000
    const minutes = seconds / 60
    const hours = minutes / 60
    const days = hours / 24
    const weeks = days / 7
    const months = days / 30
    const years = days / 365

    if (seconds < 60) {
        return `Just now`
    } else if (minutes < 60) {
        const min = Math.floor(minutes)
        return `${min} min${min === 1 ? '' : 's'} ago`
    } else if (hours < 24) {
        const h = Math.floor(hours)
        return `${h} hour${h === 1 ? '' : 's'} ago`
    } else if (days < 7) {
        const d = Math.floor(days)
        return `${d} day${d === 1 ? '' : 's'} ago`
    } else if (weeks < 4) {
        const w = Math.floor(weeks)
        return `${w} week${w === 1 ? '' : 's'} ago`
    } else if (months < 12) {
        const m = Math.floor(months)
        return `${m} month${m === 1 ? '' : 's'} ago`
    } else {
        const y = Math.floor(years)
        return `${y} year${y === 1 ? '' : 's'} ago`
    }
}
