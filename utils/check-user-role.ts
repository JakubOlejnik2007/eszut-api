enum EUserRole {
    ADMIN = 2,
    USER = 1,
    GUEST = 0
}

const checkUserRole = (teamsArray: (string | null)[]): EUserRole => {
    const TEACHER_GROUPS = "2C Informatyka"
    const ADMINISTRATOR_GROUPS = "3C_JP"

    if (teamsArray.includes(ADMINISTRATOR_GROUPS)) return EUserRole.ADMIN;
    else if (teamsArray.includes(TEACHER_GROUPS)) return EUserRole.USER;
    else return EUserRole.GUEST;
}

export default checkUserRole;