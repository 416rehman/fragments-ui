import {Radio, Textarea, useInput, Col, Dropdown, Row, Card, Button, Loading} from "@nextui-org/react";
import {useState, useMemo, useContext} from "react";
import {createUserFragment} from "../../utils/api";
import {UserContext} from "../../utils/userContext";

export default function NewFragment(props) {
    const supportedContentTypes = {
        "text/plain": "Text",
        "text/html": "HTML",
        "text/markdown": "Markdown",
        "image/png": "PNG Image",
        "image/jpeg": "JPEG Image",
        "image/gif": "GIF Image",
        "image/webp": "WebP Image",
    };
    const user = useContext(UserContext);
    const {
        value: controlledValue,
        setValue: setControlledValue,
        reset,
        bindings,
    } = useInput("");

    const [isLoading, setIsLoading] = useState(false)
    const [contentType, setContentType] = useState(new Set(["text/plain"]));
    const contentTypeKey = useMemo(
        () => [...contentType].map((type) => type).join(", "),
        [contentType]
    );

    const submitHandler = () => {
        setIsLoading(true)
        createUserFragment(user, controlledValue, contentTypeKey).then((result) => {
            if (result && result.status=="ok") {
                console.log("Fragment created successfully")
                props.onFragmentCreated(result.fragment)
                reset()
            }
        }).finally(() => setIsLoading(false))
    }

    return (
        <Card>
            <Card.Header>
                <Col>
                    <Radio.Group label="Options" defaultValue="1" orientation="horizontal">
                        <Radio value="1" description="Input your data directly" isSquared size="sm">
                            Input
                        </Radio>
                        <Radio value="2" description="Upload your data from a file" isSquared size="sm">
                            File
                        </Radio>
                    </Radio.Group>
                </Col>
                <Col>
                    <Row justify={"flex-end"}>
                        <Dropdown>
                            <Dropdown.Button
                                flat>{supportedContentTypes[contentTypeKey] || "Content Type"}</Dropdown.Button>
                            <Dropdown.Menu
                                aria-label="Dynamic Actions"
                                selectionMode="single"
                                items={Object.entries(supportedContentTypes).map(([key, value]) => ({
                                    key: key,
                                    value: value,
                                }))}
                                selectedKeys={"single"}
                                onSelectionChange={setContentType}
                            >
                                {(item) => (
                                    <Dropdown.Item key={item.key} value={item.value}> {item.value} </Dropdown.Item>
                                )}
                            </Dropdown.Menu>
                        </Dropdown>
                    </Row>
                </Col>
            </Card.Header>
            <Card.Divider/>
            <Card.Body>
                <Textarea {...bindings} css={{width: "100%", height: "100%"}}
                          aria-label="Write your fragment's data here"
                          placeholder="Write your fragment's data here"
                          onChange={(e) => setControlledValue(e.target.value)}
                />
            </Card.Body>
            <Card.Divider/>
            <Card.Footer>
                <Button auto color="gradient" onClick={submitHandler} disabled={isLoading}>
                    {isLoading ? <Loading type="points-opacity" color="currentColor" size="sm" /> : "Create"}
                </Button>
            </Card.Footer>
        </Card>
    );
}
