import { Link } from "expo-router";

export default function Home() {
    return (
        <View style={StyleSheet.container}>  
            <Link href="/contact">Go to Contact App Access</Link>
            <Link href="/location">Go to Location App Access</Link>
            <Link href="/battery">Go to Battery App Access</Link>
        </View>
    )
}
const styles = StyleSheet.create({
    container: {flex:1,padding:20}
});
import {View, StyleSheet} from "react-native"
