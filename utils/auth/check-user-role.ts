import config from "../../config";
import EUserRole from "../../types/userroles.enum";

const checkUserRole = (teamsArray: (string | null)[]): EUserRole => {

    if (teamsArray.includes(config.authTeams.admins)) return EUserRole.ADMIN;
    if (teamsArray.includes(config.authTeams.teachers)) return EUserRole.USER;
    return EUserRole.GUEST;
}

export default checkUserRole;