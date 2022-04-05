import { useRouter } from 'next/router'
import { useEffect } from "react";
import styled from 'styled-components'
import { Grid, Typography } from '@material-ui/core'
import { motion } from 'framer-motion'
import axios from 'axios'

//Redux imports
import { useSelector, useDispatch } from 'react-redux';
import { signIn, signOut } from '../../../redux-store/features/account/accountSlice'
import { NoEncryption } from '@material-ui/icons';
const StyledContainer = styled(motion(Grid))`
  height: 100vh;
  opacity: 0;
`
export default function VerifyAccount(props) {
  const router = useRouter();
  const dispatch = useDispatch();

  useEffect(() => {
    if (props.success) dispatch(signIn({ email: props.email }))
  }, [])

  return <StyledContainer
    initial={props.success} //only animate if the sign up is successful
    animate={{ opacity: 1 }}
    container
    justifyContent='center'
    alignItems='center'
    onAnimationComplete={() => setTimeout(() => router.push('/'), 100)}
  >
    <Grid item>
      {props.success ? <Typography variant='h2'>Welcome to Art-Flex, {props.name}.</Typography> :
        <Typography variant='h4'>{props.statusMessage}</Typography>
      }
    </Grid>
  </StyledContainer>;
}
export async function getServerSideProps(context) {
  let props = { name: null, email: null, success: null, statusMessage: null }
  try {
    const { email, token } = context.params;
    // We have to give the baseURL here as this is executed server side and it has
    // no idea what domain its running on 
    const baseURL = process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : 'https://art-flex.co'
    const response = await axios.post(`${baseURL}/api/signup/verify`, { email, token })

    response.headers['set-cookie'].forEach(cookieString => {
      context.res.setHeader('Set-Cookie', cookieString)
    })
    props = { name: response.data.name, email: response.data.email, success: true, statusMessage: response.data.statusMessage }
  } catch (error) {
    console.log(error)
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      let { statusMessage } = error.response.data
      props = { ...props, success: false, statusMessage }
    } else {
      // Something happened in setting up the request that triggered an Error
      props = { ...props, success: false, statusMessage: "Art Flex is undergoing maintenence. Try again later." }
    }
  }
  return { props };
}
