// Tipe minimal Google Identity Services (accounts.google.com/gsi/client)
interface GoogleCredentialResponse {
  credential: string;
}

interface GoogleIdConfiguration {
  client_id: string;
  callback: (response: GoogleCredentialResponse) => void;
}

interface GsiButtonOptions {
  theme?: "outline" | "filled_blue" | "filled_black";
  size?: "large" | "medium" | "small";
  shape?: "rectangular" | "pill" | "circle" | "square";
  text?:
    | "continue_with"
    | "signin_with"
    | "signup_with"
    | "continue"
    | "signin"
    | "signup";
  width?: number;
  locale?: string;
}

interface Window {
  google?: {
    accounts: {
      id: {
        initialize: (config: GoogleIdConfiguration) => void;
        renderButton: (parent: HTMLElement, options?: GsiButtonOptions) => void;
      };
    };
  };
}
