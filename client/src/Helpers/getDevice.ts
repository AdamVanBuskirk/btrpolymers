
export const getDevice = () => {
    const ua = navigator.userAgent;
    const browser = ua.match(/(Chrome|Firefox|Safari|Edg|Opera)/)?.[0] || 'Browser';
    const os = /Mac/i.test(ua) ? 'Mac' : /Win/i.test(ua) ? 'Windows' : /iPhone|iPad/i.test(ua) ? 'iOS' : /Android/i.test(ua) ? 'Android' : 'Unknown OS';
    const deviceInfo = `${os} ${browser}`;
    return deviceInfo;
}