import config from "../config";

enum EUserRole {
    ADMIN = 2,
    USER = 1,
    GUEST = 0
}

const checkUserRole = (teamsArray: (string | null)[]): EUserRole => {

    if (teamsArray.includes(config.authTeams.admins)) return EUserRole.ADMIN;
    else if (teamsArray.includes(config.authTeams.teachers)) return EUserRole.USER;
    else return EUserRole.GUEST;
}

export default checkUserRole;