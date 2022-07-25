import { useBeforeunload } from "react-beforeunload";
import { useNavigate } from "react-router-dom";

export default function Example() {
  const navigate = useNavigate();
  useBeforeunload((event) => event.preventDefault());
  return (
    navigate('/')
  )
}

