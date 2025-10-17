import { Tabs } from "expo-router";
import React from 'react';
import { Image, ImageBackground, Text } from "react-native";
import {images} from "@/assets/constants/images";


const TabIcon = ({ focused, icon, title}: any) => {
    if(focused){
        return(
            <>
                <ImageBackground
                    source={images.highlight}
                    className="flex flex-row w-full flex-1 min-w-[112px] min-h-16 mt-4 justify-center 
                    items-center rounded-full overflow-hidden"
                >
                    <Image source={icon} tintColor="#151312"
                    className="size-5"/>
                    <Text className="text-secondary text-base 
                    font-semibold ml-2">{title}</Text>
                </ImageBackground>    
            </>
        )
    }
}

const _Layout = () => {
    //instead of returning a View we are going to return using tabs
    //this one hides the file name of the tsx file
    return (
        <Tabs>
            <Tabs.Screen
                name = "index"
                options={{
                    title: 'Home',
                    headerShown: false
                }}
            />
            <Tabs.Screen
                name="search"
                options={{
                    title: 'Search',
                    headerShown: false
                }}
            />
            <Tabs.Screen
                name="saved"
                options={{
                    title: 'Saved',
                    headerShown: false
                }}
            />
            <Tabs.Screen
                name="profile"
                options={{
                    title: 'Profile',
                    headerShown: false
                }}
            />
        </Tabs>
    )
}

export default _Layout