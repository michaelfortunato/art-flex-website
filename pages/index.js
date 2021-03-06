import Store from "@components/Store/Store";
import Appbar from "@components/Appbar";
import { useInView } from "react-intersection-observer";
import axios from "axios";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { signIn } from "redux-store/features/account/accountSlice";
import styled from 'styled-components'

const Container = styled.div`
  margin-left: auto;
  margin-right: auto;
  max-width: 1870px;
`;

export default function HomePage() {
  const dispatch = useDispatch();
  useEffect(() => {
    axios
      .post("/refresh_session")
      .then(({ data }) =>
        dispatch(signIn({ name: data.name, email: data.email }))
      )
      .catch((error) => {
        console.log(error);
      });
  }, []);

  return <Store />;
}

HomePage.getLayout = function getLayout(page) {
  return (
    <Container>
      <Appbar key={1} />
      {page}
    </Container>
  );
};
