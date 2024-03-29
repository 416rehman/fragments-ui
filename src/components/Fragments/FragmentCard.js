import {Card, Col, Row, Button, Text, Tooltip, Badge, Textarea, Popover, Dropdown} from "@nextui-org/react";
import {useState, useContext, useEffect} from "react";
import {DeleteIcon} from "../../icons/DeleteIcon";
import {EditIcon} from "../../icons/EditIcon";
import {Contexts} from "../../utils/contexts";
import {getUserFragment, updateUserFragment, deleteUserFragment} from "../../utils/api";
import {EyeIcon} from "../../icons/EyeIcon";
import {conversionTable, showConvertedData} from "../../utils/helpers";
import {LoadingIndicator} from "../LoadingIndicator";

export const FragmentCard = ({fragmentId, fragmentSize, fragmentType, createdAt, updatedAt, onDelete}) => {
    const user = useContext(Contexts)

    const [isLoading, setIsLoading] = useState(false)
    const [isEditing, setIsEditing] = useState(false)

    const [fragmentData, setFragmentData] = useState(null)
    const [fragment, setFragment] = useState(null)

    useEffect(() => {
        setFragment({
            id: fragmentId,
            size: fragmentSize,
            type: fragmentType,
            created: createdAt,
            updated: updatedAt
        })
    }, [fragmentId, fragmentSize, fragmentType, createdAt, updatedAt])

    const getFragmentData = () => {
        setIsLoading(true)
        getUserFragment(user, fragment.id).then((data) => {
            setFragmentData(data)
        }).finally(() => setIsLoading(false))
    }

    const editFragment = () => {
        if (isEditing) {
            if (isLoading) {
                return  // Don't allow editing while loading
            }
            setIsLoading(true)
            updateUserFragment(user, fragment.id, fragment.type, fragmentData)
                .then((result) => {
                    if (result?.status == "ok") {
                        setFragment({
                            ...result.fragment,
                        })
                    }
                })
                .finally(() => {
                    setIsLoading(false);
                    setIsEditing(false)
                });
        } else {
            setIsEditing(true)
        }
    }

    const deleteFragment = () => {
        if (isLoading) {
            return  // Don't allow deleting while loading
        }
        setIsLoading(true)
        deleteUserFragment(user, fragment.id)
            .then((result) => {
                if (result?.status == "ok") {
                    onDelete?.()
                }
            })
            .finally(() => setIsLoading(false));
    }

    const getBody = () => {
        if (!fragment || !fragment.id) {
            return null;
        }

        if (!fragmentData) {
            return (
                <Card.Body css={{width: "100%", height: "100%"}}>
                    <Button onPress={getFragmentData}>
                        Retrieve
                    </Button>
                </Card.Body>
            )
        }
        if (fragment.type.startsWith("image/")) {
            return (
                <Card.Body css={{p: 0}}>
                    <Card.Image
                        src={URL.createObjectURL(fragmentData)}
                        width="100%"
                        height="100%"
                        objectFit="cover"
                        alt="Fragment Image"
                    />
                </Card.Body>
            )
        } else {
            return (
                <Card.Body css={{width: "100%", height: "100%"}}>
                    <Textarea
                        readOnly={!isEditing}
                        aria-label={"Fragment Data"}
                        helperText={isEditing ? "Click the edit button to save changes" : ""}
                        helperColor={"primary"}
                        bordered={isEditing}
                        initialValue={showConvertedData(fragmentData)}
                        onChange={(e) => setFragmentData(e.target.value)}
                    />
                </Card.Body>
            )
        }
    }

    if (fragment?.id == null) {
        return null;
    }

    return (
        <Card css={{w: "100%", h: "400px"}}>
            <Card.Header css={{bg: "$primaryLight", p: 1, padding: 5}}>
                <Col css={{p: 1, borderRadius: "$md"}}>
                    <Row align={"baseline"}>
                        <Col>
                            <Row css={{gap: 5}}>
                                <Tooltip content={"Fragment Type"}>
                                    <Badge variant="flat" size={"xs"}>{fragment.type || "text/plain"}</Badge>
                                </Tooltip>
                                <Tooltip content={"Fragment Size"}>
                                    <Badge variant="bordered" size={"xs"}>{fragment.size || 0} Bytes</Badge>
                                </Tooltip>
                            </Row>
                        </Col>
                        <Col>
                            <Row justify={"flex-end"}>
                                <Text css={{
                                    color: "$accents7", fontWeight: "$medium", fontSize: "$xs", direction: "rtl"
                                }}>
                                    {new Date(fragment.updated) > new Date(fragment.created) ? "Updated On" : "Created On"} {new Date(fragment.updated).toLocaleString()}
                                </Text>
                            </Row>
                        </Col>
                    </Row>
                    <Row justify={"center"}>
                        <Tooltip content={"Fragment ID"}>
                            <Text
                                css={{
                                    color: "$accents6",
                                    fontWeight: "$normal",
                                    fontSize: "$xs"
                                }}>{fragment.id}</Text>
                        </Tooltip>
                    </Row>
                </Col>
            </Card.Header>
            <Card.Divider/>
            {isLoading ? LoadingIndicator() : getBody()}
            <Card.Divider/>
            <Card.Footer
                isBlurred
                css={{
                    position: "absolute",
                    bgBlur: "#ffffff66",
                    borderTop: "$borderWeights$light solid rgba(255, 255, 255, 0.2)",
                    bottom: 0,
                    zIndex: 1,
                }}
            >
                <Row justify="space-between">
                    <Tooltip content={"Delete"}>
                        <Button
                            auto
                            icon={<DeleteIcon size={20} fill={"currentColor"}/>}
                            color="neutral"
                            css={{borderRadius: "50%"}}
                            onPress={deleteFragment}
                        />
                    </Tooltip>
                    <Tooltip content={"View As"}>
                        <Popover isBordered>
                            <Popover.Trigger>
                                <Button
                                    auto
                                    icon={<EyeIcon size={20} fill={"currentColor"}/>}
                                    color="neutral"
                                    css={{borderRadius: "50%"}}
                                />
                            </Popover.Trigger>
                            <Popover.Content>
                                <FragmentViewer user={user} fragmentId={fragment.id} type={fragment.type}/>
                            </Popover.Content>
                        </Popover>
                    </Tooltip>
                    <Tooltip content={isEditing ? "Save" : "Edit"}>
                        <Button
                            auto
                            icon={<EditIcon size={20} fill={"currentColor"}/>}
                            color={isEditing ? "primary" : "neutral"}
                            css={{borderRadius: "50%"}}
                            onPress={editFragment}
                        />
                    </Tooltip>
                </Row>

            </Card.Footer>
        </Card>
    )
}

const FragmentViewer = ({user, fragmentId, type}) => {
    const [convertedData, setConvertedData] = useState(null)
    const [isLoading, setIsLoading] = useState(false)
    const [selectedExtension, setSelectedExtension] = useState(null)

    const getConvertedData = (as) => {
        setIsLoading(true)
        getUserFragment(user, fragmentId, as).then((data) => {
            setConvertedData(data)
        }).finally(() => setIsLoading(false))
    }

    useEffect(() => {
        if (fragmentId && selectedExtension) {
            getConvertedData(selectedExtension)
        }
    }, [fragmentId, selectedExtension])

    return (
        <Card>
            <Card.Header>
                <Row css={{gap: 5, alignItems: "center"}}>
                    <Text size={"xs"} css={{fontWeight: "$medium"}}>View As</Text>
                    <Dropdown>
                        <Dropdown.Button light css={{textTransform: "uppercase"}}>
                            {selectedExtension || "Format"}
                        </Dropdown.Button>
                        <Dropdown.Menu selectionMode={"single"} onSelectionChange={async (e) => {
                            setSelectedExtension([...e][0])
                        }}>
                            {conversionTable[type].map((ext) => (
                                <Dropdown.Item key={ext}>
                                    <Text css={{textTransform: "uppercase"}}>{ext}</Text>
                                </Dropdown.Item>
                            ))}
                        </Dropdown.Menu>
                    </Dropdown>
                </Row>
            </Card.Header>
            <Card.Divider/>
            <Card.Body>
                {/*The converted data could be a string or a blob or an object*/}
                {isLoading ? LoadingIndicator() : showConvertedData(convertedData)}
            </Card.Body>
        </Card>
    )
}