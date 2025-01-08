import axios from 'axios';
import qs from 'qs';
import config from '../config';

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
    console.log(url)
    const headers = {
        Authorization: `Bearer ${graphAccessToken}`,
    };

    try {
        const response = await axios.get(url, { headers });
        console.log(response.data.value)
        const teams = response.data.value.map((team: any) => team.displayName); // Mapowanie na nazwę zespołu
        return teams;
    } catch (error) {
        console.error('Error fetching user teams:', error);
        throw new Error('Could not retrieve user teams');
    }
};