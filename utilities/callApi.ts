import axios, { AxiosRequestConfig, Method } from 'axios';
import * as Keychain from 'react-native-keychain';

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

interface CallApiOptions {
  method: HttpMethod;
  body?: any;
  headers?: any;
}

const axiosInstance = axios.create({
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.request.use((config: any) => {
    return getToken().then((token) => {
      if (token) {
        config.headers = config.headers || {};
        config.headers['Authorization'] = `Bearer ${token}`;
        console.log("AXIOS: ", token)
      }
      return config;
    });
  }, (error) => {
    return Promise.reject(error);
  });
  

const callApi = async (url: string, options: CallApiOptions): Promise<any> => {
  const { method, body, headers } = options;

  const config: AxiosRequestConfig = {
    method: method as Method,
    url: url,
    headers: {
      ...headers,
    },
    data: body,
  };

  try {
    const response = await axiosInstance(config);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Error during API call:', error.message);
      throw new Error(
        error.response ?
        `${error.response.status} ${error.response.statusText}, Data: ${JSON.stringify(error.response.data)}` :
        error.message
      );
    } else {
      console.error('Unexpected error:', error);
      throw new Error('An unexpected error occurred');
    }
  }
};

export default callApi;

export async function getToken() {
    try {
      const credentials = await Keychain.getGenericPassword();
      if (credentials) {
        return credentials.password;
      }
      return null;
    } catch (error) {
      console.error('Error retrieving token', error);
      return null;
    }
}

// import axios, { AxiosRequestConfig, Method, AxiosError } from 'axios';

// type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

// interface CallApiOptions {
//   method: HttpMethod;
//   body?: any;
//   headers?: any;
// }

// const callApi = async (url: string, options: CallApiOptions): Promise<any> => {
//   const { method, body, headers } = options;
//   const token = await getToken();

//   const config: AxiosRequestConfig = {
//     method: method as Method,
//     url: url,
//     headers: {
//       'Content-Type': 'application/json',
//       Authorization: `Bearer ${token}`,
//       ...headers,
//     },
//     withCredentials: true,
//     data: body,
//   };

//   try {
//     const response = await axios(config);
//     return response.data;
//   } catch (error) {
//     if (axios.isAxiosError(error)) {
//       console.error('Error during API call:', error.message);
//       throw new Error(
//         error.response ?
//         `${error.response.status} ${error.response.statusText}, Data: ${JSON.stringify(error.response.data)}` :
//         error.message
//       );
//     } else {
//       console.error('Unexpected error:', error);
//       throw new Error('An unexpected error occurred');
//     }
//   }
// };

// export default callApi;
