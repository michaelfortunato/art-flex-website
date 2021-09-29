import post from "@utils/post";
export default function VerifyAccount(props) {
	console.log(props)
  return <div></div>;
}
export async function getServerSideProps(context) {
  const { email, token } = context.params;
  let prop;
  try {
    const response = await post(`/signup/verify/${email}/${token}`, {}).then(
      (res) => res.json()
    );
    console.log(response);
  } catch (ex) {
	prop = ex
    console.log(ex);
  }
  return { props: { prop } };
}
