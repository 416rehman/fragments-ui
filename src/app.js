import {Navbar, Button, Text, styled, Avatar} from "@nextui-org/react";
import {Auth, getUser} from './utils/auth.js';
import {useEffect, useState} from "react";
import Fragments from "./components/Fragments/Fragments";
import NewFragment from "./components/NewFragment/NewFragment";
import {UserContext} from "./utils/userContext";
import {getUserFragments} from "./utils/api";

const Box = styled("div", {
    boxSizing: "border-box",
});
export default function App() {
    const [user, setUser] = useState(null);
    const [fragments, setFragments] = useState([]);
    const [fragmentsLoading, setFragmentsLoading] = useState(false);

    useEffect(() => {
        getUser().then(setUser);
    }, []);

    useEffect(() => {
        if (user) {
            setFragmentsLoading(true);
            getUserFragments(user).then((result) => {
                setFragmentsLoading(false);
                if (result && result.status == "ok") {
                    setFragments(result.fragments);
                }
            });
        } else {
            setFragments([]);
        }
    }, [user]);

    const fragmentCreationHandler = (fragmentData) => {
        console.log("NEW FRAGMENT", fragmentData)
        setFragments([...fragments, fragmentData])
    }

    return (
        <UserContext.Provider value={user}>
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
                                    textColor="default"
                                />
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
                <Box className="App" css={{
                    maxW: 1000,
                    mx: "auto",
                    p: "2rem",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "2rem"
                }}>
                    <NewFragment onFragmentCreated={fragmentCreationHandler}/>
                    <Fragments fragments={fragments} loading={fragmentsLoading}/>
                </Box>
                </body>
            </Box>
        </UserContext.Provider>
    )
}
