



import { View, Text } from 'react-native';
import { AdvancedImage } from 'cloudinary-react-native';
import { cloudinary } from '../lib/cloudinary';

export default function Event() {
  return (
    <View>
      <Text className='text-white'>Event</Text>
      <AdvancedImage
        cldImg={cloudinary.image('cld-sample-2')}
        width={500}
        height={250}
      />
    </View>
  );
}
