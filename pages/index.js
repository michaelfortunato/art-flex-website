import Store from "@components/Store/Store";
import Appbar from "@components/Appbar";
import styles from "@styles/IndexPage.module.css";
import { useInView } from "react-intersection-observer";
import axios from "axios";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { signIn } from "redux-store/features/account/accountSlice";
export default function IndexPage() {
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
  return (
    <div className={styles.IndexPage}>
      <Appbar />
      <Store />
    </div>
  );
}
