import post from "@utils/post";
import { useRouter } from 'next/router'
import { useEffect } from "react";
import styled from 'styled-components'
import { Grid, Typography } from '@material-ui/core'
import { motion } from 'framer-motion'
const StyledContainer = styled(motion(Grid))`
  height: 100vh;
  opacity: 0;
`
export default function VerifyAccount(props) {
  console.log(props)
  const router = useRouter();
  useEffect(() => {
    //router.push('/')
  }, [])

  return <StyledContainer
  animate = {{opacity:1}}
    container
    justifyContent='center'
    alignItems='center'
    onAnimationComplete={()=> setTimeout(()=>router.push('/'), 100)}
  >
    <Grid item>
      <Typography variant = 'h2'> Welcome to Art-Flex, {props.email}.</Typography>
    </Grid>
  </StyledContainer>;
}
export async function getServerSideProps(context) {
  const { email, token } = context.params;
  let prop;
  try {
    /*
    const response = await post(`/signup/verify/${email}/${token}`, {}).then(
      (res) => res.json()
    );
    console.log(response);
    */
  } catch (ex) {
    prop = ex
    console.log(ex);
  }
  return { props: { email, token } };
}
