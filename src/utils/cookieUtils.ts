import Cookies from "js-cookie";


const COOKIE_CONFIG={
    secure:import.meta.env.PROD,
    path:"/",
    sameSite:'strict' as const,
    expires:7
}

export const setAuthCookie=(
    accessToken:string,
    refreshToken:string,
    secretKey?:string
)=>{
try {
    Cookies.set('accessToken',accessToken,{
        ...COOKIE_CONFIG,
        expires:1
    })

    Cookies.set('refreshToken',refreshToken,{
        ...COOKIE_CONFIG,
        expires:7
    })

    if(secretKey){
        Cookies.set('secretKey',secretKey,{
        ...COOKIE_CONFIG,
        expires:1
    })
    }
} catch (error) {
    console.error('Error setting auth cookies:', error);
}


}

export const getAuthCookie=()=>{
    try {
    return {
      accessToken: Cookies.get('accessToken') || null,
      refreshToken: Cookies.get('refreshToken') || null,
      secretKey: Cookies.get('secretKey') || null,
    };
  } catch (error) {
    console.error('Error getting auth cookies:', error);
    return {
      accessToken: null,
      refreshToken: null,
      secretKey: null,
    };
  }
}

export const getCookie = (name: string): string | null => {
  try {
    return Cookies.get(name) || null;
  } catch (error) {
    console.error(`Error getting cookie ${name}:`, error);
    return null;
  }
};

export const setCookie = (
  name: string,
  value: string,
  expires: number = 7
) => {
  try {
    Cookies.set(name, value, {
      ...COOKIE_CONFIG,
      expires,
    });
  } catch (error) {
    console.error(`Error setting cookie ${name}:`, error);
  }
};

export const removeAuthCookies = () => {
  try {
    Cookies.remove('accessToken', { path: '/' });
    Cookies.remove('refreshToken', { path: '/' });
    Cookies.remove('secretKey', { path: '/' });
  } catch (error) {
    console.error('Error removing auth cookies:', error);
  }
};

export const removeCookie = (name: string) => {
  try {
    Cookies.remove(name, { path: '/' });
  } catch (error) {
    console.error(`Error removing cookie ${name}:`, error);
  }
};

export const isAuthenticated = (): boolean => {
  const { accessToken } = getAuthCookie();
  return !!accessToken;
};

export const hasSecretKey = (): boolean => {
  const { secretKey } = getAuthCookie();
  return !!secretKey;
};

export const updateSecretKey = (secretKey: string) => {
  try {
    Cookies.set('secretKey', secretKey, {
      ...COOKIE_CONFIG,
      expires: 1, // 1 day
    });
  } catch (error) {
    console.error('Error updating secret key:', error);
  }
};

export const getAllCookies = (): Record<string, string> => {
  try {
    return Cookies.get();
  } catch (error) {
    console.error('Error getting all cookies:', error);
    return {};
  }
};

export const clearAllCookies = () => {
  try {
    const cookies = Cookies.get();
    Object.keys(cookies).forEach(cookieName => {
      Cookies.remove(cookieName, { path: '/' });
    });
  } catch (error) {
    console.error('Error clearing all cookies:', error);
  }
};
