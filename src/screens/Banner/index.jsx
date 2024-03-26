import { Dimensions, StyleSheet, View, Image } from 'react-native';
import { SwiperFlatList } from 'react-native-swiper-flatlist';
import images from '../assets/images';
const Banner = ({ ...passProps }) => {
    const props = {
        ...passProps,
    };
    return (
        <View style={styles.container} {...props}>
            <SwiperFlatList
                autoplay
                autoplayDelay={2}
                autoplayLoop
                index={2}
                showPagination
                paginationStyleItem={{ width: 10, height: 10 }}
                data={images.chatImages}
                renderItem={({ item }) => (
                    <View style={[styles.child, { backgroundColor: item }]}>
                        <Image source={item} style={styles.image} />
                    </View>
                )}
            />
        </View>
    );
};

export default Banner;

const { width } = Dimensions.get('window');
const styles = StyleSheet.create({
    container: {
        height: 200,
        borderRadius: 5,
        overflow: 'hidden',
    },
    child: {
        width,
        justifyContent: 'center',
        alignItems: 'center',
    },
    image: {
        height: 200,
        resizeMode: 'contain',
    },
});
