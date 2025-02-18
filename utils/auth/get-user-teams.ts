import axios from 'axios';
import qs from 'qs';
import config from '../../config';

export const getGraphAccessToken = async (): Promise<string> => {
    const url = `https://login.microsoftonline.com/${config.EntraID.tenant}/oauth2/v2.0/token`;

    const params = {
        client_id: config.EntraID.client,
        client_secret: config.EntraID.secret,
        grant_type: 'client_credentials',
        scope: 'https://graph.microsoft.com/.default',
    };

    const headers = {
        'Content-Type': 'application/x-www-form-urlencoded',
    };

    try {
        const response = await axios.post(url, qs.stringify(params), { headers });
        return response.data.access_token;
    } catch (error) {
        console.error('Error fetching access token:', error);
        throw new Error('Could not retrieve access token');
    }
}

export const getUserGroups = async (graphAccessToken: string, userId: string): Promise<string[]> => {
    const url = `https://graph.microsoft.com/v1.0/users/${userId}/joinedTeams`;
    const headers = {
        Authorization: `Bearer ${graphAccessToken}`,
    };

    try {
        const response = await axios.get(url, { headers });
        const teams = response.data.value.map((team: any) => team.displayName);
        return teams;
    } catch (error) {
        console.error('Error fetching user teams:', error);
        throw new Error('Could not retrieve user teams');
    }
};

export const getTeamIdByName = async (graphAccessToken: string, teamName: string): Promise<string | null> => {
    let url = `https://graph.microsoft.com/v1.0/groups?$filter=resourceProvisioningOptions/Any(x:x eq 'Team')`;
    const headers = { Authorization: `Bearer ${graphAccessToken}` };
    let allTeams: any[] = [];

    try {
        while (url) {
            const response = await axios.get(url, { headers });
            allTeams = allTeams.concat(response.data.value);
            url = response.data["@odata.nextLink"] || null;
        }

        const filteredTeam = allTeams.find(team => team.displayName.trim().toLowerCase() === teamName.trim().toLowerCase());
        return filteredTeam ? filteredTeam.id : null;
    } catch (error) {
        console.error("Error fetching Teams:", error);
        throw new Error("Could not retrieve team ID");
    }
};
