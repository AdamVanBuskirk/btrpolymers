import { useEffect, useRef } from "react";

interface Props {
  loginHandler: (response: google.accounts.id.CredentialResponse) => void;
  buttonText?: string;
}

const GoogleSSO = (props: Props) => {
  const g_sso = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const googleObj = (window as any).google;   // access via window

    if (!g_sso.current || !googleObj?.accounts?.id) {
      return; // script not loaded yet, or ref not ready
    }

    googleObj.accounts.id.initialize({
      client_id: process.env.REACT_APP_GOOGLE_CLIENT_ID,
      callback: (res: any) => {
        props.loginHandler(res);
      },
    });

    googleObj.accounts.id.renderButton(g_sso.current, {
      type: "standard",
      theme: "outline",
      size: "large",
      text: props.buttonText,
    });
  }, [props.buttonText]); // or [] if text never changes

  return <div className="googleButton" ref={g_sso} />;
};

export default GoogleSSO;
