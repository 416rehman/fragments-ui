import {Grid, Text, Loading} from "@nextui-org/react";
import {FragmentCard} from "./FragmentCard";

export default function Fragments(props) {
    const fragmentCards = props.fragments.map((fragment) => {
        return (
            <Grid xs={12} sm={4}>
                <FragmentCard fragmentId={fragment.id} fragmentSize={fragment.size}
                              fragmentType={fragment.type} fragmentData={fragment.data}
                              createdAt={fragment.created} updatedAt={fragment.updated}/>
            </Grid>
        )
    });

    return (
        <Grid.Container gap={2} justify="center">
            {
                props.loading ? (<Grid>
                        <Loading type="points-opacity"/>
                    </Grid>)
                    : (
                        props.fragments.length === 0 ? (
                            <Text h4>No fragments found</Text>
                        ) : fragmentCards
                    )
            }

        </Grid.Container>
    );
}
