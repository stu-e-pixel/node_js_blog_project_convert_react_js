import { Box, Container, Paper, Typography } from '@mui/material'
import { Outlet } from 'react-router-dom'
import UserNavbar from '../components/user/UserNavbar'
import UserFooter from '../components/user/UserFooter'

const UserLayout = () => {
  return (
    <Box>
        <Container>

            <Paper>
                <Typography>User Panel</Typography>
                <UserNavbar/>
                <Outlet/>
                <UserFooter/>

            </Paper>

        </Container>

    </Box>
  )
}

export default UserLayout