import {Button, Card, Loading} from "@nextui-org/react";

export const LoadingIndicator = () => {
    return (
        <Card.Body css={{width: "100%", height: "100%"}}>
            <Button>
                <Loading type="points-opacity"/>
            </Button>
        </Card.Body>
    )
}
