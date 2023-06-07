import {Navbar, Button, Text, styled, Avatar, Row, Spacer, Popover} from "@nextui-org/react";
import {Auth, getUser} from './utils/auth.js';
import {useEffect, useState} from "react";
import Fragments from "./components/Fragments/Fragments";
import NewFragment from "./components/NewFragment/NewFragment";
import {Contexts} from "./utils/contexts";
import {getUserFragments} from "./utils/api";

import {useTheme as useNextTheme} from 'next-themes'
import {Switch, useTheme} from '@nextui-org/react'

const Box = styled("div", {
    boxSizing: "border-box",
});

export default function App() {
    const [user, setUser] = useState(null);
    const [fragments, setFragments] = useState([]);
    const [fragmentsLoading, setFragmentsLoading] = useState(false);

    const {setTheme} = useNextTheme();
    const {isDark, type} = useTheme();

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
        setFragments([...fragments, fragmentData])
    }

    const signedOutBody = (
        <>
            <Text
                h1
                css={{
                    textGradient: "45deg, $blue600 -20%, $pink600 50%",
                }}
                weight="bold"
            >
                Fragments UI
            </Text>
            <Text h3 color="secondary">
                A simple UI for Fragments.
            </Text>
            <Spacer y={2}/>
            <Row css={{gap: "0.5rem"}} align={"baseline"} justify={"center"}>
                <Button auto flat rounded color={"secondary"} size={"sm"} onClick={() => Auth.federatedSignIn()}>
                    Sign In
                </Button>
                <Text h3 color="secondary">
                    now to get started!
                </Text>
            </Row>

        </>
    )
    const body = (
        <>
            <NewFragment onFragmentCreated={fragmentCreationHandler}/>
            <Spacer y={2}/>
            <Fragments fragments={fragments} loading={fragmentsLoading}/>
        </>
    )
    return (
        <Contexts.Provider value={user}>
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
                            <Row css={{gap: "0.5rem"}} align={"baseline"}>
                                <Text size={"xs"}>Dark Mode</Text>
                                <Switch
                                    size={"xs"}
                                    checked={isDark}
                                    onChange={(e) => setTheme(e.target.checked ? 'dark' : 'light')}
                                />
                            </Row>
                        </Navbar.Item>
                        <Navbar.Item>
                            {user ? <></> : (
                                <Button auto flat onClick={() => Auth.federatedSignIn()}>
                                    Sign In
                                </Button>
                            )}
                        </Navbar.Item>
                        {user ? (
                            <Navbar.Item>
                                <Popover>
                                    <Popover.Trigger>
                                        <Avatar
                                            text={user.username}
                                            textColor="default"
                                            css={{
                                                cursor: "pointer",
                                            }}
                                        />
                                    </Popover.Trigger>
                                    <Popover.Content>
                                        <Button auto flat color={"error"} onClick={() => Auth.signOut()}>
                                            Sign Out
                                        </Button>
                                    </Popover.Content>
                                </Popover>
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
                <Box className="App" css={{
                    maxW: 1000,
                    mx: "auto",
                    p: "2rem",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                }}>
                    {user ? body : signedOutBody}
                </Box>
            </Box>
        </Contexts.Provider>
    )
}
