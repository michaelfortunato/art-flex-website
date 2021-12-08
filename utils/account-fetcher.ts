import axios from "axios";
import useSWR, { KeyedMutator } from "swr";

export function useIsLoggedIn() {
  const { data, mutate, error } = useSWR("/is-logged-in", url =>
    axios.get(url).then(res => res.data)
  );
  const loading = !data && !error;
  const loggedOut = error && error.status === 401;
  return {
    loading,
    loggedOut,
    user: data,
    error,
    mutate
  };
}

export async function signOut(mutate: KeyedMutator<any>) {
  try {
    await mutate(undefined, false);
    await axios.post("/logout");
    await mutate();
  } catch (error) {
    console.log(error);
  }
}
