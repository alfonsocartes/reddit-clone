import {
  createContext,
  useState,
  useEffect,
  Dispatch,
  SetStateAction,
  useContext,
} from "react";

// AWS Amplify
import { CognitoUser } from "@aws-amplify/auth";
import { Auth, Hub } from "aws-amplify";

interface Props {
  children: React.ReactElement;
}

interface IUserContext {
  user: CognitoUser | null;
  setUser: Dispatch<SetStateAction<CognitoUser>>;
}

const UserContext = createContext<IUserContext>({} as IUserContext);

const AuthContext = ({ children }: Props) => {
  const [user, setUser] = useState<CognitoUser | null>(null);

  async function checkUser() {
    try {
      const amplifyUser = await Auth.currentAuthenticatedUser();
      if (amplifyUser) {
        setUser(amplifyUser);
      }
    } catch (error) {
      // No current signed user
      setUser(null);
    }
  }

  useEffect(() => {
    checkUser();
  }, []);

  useEffect(() => {
    Hub.listen("auth", () => {
      // Perform some action to update state whenever an auth event is detected
      checkUser();
    });
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export default AuthContext;

// Custom Hook
export const useUser = (): IUserContext => useContext(UserContext);
