export const handleLogout = async () => {
    localStorage.removeItem('token')
    localStorage.removeItem('refreshToken')
}
