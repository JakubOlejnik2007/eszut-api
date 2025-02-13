import axios from "axios";
import { getGraphAccessToken } from "./auth/get-user-teams";

const getTeamMembers = async (teamId: string) => {

    const accessToken = await getGraphAccessToken();

    const url = `https://graph.microsoft.com/v1.0/teams/${teamId}/members`;
    const headers = {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
    };

    try {
        const response = await axios.get(url, { headers });
        return response.data.value.map((member: any) => ({
            id: member.id,
            displayName: member.displayName,
            email: member.email || member.userPrincipalName,
        }));
    } catch (error) {
        console.error('Error fetching team members:', error);
        throw new Error('Could not retrieve team members');
    }
};

export default getTeamMembers;