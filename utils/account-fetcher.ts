import axios from "axios";
import useSWR, { KeyedMutator } from "swr";

export function useIsLoggedIn() {
  const { data, mutate, error } = useSWR("/is-logged-in", url =>
    axios
      .get(url)
      .then(res => res.data)
      .catch(() => undefined)
  );
  return {
    user: data,
    error,
    mutate
  };
}

export function signOut(mutate: KeyedMutator<any>) {
  axios.post("/logout").then(() => mutate(undefined, false));
}
