import Appbar from "@components/Appbar";
import axios from "axios";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { selectAccount } from "redux-store/features/account/accountSlice";
import styled from "styled-components";
import useSWR from "swr";
import Studio from "@components/Studio";
const fetcher = (url) => axios.get(url).then((res) => res.data);
const useProfile = () => {
  const { data, error } = useSWR("/profile", fetcher);
  return {
    user: data,
    isLoading: !error && !data,
    isError: error,
  };
};

const Container = styled.div`
  margin-left: auto;
  margin-right: auto;
  max-width: 1870px;
`;

//const {user, isLoading, isError} = useProfile();
export default function Posts() {
  //const { user, isLoading, isError } = useProfile();
  return <Studio />;
}

Posts.getLayout = function getLayout(page) {
  return (
    <Container key={1}>
      <Appbar key={1}/>
      {page}
    </Container>
  );
};

/*
export async function getServerSideProps(context) {
  let props = { name: null, email: null, success: null, statusMessage: null };
  const {accessToken, refreshToken} = 

}
*/
