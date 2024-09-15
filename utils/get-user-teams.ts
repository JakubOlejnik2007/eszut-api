import axios from 'axios';
import qs from 'qs';
import config from '../config';

export const getGraphAccessToken = async (userToken: string): Promise<string> => {
    const url = `https://login.microsoftonline.com/${config.EntraID.tenant}/oauth2/v2.0/token`;

    const params = {
        client_id: config.EntraID.client,
        client_secret: config.EntraID.secret,  // Dodaj swój Application Secret do configu
        grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
        requested_token_use: 'on_behalf_of',
        scope: 'https://graph.microsoft.com/.default',
        assertion: userToken,
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
    const url = `https://graph.microsoft.com/v1.0/users/${userId}/memberOf`;

    const headers = {
        Authorization: `Bearer ${graphAccessToken}`,
    };

    try {
        const response = await axios.get(url, { headers });
        const groups = response.data.value.map((group: any) => group.displayName); // Mapowanie na nazwę grupy
        return groups;
    } catch (error) {
        console.error('Error fetching user groups:', error);
        throw new Error('Could not retrieve user groups');
    }
}