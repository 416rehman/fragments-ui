import {Grid, Text, Loading} from "@nextui-org/react";
import {FragmentCard} from "./FragmentCard";

export default function Fragments({fragments, loading, onDelete}) {
    const fragmentCards = fragments.map((fragment, index) => {
        if (fragment?.metadata) fragment = fragment?.metadata;
        return (
            <Grid xs={12} sm={4}>
                <FragmentCard fragmentId={fragment?.id} fragmentSize={fragment?.size}
                              fragmentType={fragment?.type} fragmentData={fragment?.data}
                              createdAt={fragment?.created} updatedAt={fragment?.updated} onDelete={() => onDelete(index)}/>
            </Grid>
        )
    });

    return (
        <Grid.Container gap={2} justify="center">
            {
                loading ? (<Grid>
                        <Loading type="points-opacity"/>
                    </Grid>)
                    : (
                        fragments.length === 0 ? (
                            <Text h4>No fragments found</Text>
                        ) : fragmentCards
                    )
            }

        </Grid.Container>
    );
}