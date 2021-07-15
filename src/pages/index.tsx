import { Typography } from "@material-ui/core";
import { useUser } from "../context/AuthContext";

const Home: React.FC = () => {
  const { user } = useUser();
  console.log(user);
  return <Typography variant="h1">Hello World</Typography>;
};

export default Home;
