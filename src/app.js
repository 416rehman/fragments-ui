import {Navbar, Button, Text, styled, Avatar} from "@nextui-org/react";
import {Auth, getUser} from './utils/auth.js';
import {useEffect, useState} from "react";

const Box = styled("div", {
    boxSizing: "border-box",
});
export default function App() {
    // check if we are signed in
    const [user, setUser] = useState(null);
    useEffect(() => {
        getUser().then(setUser);
    }, []);
    return (
        <Box
            css={{
                maxW: "100%"
            }}
        >
            <Navbar isCompact isBordered variant="sticky">
                <Navbar.Brand>
                    <Text b color="inherit" hideIn="xs">
                        Fragments UI
                    </Text>
                </Navbar.Brand>
                <Navbar.Content>
                    <Navbar.Item>
                        {user ? (
                            <Button auto flat onClick={() => Auth.signOut()}>
                                Sign Out
                            </Button>
                        ) : (
                            <Button auto flat onClick={() => Auth.federatedSignIn()}>
                                Sign In
                            </Button>
                        )}
                    </Navbar.Item>
                    {user ? (
                        <Navbar.Item>
                            <Avatar
                                text={user.username}
                                color="gradient"
                                textColor="white" />
                        </Navbar.Item>
                    ) : (
                        <Navbar.Item>
                            <Button auto flat onClick={() => Auth.signOut()}>
                                Sign Up
                            </Button>
                        </Navbar.Item>
                    )}
                </Navbar.Content>
            </Navbar>
            <body>
            <div className="App">
                <header className="App-header">
                    <p>
                        {user ? `Hello, ${user.username}` : 'Please sign in.'}
                    </p>
                </header>
            </div>
            </body>
        </Box>
    )
}
