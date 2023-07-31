import {
    Radio,
    Textarea,
    Text,
    useInput,
    Col,
    Dropdown,
    Row,
    Card,
    Button,
    Loading,
    Tooltip
} from "@nextui-org/react";
import {useState, useMemo, useContext, useRef} from "react";
import {createUserFragment} from "../../utils/api";
import {Contexts} from "../../utils/contexts";
import {DeleteIcon} from "../../icons/DeleteIcon";

const supportedContentTypes = {
    "text/plain": "Text",
    "text/html": "HTML",
    "text/markdown": "Markdown",
    "application/json": "JSON",
    "image/png": "PNG Image",
    "image/jpeg": "JPEG Image",
    "image/gif": "GIF Image",
    "image/webp": "WebP Image",
};

export default function NewFragment({onFragmentCreated}) {
    const user = useContext(Contexts);

    const [inputType, setInputType] = useState("input")


    return (
        <Card>
            <Card.Header>
                <Col>
                    <Radio.Group label="Options" defaultValue={inputType} orientation="horizontal"
                                 onChange={(value) => setInputType(value)}>
                        <Radio value="input" description="For text-based data" isSquared size="sm">
                            Text
                        </Radio>
                        <Radio value="file" description="For image-based data" isSquared size="sm">
                            Image
                        </Radio>
                    </Radio.Group>
                </Col>
            </Card.Header>
            <Card.Divider/>
            {inputType == "input" ? <TextFragment onFragmentCreated={onFragmentCreated} user={user}/> :
                <ImageFragment onFragmentCreated={onFragmentCreated} user={user}/>}
        </Card>
    );
}

function TextFragment({onFragmentCreated, user}) {
    const [contentType, setContentType] = useState(new Set(["text/plain"]));
    const [isLoading, setIsLoading] = useState(false)

    const {
        value: controlledValue,
        setValue: setControlledValue,
        reset,
        bindings,
    } = useInput("");

    const contentTypeKey = useMemo(
        () => [...contentType].map((type) => type).join(", "),
        [contentType]
    );
    const submitHandler = () => {
        setIsLoading(true)
        createUserFragment(user, controlledValue, contentTypeKey).then((result) => {
            if (result && result.status == 'ok') {
                onFragmentCreated(result.fragment)
                reset()
            }
        }).catch((err) => {
            alert(err.message)
        }).finally(() => setIsLoading(false))
    }

    return <>
        <Card.Body>
            <Col>
                <Row justify={"flex-end"}>
                    <Dropdown>
                        <Tooltip content={"Content Type"}>
                            <Dropdown.Button flat>
                                {supportedContentTypes[contentTypeKey] || "Content Type"}
                            </Dropdown.Button>
                        </Tooltip>
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
            <Textarea {...bindings} css={{width: "100%", height: "100%"}}
                      aria-label="Write your fragment's text data here"
                      placeholder="Write your fragment's text data here"
                      onChange={(e) => setControlledValue(e.target.value)}
            />
        </Card.Body>
        <Card.Divider/>
        <Card.Footer>
            <Button auto color="gradient" onPress={submitHandler} disabled={isLoading}>
                {isLoading ? <Loading type="points-opacity" color="currentColor" size="sm"/> : "Create"}
            </Button>
        </Card.Footer>
    </>
}

function ImageFragment({onFragmentCreated, user}) {
    const inputRef = useRef(null);
    const [isLoading, setIsLoading] = useState(false)
    const [file, setFile] = useState();

    const handleFileChange = (e) => {
        if (e.target.files) {
            setFile(e.target.files[0]);
        }
    };

    const handleUploadClick = () => {
        if (!file) {
            return;
        }

        if (!supportedContentTypes[file.type]) {
            alert("Unsupported file type");
            return;
        }

        if (file.size > 1024 * 1024 * 10) {
            alert("File size must be less than 10MB");
            return;
        }

        setIsLoading(true)
        createUserFragment(user, file, file.type).then((result) => {
            if (result && result.status == 'ok') {
                onFragmentCreated(result.fragment)
                setFile(null)
            }
        }).finally(() => setIsLoading(false))
    };

    return (
        <>
            <Card.Body>
                <input type="file" onChange={handleFileChange} style={{display: "none"}} ref={inputRef}
                       accept={"image/*"}/>
                {file ? (
                    <Row style={{alignItems: "center"}} justify={"center"}>
                        <Row style={{
                            backgroundColor: "rgba(0,0,0,0.1)",
                            padding: "0.5rem",
                            borderRadius: "0.5rem",
                            alignItems: "center",
                            gap: "0.5rem",
                            maxWidth: "500px",
                        }}>
                            <Col style={{
                                maxWidth: "400px",
                            }}>
                                <Text style={{
                                    whiteSpace: "nowrap",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis"
                                }} size="small">
                                    {file.name}
                                </Text>
                                <Text css={{color: "$accents7", fontWeight: "$semibold", fontSize: "$sm"}}>
                                    {file.size} bytes
                                </Text>
                                <Text css={{color: "$accents7", fontWeight: "$semibold", fontSize: "$sm"}}>
                                    {file.type}
                                </Text>
                            </Col>
                            <Button
                                auto
                                ghost
                                icon={<DeleteIcon fill={"currentColor"} size={20}/>}
                                color="error"
                                onPress={() => setFile(null)}
                            />
                        </Row>
                    </Row>
                ) : (
                    <Button auto onPress={() => inputRef.current.click()} style={{
                        backgroundColor: "rgb(32,150,14)",
                    }}>
                        Select an Image
                    </Button>
                )}
            </Card.Body>
            <Card.Divider/>
            <Card.Footer>
                <Button auto color="gradient" onPress={handleUploadClick} disabled={!file}>
                    {isLoading ? <Loading type="points-opacity" color="currentColor" size="sm"/> : "Upload"}
                </Button>
            </Card.Footer>
        </>
    );
}