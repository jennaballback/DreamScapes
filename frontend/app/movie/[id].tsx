
import { useLocalSearchParams } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

const MovieDetails = () => {
    const {id} = useLocalSearchParams();
    return(
        <View>
            <Text>Movie details: {id}</Text>
        </View>
    )
}
export default MovieDetails;

const styles = StyleSheet.create({})


/*
This whole file shows how you can take information from an href link and have it appear in your code
here in the index we had the line

<Link href="/movie/avengers">Avenger Movie</Link>


and then used the avengers part of the link and had it appear after haveing the [] to pass it
*/